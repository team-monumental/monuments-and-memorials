package com.monumental.services;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Favorite;
import com.monumental.models.Role;
import com.monumental.models.User;
import com.monumental.repositories.FavoriteRepository;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    FavoriteRepository favoriteRepository;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MonumentRepository monumentRepository;

    @Autowired
    MonumentService monumentService;

    /**
     * Check if a User has favorited a specific Monument. By default, this uses the running user's Id. If userId is
     * explicitly specified, it will be used instead if the running user has permission to view that user's favorites
     * @param monumentId - The Id of the Monument to check for a favorite of
     * @param userId - An optional override if not checking for a favorite for the running user
     * @return - The Favorite, if it exists, otherwise null
     * @throws HttpClientErrorException.Forbidden - If a userId is specified and the running user does not have permission
     *                                              to view that user's favorites
     * @throws ResourceNotFoundException - If there is no existing Favorite for the specified User and Monument
     */
    public Favorite getFavorite(Integer monumentId, Integer userId)
            throws HttpClientErrorException.Forbidden, ResourceNotFoundException {
        User currentUser = this.userService.getCurrentUser();

        this.validateUserCanViewFavorites(currentUser, userId);

        Favorite favorite = userId == null ?
                this.favoriteRepository.getByUserIdAndMonumentId(currentUser.getId(), monumentId) :
                this.favoriteRepository.getByUserIdAndMonumentId(userId, monumentId);

        if (favorite == null) throw new ResourceNotFoundException();
        return favorite;
    }

    /**
     * Get all Favorites for a User. By default, this uses the running user's Id. If userId is explicitly specified, it
     * will be used instead if the running user has permission to view that user's favorites
     * @param userId - An optional override if not getting the favorites of the running user
     * @return - The Favorite, if it exists, otherwise null
     * @throws HttpClientErrorException.Forbidden - If a userId is specified and the running user does not have permission
     *                                              to view that user's favorites
     */
    public List<Favorite> getUserFavorites(Integer userId) throws HttpClientErrorException.Forbidden {
        User currentUser = this.userService.getCurrentUser();

        this.validateUserCanViewFavorites(currentUser, userId);

        List<Favorite> favorites = userId == null ?
                this.favoriteRepository.getAllByUserId(currentUser.getId()) :
                this.favoriteRepository.getAllByUserId(userId);
        for (Favorite favorite : favorites) {
            this.monumentService.loadLazyLoadedCollections(favorite.getMonument());
        }
        return favorites;
    }

    public List<Favorite> getUserFavorites() throws HttpClientErrorException.Forbidden {
        return this.getUserFavorites(null);
    }

    /**
     * Create a Favorite for the specified Monument. By default, this uses the running user's Id. If userId is
     * explicitly specified, it will be used instead if the running user has permission to change that user's favorites
     * @param monumentId - The Id of the Monument to favorite
     * @param userId - An optional override if not favoriting for the running user
     * @return - The created Favorite
     * @throws HttpClientErrorException.Forbidden - If a userId is specified and the running user does not have permission
     *                                              to change that user's favorites
     */
    public Favorite createFavorite(Integer monumentId, Integer userId) throws HttpClientErrorException.Forbidden {
        User currentUser = this.userService.getCurrentUser();

        this.validateUserCanManageFavorites(currentUser, userId);

        Favorite favorite = new Favorite(
            userId == null ?
                currentUser :
                this.userRepository.getOne(userId),
            this.monumentRepository.getOne(monumentId)
        );

        this.favoriteRepository.save(favorite);
        return favorite;
    }

    /**
     * Delete a Favorite for a specific Monument. By default, this uses the running user's Id. If userId is
     * explicitly specified, it will be used instead if the running user has permission to change that user's favorites
     * @param monumentId - The Id of the Monument to delete a favorite of
     * @param userId - An optional override if not deleting a favorite for the running user
     * @throws HttpClientErrorException.Forbidden - If a userId is specified and the running user does not have permission
     *                                              to change that user's favorites
     * @throws ResourceNotFoundException - If there is no existing Favorite for the specified User and Monument
     */
    public void deleteFavorite(Integer monumentId, Integer userId)
            throws HttpClientErrorException.Forbidden, HttpClientErrorException.NotFound {
        User currentUser = this.userService.getCurrentUser();

        this.validateUserCanManageFavorites(currentUser, userId);

        Favorite favorite = userId == null ?
                this.favoriteRepository.getByUserIdAndMonumentId(currentUser.getId(), monumentId) :
                this.favoriteRepository.getByUserIdAndMonumentId(userId, monumentId);

        if (favorite == null) throw new ResourceNotFoundException();
        this.favoriteRepository.delete(favorite);
    }

    /**
     * Checks that the currentUser can view the Favorites of the specified userId. If userId is null this will always
     * assume that this means that the running user is the target, and no exception will be thrown
     * @param currentUser - The running User
     * @param userId - The userId to check against
     * @throws HttpClientErrorException.Forbidden - If a userId is specified and the running user does not have permission
     *                                              to view that user's favorites
     */
    private void validateUserCanViewFavorites(User currentUser, Integer userId)
            throws HttpClientErrorException.Forbidden {
        if (userId != null && currentUser.getRole().equals(Role.COLLABORATOR)) {
            throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "You cannot view other users' favorites");
        }
    }

    /**
     * Checks that the currentUser can change the Favorites of the specified userId. If userId is null this will always
     * assume that this means that the running user is the target, and no exception will be thrown
     * @param currentUser - The running User
     * @param userId - The userId to check against
     * @throws HttpClientErrorException.Forbidden - If a userId is specified and the running user does not have permission
     *                                              to change that user's favorites
     */
    private void validateUserCanManageFavorites(User currentUser, Integer userId)
            throws HttpClientErrorException.Forbidden {
        if (userId != null && !currentUser.getRole().equals(Role.RESEARCHER)) {
            throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "You cannot change other users' favorites");
        }
    }
}
