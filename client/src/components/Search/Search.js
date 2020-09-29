import React from 'react';
import './Search.scss';
import Pagination from '../Pagination/Pagination';
import MapResults from './MapResults/MapResults';
import Filters from './Filters/Filters';
import SearchInfo from './SearchInfo/SearchInfo';
import SearchResults from './SearchResults/SearchResults';
import * as moment from 'moment';
import BulkExportToPdfButton from '../Export/BulkExportToPdfButton/BulkExportToPdfButton';
import {buildBulkExportData, exportFields} from '../../utils/export-util';

/**
 * Root presentational component for the search page
 */
export default class Search extends React.Component {
    handlePageChange(page) {
        const { onPageChange } = this.props;
        onPageChange(page);
    }

    /**
     * Whenever the monuments list changes (in length or at least one id has changed), scroll the search results
     * up to the top, so that we see the first of the new results instead of wherever we might have been
     * scrolled to before
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.monuments && this.props.monuments) {
            let didChange = false;
            if (prevProps.monuments.length !== this.props.monuments.length) {
                didChange = true;
            } else {
                prevProps.monuments.forEach((monument, index) => {
                    if (this.props.monuments[index].id !== monument.id) didChange = true;
                });
            }
            if (didChange) {
                let searchColumn = document.querySelector('.search-column');
                if (searchColumn) searchColumn.scrollTo({top: 0});
            }
        }
    }

    render() {
        const {
            monuments, onLimitChange, onSortChange, lat, lon, sort, d: distance, decade,
            onFilterChange, tags, materials, start, end, hideMap, hideImages, searchUri, monumentUri
        } = this.props;
        const [ count, page, limit ] = [ this.props.count, this.props.page, this.props.limit ]
            .map(value => parseInt(value) || 0);

        const pageCount = Math.ceil(count / limit);

        // Create an array of decades from the monument years, then remove any duplicates and sort
        const decades = [...new Set(monuments.map(monument => {
            const date = moment(monument.date);
            // Turn the year into its decade
            return Math.floor(date.year() / 10) * 10;
        }).sort())];

        const exportData = buildBulkExportData(monuments)

        return (
            <div className="search-results-page">
                {!hideMap &&
                    <div className="map-column d-none d-md-flex">
                        <MapResults monuments={monuments} zoom={lat && lon ? 10 : 4} center={lat && lon ? [lat, lon] : null}/>
                    </div>
                }
                <div className="search-column">
                    <div className="search-header">
                        <Filters onChange={filters => onFilterChange(filters)}
                                     showDistance={lat && lon} distance={distance}
                                     tags={tags} materials={materials} decades={decades} decade={decade}
                                     start={start} end={end} uri={searchUri}/>
                        <SearchInfo count={count} page={page} limit={limit} sort={sort}
                                    onLimitChange={onLimitChange}
                                    onSortChange={onSortChange}
                                    showDistanceSort={lat && lon}/>
                    </div>
                    <div className="search-results">
                        <BulkExportToPdfButton className="mt-2" fields={exportFields}
                                           data={exportData}
                                           exportTitle={`${searchUri} ${moment().format('YYYY-MM-DD hh:mm')}`}/>
                        <SearchResults monuments={monuments} limit={limit} page={page} hideImages={hideImages} searchUri={searchUri || '/search'} monumentUri={monumentUri || '/monuments'}/>
                    </div>
                    <div className="pagination-container">
                        <Pagination count={pageCount}
                                    page={page - 1}
                                    onPage={page => this.handlePageChange(page + 1)}/>
                    </div>
                </div>
            </div>
        )
    }
}