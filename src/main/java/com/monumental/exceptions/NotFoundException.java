package com.monumental.exceptions;

import me.alidg.errors.annotation.ExceptionMapping;
import org.springframework.http.HttpStatus;

/**
 * Exception class used for HTTP Not Found statuses (404)
 * Extends the RuntimeException class
 */
@ExceptionMapping(statusCode = HttpStatus.NOT_FOUND, errorCode = "notFound")
public class NotFoundException extends RuntimeException {

    /**
     * Public constructor for a new NotFoundException
     * @param message - Message for the exception, as a String
     */
    public NotFoundException(String message) {
        super(message);
    }
}
