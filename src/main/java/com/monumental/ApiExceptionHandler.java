package com.monumental;

import com.monumental.exceptions.*;
import com.monumental.util.string.StringHelper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import javax.validation.ValidationException;
import java.io.IOException;

/**
 * This class is responsible for intercepting all API exceptions and deciding what should happen with the HTTP response
 * It also is able to log these exceptions, which is really helpful for debugging since Spring doesn't always print
 * stacktraces for most exceptions
 */
@ControllerAdvice
public class ApiExceptionHandler {

    // Handler for ResourceNotFoundExceptions
    @ExceptionHandler({ ResourceNotFoundException.class })
    public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException exception) {
        ApiError apiError = new ApiError(HttpStatus.NOT_FOUND,
                StringHelper.isNullOrEmpty(exception.getMessage()) ?
                        "Requested resource not found" :
                        exception.getMessage()
        );
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    private ResponseEntity<Object> handleLoginException(Exception exception) {
        ApiError apiError = new ApiError(HttpStatus.FORBIDDEN,
                StringHelper.isNullOrEmpty(exception.getMessage()) ?
                        "Invalid email or password." :
                        exception.getMessage()
        );
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    // Handler for InvalidEmailOrPasswordExceptions
    @ExceptionHandler({ InvalidEmailOrPasswordException.class })
    public ResponseEntity<Object> handleInvalidEmailOrPasswordException(InvalidEmailOrPasswordException exception) {
        return handleLoginException(exception);
    }

    @ExceptionHandler({ ValidationException.class })
    public ResponseEntity<Object> handleValidationException(ValidationException exception) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST,
                StringHelper.isNullOrEmpty(exception.getMessage()) ?
                        "Bad Request" :
                        exception.getMessage()
        );
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    @ExceptionHandler({ UsernameNotFoundException.class })
    public ResponseEntity<Object> handleUsernameNotFoundException(UsernameNotFoundException exception) {
        return handleLoginException(exception);
    }

    @ExceptionHandler({ BadCredentialsException.class })
    public ResponseEntity<Object> handleBadCredentialsException(BadCredentialsException exception) {
        return handleLoginException(exception);
    }

    // Handler for UnauthorizedException
    @ExceptionHandler({ UnauthorizedException.class })
    public ResponseEntity<Object> handleUnauthorizedException(UnauthorizedException exception) {
        ApiError apiError = new ApiError(HttpStatus.UNAUTHORIZED,
                StringHelper.isNullOrEmpty(exception.getMessage()) ?
                        HttpStatus.UNAUTHORIZED.getReasonPhrase() :
                        exception.getMessage()
        );
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    @ExceptionHandler({ AccessDeniedException.class })
    public ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException exception) {
        ApiError apiError = new ApiError(HttpStatus.FORBIDDEN,
                StringHelper.isNullOrEmpty(exception.getMessage()) ?
                        HttpStatus.FORBIDDEN.getReasonPhrase() :
                        exception.getMessage()
        );
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    // Handler for InvalidZipExceptions
    @ExceptionHandler({ InvalidZipException.class })
    public ResponseEntity<Object> handleIllegalArgumentException(InvalidZipException exception) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, exception.getMessage());
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    // Handler for IOExceptions
    @ExceptionHandler({ IOException.class })
    public ResponseEntity<Object> handleIOException(IOException exception) {
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to process file");
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    // Handler for MaxUploadSizeExceededExceptions
    @ExceptionHandler({ MaxUploadSizeExceededException.class })
    public ResponseEntity<Object> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException exception) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, "The uploaded file is too large. The largest file upload size supported is 500MB");
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    // Handler for IllegalArgumentExceptions
    @ExceptionHandler({ IllegalArgumentException.class })
    public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException exception) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, exception.getMessage());
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    // Handler for all other Exceptions
    @ExceptionHandler({ Exception.class })
    public ResponseEntity<Object> handle(Exception ex) {
        ex.printStackTrace();

        ApiError apiError;
        if (ex instanceof NullPointerException) {
            apiError = new ApiError(HttpStatus.BAD_REQUEST, "Bad request");
            return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
        }
        apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }
}
