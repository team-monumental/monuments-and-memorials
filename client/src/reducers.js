import toasts from './reducers/toasts';
import errors from './reducers/errors';
import {createFavorite, deleteFavorite, monumentPage} from './reducers/monument';
import {
    bulkCreateSuggestionSearchPage,
    createSuggestionSearchPage,
    pendingSuggestions,
    searchPage,
    updateSuggestionSearchPage,
    userSearchPage
} from './reducers/search';
import mapPage from './reducers/map';
import {materialsLoad, materialsSearch, tagsLoad, tagsSearch} from './reducers/tagsSearch';
import {createCreateSuggestion, createMonument} from './reducers/create'
import bulkCreatePage from './reducers/bulk';
import tagDirectoryPage from './reducers/tagDirectory';
import aboutPage from './reducers/about-page';
import {
    beginPasswordReset,
    confirmSignup,
    finishPasswordReset,
    login,
    resendConfirmation,
    session,
    signup
} from './reducers/authentication';
import {deleteMonument, toggleMonumentIsActive, updateMonument, updateMonumentPage} from './reducers/update-monument';
import {confirmEmailChange, fetchFavorites, fetchUser, updateUser} from './reducers/user';
import duplicateMonuments from './reducers/duplicates';
import {
    approveBulkCreateSuggestion,
    approveCreateSuggestion,
    approveUpdateSuggestion,
    fetchBulkCreateSuggestion,
    fetchBulkCreateSuggestions,
    fetchCreateSuggestion,
    fetchCreateSuggestions,
    fetchUpdateSuggestion,
    fetchUpdateSuggestions,
    rejectBulkCreateSuggestion,
    rejectCreateSuggestion,
    rejectUpdateSuggestion
} from './reducers/suggestions';

// These reducers are loaded into redux in index.js
// New reducers must always be added here or they won't do anything
const Reducers = {
    toasts,
    errors,
    monumentPage,
    searchPage,
    mapPage,
    tagsSearch,
    tagsLoad,
    materialsSearch,
    materialsLoad,
    createCreateSuggestion,
    bulkCreatePage,
    tagDirectoryPage,
    aboutPage,
    updateMonumentPage,
    login,
    signup,
    session,
    confirmSignup,
    resendConfirmation,
    beginPasswordReset,
    finishPasswordReset,
    updateUser,
    confirmEmailChange,
    createFavorite,
    deleteFavorite,
    fetchFavorites,
    duplicateMonuments,
    toggleMonumentIsActive,
    deleteMonument,
    userSearchPage,
    fetchUser,
    fetchBulkCreateSuggestions,
    fetchCreateSuggestions,
    fetchUpdateSuggestions,
    fetchCreateSuggestion,
    fetchUpdateSuggestion,
    fetchBulkCreateSuggestion,
    createSuggestionSearchPage,
    updateSuggestionSearchPage,
    bulkCreateSuggestionSearchPage,
    createMonument,
    updateMonument,
    pendingSuggestions,
    approveCreateSuggestion,
    rejectCreateSuggestion,
    approveUpdateSuggestion,
    rejectUpdateSuggestion,
    approveBulkCreateSuggestion,
    rejectBulkCreateSuggestion
};

export default Reducers;