package com.monumental.services;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Favorite;
import com.monumental.models.User;
import com.monumental.repositories.FavoriteRepository;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
     * explicitly specified, it will be used instead
     * @param monumentId - The Id of the Monument to check for a favorite of
     * @param userId - An optional override if not checking for a favorite for the running user
     * @return - The Favorite, if it exists, otherwise null
     * @throws ResourceNotFoundException - If there is no existing Favorite for the specified User and Monument, or
     *                                     there is no User for the specified userId
     */
    public Favorite getFavoriteByMonumentIdAndUserId(Integer monumentId, Integer userId) throws ResourceNotFoundException {
        User currentUser = this.userService.getCurrentUser();

        this.userService.requireUserExistsIfNotNull(userId);

        Favorite favorite = userId == null ?
                this.favoriteRepository.getByUserIdAndMonumentId(currentUser.getId(), monumentId) :
                this.favoriteRepository.getByUserIdAndMonumentId(userId, monumentId);

        if (favorite == null) throw new ResourceNotFoundException();

        return favorite;
    }

    /**
     * Get all Favorites for a User. By default, this uses the running user's Id. If userId is explicitly specified, it
     * will be used instead
     * @param userId - An optional override if not getting the favorites of the running user
     * @return - The Favorite, if it exists, otherwise null
     * @throws ResourceNotFoundException - If a userId is specified and no such User exists
     */
    public List<Favorite> getUserFavorites(Integer userId) throws ResourceNotFoundException {
        User currentUser = this.userService.getCurrentUser();

        this.userService.requireUserExistsIfNotNull(userId);

        List<Favorite> favorites = userId == null ?
                this.favoriteRepository.getAllByUserId(currentUser.getId()) :
                this.favoriteRepository.getAllByUserId(userId);
        for (Favorite favorite : favorites) {
            this.monumentService.loadLazyLoadedCollections(favorite.getMonument());
        }
        return favorites;
    }

    /**
     * @see FavoriteService#getUserFavorites(Integer)
     */
    public List<Favorite> getUserFavorites() throws ResourceNotFoundException {
        return this.getUserFavorites(null);
    }

    /**
     * Create a Favorite for the specified Monument. By default, this uses the running user's Id. If userId is
     * explicitly specified, it will be used instead
     * @param monumentId - The Id of the Monument to favorite
     * @param userId - An optional override if not favoriting for the running user
     * @return - The created Favorite
     */
    public Favorite createFavorite(Integer monumentId, Integer userId) {
        User currentUser = this.userService.getCurrentUser();

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
     * explicitly specified, it will be used instead
     * @param monumentId - The Id of the Monument to delete a favorite of
     * @param userId - An optional override if not deleting a favorite for the running user
     * @throws ResourceNotFoundException - If there is no existing Favorite for the specified User and Monument, or
     *                                     there is no User for the specified userId
     */
    public void deleteFavorite(Integer monumentId, Integer userId)
            throws ResourceNotFoundException {
        Favorite favorite = getFavoriteByMonumentIdAndUserId(monumentId, userId);
        this.favoriteRepository.delete(favorite);
    }
}
