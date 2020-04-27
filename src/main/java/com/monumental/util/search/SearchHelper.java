package com.monumental.util.search;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

/**
 * Class containing static methods useful for building JPA Criteria API queries
 */
public class SearchHelper {

    /**
     * Build a pg_tgrm similarity function Expression for the given searchQuery and fieldName
     * Utilizes a JPA Criteria Root to execute the query
     * @param builder - CriteriaBuilder to use to build the similarity Expression
     * @param root - Root to use to build the similarity Expression
     * @param searchQuery - String for the search query to use in the similarity function
     * @param fieldName - String for the field name to query against
     * @return Expression<Number> - Expression representing the pg_tgrm similarity function expression using the
     * specified searchQuery and fieldName
     */
    public static Expression<Number> buildSimilarityExpression(CriteriaBuilder builder, Root root, String searchQuery,
                                                               String fieldName) {
        /* "coalesce" here will cause null values to return as 0 instead. This is important because if a field is null,
           similarity and word_similarity return null, which when added to the other fields' scores makes the whole thing null
           We're also multiplying word_similarity by 5 here because this is generally more meaningful than simple similarity
           However we still include similarity because if the search term isn't like any word in any of the monuments,
           we still want to return something at least a little similar as there may have been a spelling error
         */
        return builder.sum(
                builder.coalesce(builder.function("similarity", Number.class, root.get(fieldName), builder.literal(searchQuery)), 0),
                builder.prod(
                    builder.coalesce(
                        builder.function("word_similarity", Number.class, root.get(fieldName), builder.literal(searchQuery)),
                        0
                    ),
                    5
                )
        );
    }

    /**
     * Build a pg_tgrm similarity function Expression for the given searchQuery and fieldName
     * Utilizes a JPA Criteria Join to execute the query
     * @param builder - CriteriaBuilder to use to build the similarity Expression
     * @param join - Join to use to build the similarity Expression
     * @param searchQuery - String for the search query to use in the similarity function
     * @param fieldName - String for the field name to query against
     * @return Expression<Number> - Expression representing the pg_tgrm similarity function expression using the
     * specified searchQuery and fieldName
     */
    public static Expression<Number> buildSimilarityExpression(CriteriaBuilder builder, Join join, String searchQuery,
                                                               String fieldName) {
        return builder.function("similarity", Number.class, join.get(fieldName), builder.literal(searchQuery));
    }

    /**
     * Build a Predicate for the specified pg_tgrm similarity expression
     * @param builder - CriteriaBuilder to use to build the similarity Predicate
     * @param expression - pg_tgrm similarity Expression to use to build the Predicate
     * @param threshold - The threshold (0-1) to limit the results by. You can learn about this score at: https://www.postgresql.org/docs/9.6/pgtrgm.html
     * @return Predicate - Predicate built using the specified builder and expression
     */
    public static Predicate buildSimilarityPredicate(CriteriaBuilder builder, Expression<Number> expression,
                                                     Double threshold) {
        return builder.gt(expression, threshold);
    }

    /**
     * Order search results by the sum of the pg_tgrm similarity scores used to search for them
     * @param builder - The CriteriaBuilder to use to help build the CriteriaQuery
     * @param query - The CriteriaQuery to add the ordering logic to
     * @param expressions - The pg_tgrm similarity query expressions that were used for the search
     */
    public static void orderSimilarityResults(CriteriaBuilder builder, CriteriaQuery query,
                                                   List<Expression<Number>> expressions) {
        Expression<Number> sum;
        if (expressions.size() == 1) {
            sum = expressions.get(0);
        }
        else {
            // Dynamically sum up all the expressions
            sum = builder.sum(expressions.remove(0), expressions.remove(0));
            while (expressions.size() > 0) {
                sum = builder.sum(sum, expressions.remove(0));
            }
        }
        query.orderBy(builder.desc(sum));
    }

