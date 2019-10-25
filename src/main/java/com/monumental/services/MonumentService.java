package com.monumental.services;

import com.monumental.models.Monument;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class MonumentService extends ModelService<Monument> {

    public MonumentService(SessionFactoryService sessionFactoryService) {
        super(sessionFactoryService);
    }

    /**
     * Creates a Full Text Search on the Monument's title and artist fields, and adds them to your CriteriaQuery
     * @param builder       Your CriteriaBuilder
     * @param query         Your CriteriaQuery
     * @param root          The root associated with your CriteriaQuery
     * @param searchQuery   The string to search both fields for
     */
    private void buildFTSQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery) {
        query.where(
            builder.or(
                builder.gt(builder.function("similarity", Number.class, root.get("title"), builder.literal(searchQuery)), 0.1),
                builder.gt(builder.function("similarity", Number.class, root.get("artist"), builder.literal(searchQuery)), 0.1)
            )
        );
    }

    /**
     * Uses the FTS function as well as any filtering or pagination provided to search for matching Monuments
     */
    @SuppressWarnings("unchecked")
    public List<Monument> search(String searchQuery, String page, String limit) {

        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        root.fetch("tags", JoinType.LEFT);
        query.select(root);

        // TODO: Query for tags
        // TODO: Query for location
        // TODO: Filters

        if (searchQuery != null) {
            this.buildFTSQuery(builder, query, root, searchQuery);

            List<Order> orderList = new ArrayList<>();
            orderList.add(builder.desc(
                builder.function("similarity", Number.class, root.get("title"), builder.literal(searchQuery))
            ));
            orderList.add(builder.desc(
                builder.function("similarity", Number.class, root.get("artist"), builder.literal(searchQuery))
            ));
            query.orderBy(orderList);
        }

        List<Monument> monuments = this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1);

        List<Integer> ids = new ArrayList<>();
        List<Monument> uniqueMonuments = new ArrayList<>();
        for (Monument m : monuments) {
            System.out.println(m.getId());
            if (ids.contains(m.getId())) {
                System.out.println("skipped");
                continue;
            }
            ids.add(m.getId());
            uniqueMonuments.add(m);
        }

        return uniqueMonuments;
    }

    /**
     * Count the total number of results for a FTS search
     * TODO: Be sure to update this whenever the search function changes so that they stay in sync
     */
    public Integer countSearchResults(String searchQuery) {

        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Monument> root = query.from(Monument.class);
        query.select(builder.countDistinct(root));

        this.buildFTSQuery(builder, query, root, searchQuery);

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }
}
