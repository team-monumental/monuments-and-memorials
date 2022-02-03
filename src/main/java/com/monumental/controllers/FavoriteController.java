package com.monumental.controllers;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.Favorite;
import com.monumental.security.Authentication;
import com.monumental.security.Authorization;
import com.monumental.security.Role;
import com.monumental.services.FavoriteService;
import com.monumental.services.MonumentService;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

@RestController
@Transactional
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private UserService userService;

    @GetMapping("/api/favorite")
    @PreAuthorize(Authentication.isAuthenticated)
    public Favorite getFavorite(@RequestParam Integer monumentId, @RequestParam(required = false) Integer userId)
            throws UnauthorizedException, AccessDeniedException {
        if (userId != null && !userId.equals(this.userService.getCurrentUser().getId())) {
            this.userService.requireUserIsInRoles(Role.PARTNER_OR_ABOVE);
        }
        return this.favoriteService.getFavoriteByMonumentIdAndUserId(monumentId, userId);
    }

    @GetMapping("/api/favorites")
    @PreAuthorize(Authentication.isAuthenticated)
    public List<Favorite> getUserFavorites(@RequestParam(value = "cascade", defaultValue = "false") Boolean cascade)
            throws UnauthorizedException {
        List<Favorite> favorites = this.favoriteService.getUserFavorites();

        if (cascade) {
            favorites.forEach(favorite -> this.monumentService.initializeAllLazyLoadedCollections(favorite.getMonument()));
        }

        return favorites;
    }

    @GetMapping("/api/favorites/{userId}")
    @PreAuthorize(Authorization.isPartnerOrAbove)
    public List<Favorite> getUserFavorites(@PathVariable(value = "userId", required = false) Integer userId,
                                           @RequestParam(value = "cascade", defaultValue = "false") Boolean cascade)
            throws ResourceNotFoundException, UnauthorizedException {
        List<Favorite> favorites = this.favoriteService.getUserFavorites(userId);

        if (cascade) {
            favorites.forEach(favorite -> this.monumentService.initializeAllLazyLoadedCollections(favorite.getMonument()));
        }

        return favorites;
    }

    @PostMapping("/api/favorite")
    @PreAuthorize(Authentication.isAuthenticated)
    public Favorite createFavorite(@RequestBody FavoriteRequest request) throws UnauthorizedException {
        return this.favoriteService.createFavorite(request.monumentId, request.userId);
    }

    @DeleteMapping("/api/favorite")
    @PreAuthorize(Authentication.isAuthenticated)
    public Map<String, Boolean> deleteFavorite(@RequestBody FavoriteRequest request)
            throws ResourceNotFoundException, UnauthorizedException {
        this.favoriteService.deleteFavorite(request.monumentId, request.userId);
        return Map.of("success", true);
    }

    private static class FavoriteRequest {
        public Integer userId;
        public Integer monumentId;
    }
}
