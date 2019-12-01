package com.monumental.util.csvparsing;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static com.monumental.util.csvparsing.CsvFileHelper.isCsvFile;
import static org.junit.Assert.*;

/**
 * Test class for unit testing CsvFileHelper
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class CsvFileHelperUnitTests {

    /* isCsvFile Tests */

    @Test
    public void testCsvFileHelper_isCsvFile_CsvFilePassed() {
        assertTrue(isCsvFile("test.csv"));
    }

    @Test
    public void testCsvFileHelper_isCsvFile_NonCsvFilePassed() {
        assertFalse(isCsvFile("test.txt"));
    }

    @Test
    public void testCsvFileHelper_isCsvFile_CsvFilePathPassed() {
        assertTrue(isCsvFile("test/test/test.csv"));
    }

    @Test
    public void testCsvFileHelper_isCsvFile_NonCsvFilePathPassed() {
        assertFalse(isCsvFile("test/test/test/test.txt"));
    }
}