    /**
     * Execute the specified query using the specified predicates
     * @param builder - The CriteriaBuilder used to help build the CriteriaQuery
     * @param query - The CriteriaQuery to execute using the specified predicates
     * @param predicates - List of Predicates to execute using the specified CriteriaQuery
     */
    public static void executeQueryWithPredicates(CriteriaBuilder builder, CriteriaQuery query,
                                                  List<Predicate> predicates) {
        switch(predicates.size()) {
            case 0:
                return;
            case 1:
                query.where(predicates.get(0));
                break;
            default:
                Predicate[] predicatesArray = new Predicate[predicates.size()];
                predicatesArray = predicates.toArray(predicatesArray);
                query.where(builder.and(predicatesArray));
        }
    }

    /**
     * Creates a search query on various fields of MonumentSuggestion and adds it to the specified CriteriaQuery
     * @param builder - The CriteriaBuilder to use to help build the CriteriaQuery
     * @param query - The CriteriaQuery to add the searching logic to
     * @param root - The Root to use with the CriteriaQuery
     * @param userJoin - The Join between the target Suggestion table and the User table to utilize for searching
     * @param searchQuery - The search query String that will be used to search against Users names and emails using
     * pg_tgrm
     * @param isApproved - True to filter to only approved MonumentSuggestions, False otherwise
     * @param isRejected - True to filter to only rejected MonumentSuggestions, False otherwise
     * @param orderBySimilarity - True to order the results based on the pg_tgrm similarity score, False otherwise
     * @param isCreateSuggestion - True if the MonumentSuggestion search query that is being built is for
     * CreateMonumentSuggestions, False otherwise
     */
    public static void buildSuggestionSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, Join userJoin,
                                                  String searchQuery, boolean isApproved, boolean isRejected,
                                                  boolean orderBySimilarity, boolean isCreateSuggestion) {
        List<Predicate> predicates = new ArrayList<>();

        if (!isNullOrEmpty(searchQuery) && userJoin != null) {
            predicates.add(buildSuggestionUserSearchQuery(builder, query, userJoin, searchQuery, orderBySimilarity));
        }

        predicates.add(builder.equal(root.get("isApproved"), builder.literal(isApproved)));
        predicates.add(builder.equal(root.get("isRejected"), builder.literal(isRejected)));

        // Special case for CreateMonumentSuggestions: Only search the ones that are NOT part of a BulkCreateMonumentSuggestion
        if (isCreateSuggestion) {
            predicates.add(builder.isNull(root.get("bulkCreateSuggestion")));
        }

        executeQueryWithPredicates(builder, query, predicates);
    }

    /**
     * Uses the specified Join to the User table to create a filter on MonumentSuggestions so that only those with a
     * created by User that has a similar first name, last name or email to the specified searchQuery are returned
     * @param builder - The CriteriaBuilder to use to help build the query
     * @param query - The CriteriaQuery to add the searching logic to
     * @param userJoin - The Join from the target Suggestion table to the User table to use for searching created by
     * Users names and emails
     * @param searchQuery - The search query String to filter Users names and emails by
     * @param orderBySimilarity - True to order the results by the pg_tgrm similarity score, False otherwise
     * @return Predicate - Predicate for the user search filter using the specified builder, query, root and searchQuery
     */
    @SuppressWarnings("unchecked")
    private static Predicate buildSuggestionUserSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Join userJoin,
                                                            String searchQuery, boolean orderBySimilarity) {
        // Build the similarity expressions for first name, last name and email
        List<Expression<Number>> expressions = new ArrayList<>();
        Expression<Number> firstNameExpression = buildSimilarityExpression(builder, userJoin, searchQuery, "firstName");
        Expression<Number> lastNameExpression = buildSimilarityExpression(builder, userJoin, searchQuery, "lastName");
        Expression<Number> emailExpression = buildSimilarityExpression(builder, userJoin, searchQuery, "email");
        expressions.add(firstNameExpression);
        expressions.add(lastNameExpression);
        expressions.add(emailExpression);

        if (orderBySimilarity) {
            orderSimilarityResults(builder, query, expressions);
        }

        // Select the MonumentSuggestions where the User's first name, last name or email are similar to the specified
        // searchQuery
        return builder.or(
            buildSimilarityPredicate(builder, firstNameExpression, 0.1),
            buildSimilarityPredicate(builder, lastNameExpression, 0.1),
            buildSimilarityPredicate(builder, emailExpression, 0.1)
        );
    }
}