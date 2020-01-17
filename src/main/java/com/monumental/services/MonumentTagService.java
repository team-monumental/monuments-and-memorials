package com.monumental.services;

import com.monumental.models.MonumentTag;
import com.monumental.models.Tag;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MonumentTagService extends ModelService<MonumentTag> {

    /**
     * Gets the related Tags and sets them on the MonumentTag objects, using only one extra SQL query
     * @param monumentTags MonumentTags to get the related Tags for - these objects are updated directly using the
     * setter but no database update is called
     */
    public void getRelatedTags(List<MonumentTag> monumentTags) {
        if (monumentTags == null || monumentTags.size() == 0) {
            return;
        }

        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<MonumentTag> query = this.createCriteriaQuery(builder, false);
        Root<MonumentTag> root = this.createRoot(query);
        query.select(root);
        root.fetch("tag", JoinType.LEFT);

        List<Integer> ids = new ArrayList<>();
        for (MonumentTag monumentTag : monumentTags) {
            ids.add(monumentTag.getId());
        }

        query.where(
            root.get("id").in(ids)
        );

        List<MonumentTag> monumentTagsWithTags = this.getWithCriteriaQuery(query);

        Map<Integer, Tag> tagByMonumentTagId = new HashMap<>();
        for (MonumentTag monumentTag : monumentTagsWithTags) {
            tagByMonumentTagId.put(monumentTag.getId(), monumentTag.getTag());
        }

        for (MonumentTag monumentTag : monumentTags) {
            try {
                MonumentTag.class.getDeclaredMethod("setTag", Tag.class).invoke(monumentTag, tagByMonumentTagId.get(monumentTag.getId()));
            } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException e) {
                System.err.println("Invalid field name: tag");
                System.err.println("Occurred while trying to use setter: setTag");
                e.printStackTrace();
            }
        }
    }
}
