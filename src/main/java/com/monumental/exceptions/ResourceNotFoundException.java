package com.monumental.exceptions;

import me.alidg.errors.annotation.ExceptionMapping;
import org.springframework.http.HttpStatus;

/**
 * Exception class used for HTTP Not Found statuses (404) when attempting to get a resource
 */
@ExceptionMapping(statusCode = HttpStatus.NOT_FOUND, errorCode = "resource.not_found")
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException() {
    }
}
