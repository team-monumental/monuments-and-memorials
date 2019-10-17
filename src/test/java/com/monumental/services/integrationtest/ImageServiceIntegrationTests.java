package com.monumental.services.integrationtest;


import com.monumental.models.Image;
import com.monumental.models.Monument;
import com.monumental.services.ImageService;
import com.monumental.services.MonumentService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class ImageServiceIntegrationTests {

    @Autowired
    private ImageService imageService;

    @Autowired
    private MonumentService monumentService;

    /**
     * Tests ImageService's getByMonumentId and the underlying ModelService's getByForeignKey
     */
    @Test
    public void testImageService_GetByMonumentId() {
        List<Integer> monumentIds = setupMonumentsAndImages();
        assertEquals(2, monumentIds.size());

        List<Image> firstImages = imageService.getByMonumentId(monumentIds.get(0));
        assertEquals(2, firstImages.size());
        for (Image image : firstImages) {
            assert(Arrays.asList("url1", "url2").contains(image.getUrl()));
            assertEquals(monumentIds.get(0), image.getMonument().getId());
        }

        List<Image> secondImages = imageService.getByMonumentId(monumentIds.get(1));
        assertEquals(1, secondImages.size());
        assertEquals("url3", secondImages.get(0).getUrl());
        assertEquals(monumentIds.get(1), secondImages.get(0).getMonument().getId());
    }

    /**
     * Helper that sets up 2 Monuments and 3 Images, with 2 Images related to the same Monument
     */
    private List<Integer> setupMonumentsAndImages() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setArtist("Artist 1");

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setArtist("Artist 2");

        List<Integer> monumentIds = monumentService.insert(Arrays.asList(monument1, monument2));

        Image image1 = new Image();
        image1.setMonument(monument1);
        image1.setUrl("url1");

        Image image2 = new Image();
        image2.setMonument(monument1);
        image2.setUrl("url2");

        Image image3 = new Image();
        image3.setMonument(monument2);
        image3.setUrl("url3");

        imageService.insert(Arrays.asList(image1, image2, image3));

        return monumentIds;
    }
}
