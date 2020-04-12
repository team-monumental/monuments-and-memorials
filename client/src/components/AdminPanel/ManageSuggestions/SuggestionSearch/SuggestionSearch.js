import * as React from 'react';
import SuggestionSearchBar from './SuggestionSearchBar/SuggestionSearchBar';
import SearchInfo from '../../../Search/SearchInfo/SearchInfo';
import SuggestionSearchResults from './SuggestionSearchResults/SuggestionSearchResults';
import Pagination from '../../../Pagination/Pagination';

export default class SuggestionSearch extends React.Component {

    render() {
        const { showSearchResults, onLimitChange, onPageChange, limit, page, count, suggestions } = this.props;
        const pageCount = Math.ceil(count / limit);

        return (
            <div className="suggestion-search">
                <div className="sticky-top">
                    <SuggestionSearchBar/>
                    {showSearchResults &&
                        <div className="mt-2">
                            <SearchInfo onLimitChange={onLimitChange} limit={limit} page={page} count={count} hideSortBy/>
                        </div>
                    }
                </div>
                {showSearchResults && <>
                    <SuggestionSearchResults suggestions={suggestions}/>
                    <div className="pagination-container">
                        <Pagination count={pageCount}
                                    page={page - 1}
                                    onPage={page => onPageChange(page + 1)}/>
                    </div>
                </>}
            </div>
        );
    }
}