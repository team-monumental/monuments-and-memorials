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

    constructor(props) {
        super(props);
        this.state = {
            orientation: '',
        };
        this.orientation = this.orientation.bind(this);
    }

    handlePageChange(page) {
        const { onPageChange } = this.props;
        onPageChange(page);
    }

    orientation() {
        let orientation = '';
        if(JSON.stringify(window.screen.orientation) === '{}') {
            if(window.innerWidth > window.innerHeight) {
                orientation = 'landscape';
            } else {
                orientation = 'portrait';
            }
        } else {
            orientation =  window.screen.orientation.type.split("-")[0];
        }
        this.setState({orientation: orientation});

    }

    componentDidMount() {
        window.addEventListener("orientationchange", this.orientation);
        window.addEventListener("resize", this.orientation);
        this.orientation();
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
                if(document.getElementById('search-column')) {
                    document.querySelector('search-column').scrollTo({top: 0});
                }else if(document.getElementById('search-row')) {
                    document.querySelector('search-row').scrollTo({top: 0});
                } else if(document.getElementById('search-full-page')) {
                    document.querySelector('search-full-page').scrollTo({top: 0});
                }
            }
        }
    }

    render() {
        const { monuments, onLimitChange, onSortChange, lat, lon, sort, distance, onFilterChange, tags, materials } = this.props;
        const [ count, page, limit ] = [ this.props.count, this.props.page, this.props.limit ]
            .map(value => parseInt(value) || 0);

        const pageCount = Math.ceil(count / limit);

        return (
                <div className="search-results-page">
                    {
                        this.state.orientation === 'landscape' && (window.innerWidth > 823 || window.innerHeight > 414) && <>
                            <div className="map-column">
                                <MapResults monuments={monuments} zoom={lat && lon ? 10 : 4} center={lat && lon ? [lat, lon] : null}/>
                            </div>
                            <div className="search-column">
                                <div className="search-header">
                                    <Filters onChange={filters => onFilterChange(filters)}
                                             showDistance={lat && lon} distance={distance}
                                             tags={tags} materials={materials}/>
                                    <SearchInfo count={count} page={page} limit={limit} sort={sort}
                                                onLimitChange={onLimitChange}
                                                onSortChange={onSortChange}
                                                showDistanceSort={lat && lon}/>
                                </div>
                                <div className="search-results">
                                    <SearchResults monuments={monuments} limit={limit} page={page}/>
                                </div>
                                <div className="pagination-container">
                                    <Pagination count={pageCount}
                                                page={page - 1}
                                                onPage={page => this.handlePageChange(page + 1)}/>
                                </div>
                            </div>
                        </>
                    }
                    {
                       this.state.orientation === 'portrait' && window.innerWidth > 414 && <>
                            <div className="search-row" id={this.state.orientation}>
                                <div className="search-header">
                                    <Filters onChange={filters => onFilterChange(filters)}
                                             showDistance={lat && lon} distance={distance}
                                             tags={tags} materials={materials}/>
                                    <SearchInfo count={count} page={page} limit={limit} sort={sort}
                                                onLimitChange={onLimitChange}
                                                onSortChange={onSortChange}
                                                showDistanceSort={lat && lon}/>
                                </div>
                                <div className="search-results">
                                    <SearchResults monuments={monuments} limit={limit} page={page}/>
                                </div>
                                <div className="pagination-container">
                                    <Pagination count={pageCount}
                                                page={page - 1}
                                                onPage={page => this.handlePageChange(page + 1)}/>
                                </div>
                            </div>
                            <div className="map-row">
                                <MapResults monuments={monuments} zoom={lat && lon ? 10 : 4} center={lat && lon ? [lat, lon] : null}/>
                            </div>
                        </>
                    }
                    {
                        ((this.state.orientation === 'portrait' && window.innerWidth <= 414) ||
                        (this.state.orientation === 'landscape' && window.innerWidth <= 823 && window.innerHeight <= 414)) && <>
                            <div className="search-full-page">
                                <div className="search-header">
                                    <Filters onChange={filters => onFilterChange(filters)}
                                             showDistance={lat && lon} distance={distance}
                                             tags={tags} materials={materials}/>
                                    <SearchInfo count={count} page={page} limit={limit} sort={sort}
                                                onLimitChange={onLimitChange}
                                                onSortChange={onSortChange}
                                                showDistanceSort={lat && lon}/>
                                </div>
                                <div className="search-results">
                                    <SearchResults monuments={monuments} limit={limit} page={page}/>
                                </div>
                                <div className="pagination-container">
                                    <Pagination count={pageCount}
                                                page={page - 1}
                                                onPage={page => this.handlePageChange(page + 1)}/>
                                </div>
                            </div>
                        </>
                    }
                </div>
        )
    }
}