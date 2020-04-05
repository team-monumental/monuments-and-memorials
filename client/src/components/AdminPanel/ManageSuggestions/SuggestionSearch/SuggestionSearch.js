import * as React from 'react';
import SuggestionSearchBar from './SuggestionSearchBar/SuggestionSearchBar';
import SearchInfo from '../../../Search/SearchInfo/SearchInfo';

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
                    {/* TODO: Render Suggestion search results */}
                </>}
            </div>
        );
    }
}