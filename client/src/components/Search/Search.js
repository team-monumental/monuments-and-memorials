import React from 'react';
import './Search.scss';
import Pagination from '../Pagination/Pagination';
import MapResults from './MapResults/MapResults';
import Filters from './Filters/Filters';
import SearchInfo from './SearchInfo/SearchInfo';
import SearchResults from './SearchResults/SearchResults';

/**
 * Root presentational component for the search page
 */
export default class Search extends React.Component {

    render() {
        const { monuments, onLimitChange, onPageChange } = this.props;
        const [ count, page, limit ] = [
            parseInt(this.props.count) || 0, parseInt(this.props.page) || 0, parseInt(this.props.limit) || 0
        ];

        const pageCount = Math.ceil(count / limit);

        return (
                <div className="search-results-page">
                    <div className="map-column">
                        <MapResults monuments={monuments} zoom={4}/>
                    </div>
                    <div className="search-column">
                        <div className="search-header">
                            <Filters/>
                            <SearchInfo count={count} page={page} limit={limit} onLimitChange={onLimitChange}/>
                        </div>
                        <div className="search-results">
                            <SearchResults monuments={monuments} limit={limit} page={page}/>
                        </div>
                        <div className="pagination-container">
                            <Pagination count={pageCount}
                                        page={page - 1}
                                        onPage={page => onPageChange(page + 1)}/>
                        </div>
                    </div>
                </div>
        )
    }
}