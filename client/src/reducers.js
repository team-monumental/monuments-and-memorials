import toasts from './reducers/toasts';
import errors from './reducers/errors';
import monumentPage from './reducers/monument';
import searchPage from './reducers/search';
import mapPage from './reducers/map';
import { tagsSearch, tagsLoad, materialsLoad, materialsSearch } from './reducers/tagsSearch';
import createPage from './reducers/create'
import bulkCreatePage from './reducers/bulk';
import tagDirectoryPage from './reducers/tagDirectory';
import aboutPage from './reducers/about-page';
import { signup, login } from './reducers/authentication';
import updateMonumentPage from './reducers/update-monument';

// These reducers are loaded into redux in index.js
// New reducers must always be added here or they won't do anything
const Reducers = {
    toasts, errors, monumentPage, searchPage, mapPage, tagsSearch, tagsLoad, materialsSearch,
    materialsLoad, createPage, bulkCreatePage, tagDirectoryPage, aboutPage, updateMonumentPage,
    login, signup
};

export default Reducers;