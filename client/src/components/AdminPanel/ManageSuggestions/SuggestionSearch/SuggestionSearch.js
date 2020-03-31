import * as React from 'react';

export default class SuggestionSearch extends React.Component {

    render() {
        const { showSearchResults, onLimitChange, onPageChange, limit, page, count, suggestions } = this.props;
        const pageCount = Math.ceil(count / limit);

        return (
            <div className="suggestion-search">
                <div className="sticky-top">

                </div>
            </div>
        );
    }
}