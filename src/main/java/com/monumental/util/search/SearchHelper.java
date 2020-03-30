package com.monumental.util.search;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

/**
 * Class containing static methods useful for building JPA Criteria API queries
 */
public class SearchHelper {

    /**
     * Build a pg_tgrm similarity function Expression for the given searchQuery and fieldName
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
}
