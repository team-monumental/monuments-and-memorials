package com.monumental.util.string.unittests;

import com.monumental.util.string.StringHelper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

/**
 * Test class for unit testing StringHelper
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class StringHelperUnitTests {

    /**
     * isNullOrEmpty Tests
     **/

    @Test
    public void testStringHelper_isNullOrEmpty_NullString() {
        String string = null;

        assertTrue(StringHelper.isNullOrEmpty(string));
    }

    @Test
    public void testStringHelper_isNullOrEmpty_EmptyString() {
        String string = "";

        assertTrue(StringHelper.isNullOrEmpty(string));
    }

    @Test
    public void testStringHelper_isNullOrEmpty_NotNullOrEmptyString() {
        String string = "string";

        assertFalse(StringHelper.isNullOrEmpty(string));
    }

    /**
     * removeBeginningAndEndingQuotes Tests
     **/

    @Test
    public void testStringHelper_removeBeginningAndEndingQuotes_NullString() {
        assertNull(StringHelper.removeBeginningAndEndingQuotes(null));
    }

    @Test
    public void testStringHelper_removeBeginningAndEndingQuotes_NoQuotesInString() {
        String string = "Test";

        String result = StringHelper.removeBeginningAndEndingQuotes(string);

        assertEquals(string, result);
    }

    @Test
    public void testStringHelper_removeBeginningAndEndingQuotes_QuotesInMiddleOfString() {
        String string = "Te\"\"st";

        String result = StringHelper.removeBeginningAndEndingQuotes(string);

        assertEquals(string, result);
    }

    @Test
    public void testStringHelper_removeBeginningAndEndingQuotes_BeginningQuotesNoEndingQuotes() {
        String string = "\"Test";

        String result = StringHelper.removeBeginningAndEndingQuotes(string);

        assertEquals(string, result);
    }

    @Test
    public void testStringHelper_removeBeginningAndEndingQuotes_NoBeginningQuotesEndingQuotes() {
        String string = "Test\"";

        String result = StringHelper.removeBeginningAndEndingQuotes(string);

        assertEquals(string, result);
    }

    @Test
    public void testStringHelper_removeBeginningAndEndingQuotes_BeginningQuotesEndingQuotes() {
        String string = "\"Test\"";

        String result = StringHelper.removeBeginningAndEndingQuotes(string);

        assertEquals("Test", result);
    }

    @Test
    public void testStringHelper_removeBeginningAndEndingQuotes_BeginningQuotesEndingQuotesWithMiddleQuotes() {
        String string = "\"Te\"st\"";

        String result = StringHelper.removeBeginningAndEndingQuotes(string);

        assertEquals("Te\"st", result);
    }

    /**
     * parseState Tests
     **/

    @Test
    public void testStringHelper_parseState_NullPassed() {
        assertNull(StringHelper.parseState(null));
    }

    @Test
    public void testStringHelper_parseState_EmptyStringPassed() {
        assertNull(StringHelper.parseState(""));
    }

    @Test
    public void testStringHelper_parseState_ColoradoAbbreviation() {
        String result = StringHelper.parseState("co");

        assertEquals("Colorado", result);
    }

    @Test
    public void testStringHelper_parseState_ColoradoAbbreviation_MixedCase() {
        String result = StringHelper.parseState("cO");

        assertEquals("Colorado", result);
    }

    @Test
    public void testStringHelper_parseState_ColoradoFullName() {
        String result = StringHelper.parseState("colorado");

        assertEquals("Colorado", result);
    }

    @Test
    public void testStringHelper_parseState_ColoradoFullName_MixedCase() {
        String result = StringHelper.parseState("ColorADo");

        assertEquals("Colorado", result);
    }

    @Test
    public void testStringHelper_parseState_PuertoRicoAbbreviation() {
        String result = StringHelper.parseState("PR");

        assertEquals("Puerto Rico", result);
    }

    @Test
    public void testStringHelper_parseState_PuertoRicoAbbreviation_MixedCase() {
        String result = StringHelper.parseState("Pr");

        assertEquals("Puerto Rico", result);
    }

    @Test
    public void testStringHelper_parseState_PuertoRicoFullName() {
        String result = StringHelper.parseState("puerto rico");

        assertEquals("Puerto Rico", result);
    }

    @Test
    public void testStringHelper_parseState_PuertoRicoFullName_MixedCase() {
        String result = StringHelper.parseState("pUERTo RicO");

        assertEquals("Puerto Rico", result);
    }
}
