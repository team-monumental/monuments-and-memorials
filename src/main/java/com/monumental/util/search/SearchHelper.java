package com.monumental.util.search;

import javax.persistence.criteria.*;
import java.util.List;

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
        return builder.function("similarity", Number.class, root.get(fieldName), builder.literal(searchQuery));
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
     * @param builder - CriteriaBuilder to use to build the similary Predicate
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
}
