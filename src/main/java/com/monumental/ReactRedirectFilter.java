package com.monumental;

import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class ReactRedirectFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        String requestURI = req.getRequestURI();

        // Any requests to the API should continue on as normal and reach their API Controller
        if (requestURI.startsWith("/api")) {
            chain.doFilter(request, response);
            return;
        }

        // Assume that this always indicates a file request, which should proceed as normal
        // In the future we may need to make this more intelligent or narrow
        if (requestURI.contains(".")) {
            System.out.println(requestURI);
            chain.doFilter(request, response);
            return;
        }

        // All requests that are not to the API or for static files will be redirected to the index page
        // which will serve React and preserve the URL path, allowing React to see what page you were
        // trying to access and update its state accordingly
        request.getRequestDispatcher("/").forward(request, response);
    }
}
