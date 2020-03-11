import * as React from 'react';
import SearchResult from '../SearchResult/SearchResult';

export default class SearchResults extends React.Component {

    render() {
        const { monuments, limit, page, hideImages, monumentUri, searchUri } = this.props;
        if (monuments && monuments.length) {
            return (
                <div>{
                    monuments.filter(result => result).map(
                        (result, index) => (
                            <SearchResult key={result.id} monument={result} index={index + ((page - 1) * limit)}
                                          includeIndexInTitle hideImages={hideImages} monumentUri={monumentUri} searchUri={searchUri}/>
                        )
                    )
                }</div>
            )
        }
        return (
            <div className="mb-4 mt-3 text-center">No search results were found. Try broadening your search.</div>
        );
    }
}