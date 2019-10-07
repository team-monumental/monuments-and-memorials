package com.monumental.services.exceptions;

import me.alidg.errors.annotation.ExceptionMapping;
import me.alidg.errors.annotation.ExposeAsArg;
import org.springframework.http.HttpStatus;

/**
 * Exception class used for HTTP Not Found statuses (404) when attempting to get a Monument record
 * Extends the RuntimeException class
 */
@ExceptionMapping(statusCode = HttpStatus.NOT_FOUND, errorCode = "monument.not_found")
public class MonumentNotFoundException extends RuntimeException {

    /**
     * Public constructor for a new MonumentNotFoundException
     */
    public MonumentNotFoundException() {
    }
}
