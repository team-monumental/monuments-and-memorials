package com.monumental.exceptions;

import me.alidg.errors.annotation.ExceptionMapping;
import org.springframework.http.HttpStatus;

/**
 * Exception class used for failed login attempts (401)
 */
@ExceptionMapping(statusCode = HttpStatus.UNAUTHORIZED, errorCode = "resource.not_found")
public class InvalidEmailOrPasswordException extends RuntimeException {

    public InvalidEmailOrPasswordException() {

    }

    public InvalidEmailOrPasswordException(String message) {
        super(message);
    }
}
