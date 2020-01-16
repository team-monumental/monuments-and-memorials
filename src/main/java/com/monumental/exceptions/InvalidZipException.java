package com.monumental.exceptions;

/**
 * Exception class used when an invalid .zip file is submitted for Bulk Monument Creation
 */
public class InvalidZipException extends RuntimeException {

    public InvalidZipException(String message) {
        super(message);
    }
}
