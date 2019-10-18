package com.monumental.exceptions;

/**
 * Exception class used when there was an attempted duplicate insert into the database
 */
public class DuplicateRecordException extends RuntimeException {

    public DuplicateRecordException() {}
}
