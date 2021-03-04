import toasts from './reducers/toasts';
import errors from './reducers/errors';
import { monumentPage, createFavorite, deleteFavorite } from './reducers/monument';
import { searchPage, userSearchPage, createSuggestionSearchPage, updateSuggestionSearchPage,
    bulkCreateSuggestionSearchPage, bulkUpdateSuggestionSearchPage, pendingSuggestions } from './reducers/search';
import mapPage from './reducers/map';
import { tagsSearch, tagsLoad, materialsLoad, materialsSearch } from './reducers/tagsSearch';
import { createCreateSuggestion, createMonument } from './reducers/create'
import bulkCreatePage from './reducers/bulk';
import bulkUpdatePage from "./reducers/bulk-update";
import tagDirectoryPage from './reducers/tagDirectory';
import aboutPage from './reducers/about-page';
import { signup, login, session, confirmSignup, resendConfirmation, beginPasswordReset, finishPasswordReset } from './reducers/authentication';
import { updateMonumentPage, toggleMonumentIsActive, deleteMonument, updateMonument } from './reducers/update-monument';
import { updateUser, confirmEmailChange, fetchFavorites, fetchUser } from './reducers/user';
import duplicateMonuments from './reducers/duplicates';
import { fetchBulkCreateSuggestions, fetchCreateSuggestions, fetchBulkUpdateSuggestions, fetchUpdateSuggestions,
    fetchCreateSuggestion, fetchUpdateSuggestion, fetchBulkCreateSuggestion, fetchBulkUpdateSuggestion,
    approveCreateSuggestion, rejectCreateSuggestion, approveUpdateSuggestion,
    rejectUpdateSuggestion, approveBulkCreateSuggestion, rejectBulkCreateSuggestion, approveBulkUpdateSuggestion,
    rejectBulkUpdateSuggestion } from './reducers/suggestions';

// These reducers are loaded into redux in index.js
// New reducers must always be added here or they won't do anything
const Reducers = {
    toasts, errors, monumentPage, searchPage, mapPage, tagsSearch, tagsLoad, materialsSearch,
    materialsLoad, createCreateSuggestion, bulkCreatePage, bulkUpdatePage, tagDirectoryPage, aboutPage, updateMonumentPage,
    login, signup, session, confirmSignup, resendConfirmation, beginPasswordReset, finishPasswordReset,
    updateUser, confirmEmailChange, createFavorite, deleteFavorite, fetchFavorites, duplicateMonuments,
    toggleMonumentIsActive, deleteMonument, userSearchPage, fetchUser, fetchBulkCreateSuggestions, fetchCreateSuggestions,
    fetchBulkUpdateSuggestions, fetchUpdateSuggestions, fetchCreateSuggestion, fetchUpdateSuggestion, fetchBulkCreateSuggestion,
    fetchBulkUpdateSuggestion, createSuggestionSearchPage, updateSuggestionSearchPage, bulkCreateSuggestionSearchPage,
    bulkUpdateSuggestionSearchPage, createMonument, updateMonument, pendingSuggestions, approveCreateSuggestion,
    rejectCreateSuggestion, approveUpdateSuggestion, rejectUpdateSuggestion, approveBulkCreateSuggestion,
    rejectBulkCreateSuggestion, approveBulkUpdateSuggestion, rejectBulkUpdateSuggestion
};

export default Reducers;