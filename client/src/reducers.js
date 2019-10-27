import toasts from './reducers/toasts';
import errors from './reducers/errors';
import monumentPage from './reducers/monument';
import searchPage from './reducers/search';

// These reducers are loaded into redux in index.js
// New reducers must always be added here or they won't do anything
const Reducers = {toasts, errors, monumentPage, searchPage};

export default Reducers;