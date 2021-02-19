import * as React from 'react';
import './Filters.scss';
import { withRouter } from 'react-router-dom';
import { Collapse, Button } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import LocationSearch from './FilterTypes/LocationFilter/LocationFilter';
import search from '../../../utils/new-search';
import TagsSearch from './FilterTypes/TagsFilters/TagsFilters';
import DateFilter from './FilterTypes/DateFilter/DateFilter';
import TextFilter from './FilterTypes/TextFilter/TextFilter';
import * as QueryString from 'query-string';
import { Link } from 'react-router-dom';
import {Mode} from './FilterTypes/DateFilter/DateEnum';


class Filters extends React.Component {


    constructor(props) {
        super(props);
        const params = QueryString.parse(props.history.location.search);
        this.state = {
            filterList: {
                date: { config: {}, params: {} },
                location: { params: {
                        address: params.address || '',
                        lat: params.lat || '',
                        lon: params.lon || '',
                        d: params.d || '25'
                    }},
                tags: { config: {}, params: {} },
                materials: { config: {}, params: {} },
                q: {params: { q: params.q || ''}},
            },
            
            showFilters: false,
        };
    }

    async clearFilter(type) {
        await this.setState(state => {
            const daFilters = state.filterList;
            daFilters[type].params = {};
            return { filterList: daFilters };
        })
        this.handleSearch()
    }

    async clearFilters() {
        await this.setState(state => {
            const daFilters = {
                date: { config: {filterMode: Mode.NONE}, params: {} },
                location: { config: {}, params: {d: '25', address: ''} },
                tags: { config: {}, params: {} },
                materials: { config: {}, params: {} },
                q: {params: {q: ''}}
            }
            return { filterList: daFilters};
        })
        this.handleSearch()
    }

    async expand() {
        this.setState(state => {
            return { showFilters: !state.showFilters }
        })
    }

    async handleSearch() {
        const { uri } = this.props;
        const try1 = {}
        for (var filterType in this.state.filterList) {
            var curPar = this.state.filterList[filterType]
            for (let parName in curPar.params) {
                try1[parName] = (curPar.params[parName])
            }
        }
        search(try1, this.props.history, uri);

    }
    handleDateSearchSelect(params) {
        const updatedState = this.state.filterList.date
        updatedState.params = params
        this.setState({
            ...this.state,
            ...updatedState
        })
        this.handleSearch()
    }

    handleTagsSearchTagSelect(variant, selectedTags) {
        this.setState(state => {
            const daFilters = state.filterList;
            daFilters[variant].params[variant] = selectedTags.map(tag => tag.name);
            return { filterList: daFilters }
        })
        this.handleSearch()
    }

    async handleLocationSearchSelect(lat, lon, address) {
        var updatedState = this.state.filterList.location
        updatedState.params = { lat: lat, lon: lon, address: address }
        this.setState({
            ...this.state,
            ...updatedState
        })
        this.handleSearch()
    }

    async handleChangeDistance(value) {
        var updatedState = this.state.filterList.location
        updatedState.params.d = value
        this.setState({
            ...this.state,
            ...updatedState
        })
        this.handleSearch()
    }

    handleTextSearchChange(textSearchQuery) {
        var updatedState = this.state.filterList.q
        updatedState.params.q = textSearchQuery
        this.setState({
            ...this.state,
            ...updatedState
        })
    }


    handleKeyDown(event) {
        if (event.key === 'Enter') this.handleSearch();
    }

    render() {

        const { decades } = this.props
        const { showFilters, filterList} = this.state;
        const expandIcon = showFilters ? "remove" : "add";
        let dateMap = (
            <DateFilter 
                onRemove={() => this.clearFilter('date')}
                data={filterList.date}
                decades={decades}
                onChange={(dateParams) => this.handleDateSearchSelect(dateParams)}>
            </DateFilter>)

        let tagsMap = (
            <div className="filter-body border-right" >
                
                <TagsSearch
                    variant="tags"
                    tags={filterList.tags.params}
                    allowTagCreation={false}
                    onChange={(variant, params) => this.handleTagsSearchTagSelect(variant, params)}>
                </TagsSearch>
                <button className="clear-button" onClick={() => this.clearFilter('tags')}>
                    <i className="material-icons ">clear</i>
                </button>
            </div>);

        let materialsMap = (
            <div className="filter-body">
                
                <TagsSearch
                    variant="materials"
                    tags={filterList.materials.params}
                    selectedTags={filterList.materials.params.tags}
                    allowTagCreation={false}
                    onChange={(variant, params) => this.handleTagsSearchTagSelect(variant, params)}>
                </TagsSearch>
                <button style={{ backgroundColor: "white", border: "none" }} onClick={() => this.clearFilter('materials')}>
                    <i className="material-icons ">clear</i>
                </button>
            </div>)

        return (

            <div className="filters">
                <div className="text-search-header">
                    <TextFilter value={filterList.q.params.q}
                        onKeyDown={event => this.handleKeyDown(event)}
                        className="form-control form-control-sm"
                        onSearchChange={(searchQuery) => this.handleTextSearchChange(searchQuery)}
                        onClear={() => this.clearFilter('q')} />
                    <Button variant="primary btn-sm" className="search-button" onClick={() => this.handleSearch()}><span>Search  <i className="material-icons ">search</i></span></Button>
                </div>
                <div className="location-row">
                    <LocationSearch value={filterList.location.params.address}
                        distance={filterList.location.params.d}
                        onSuggestionSelect={(lat, lon, address) => this.handleLocationSearchSelect(lat, lon, address)}
                        onClear={()=> this.clearFilter('location')}
                        changeDistance={(distance) => this.handleChangeDistance(distance)}>
                    </LocationSearch>
                    <div className="clear-filters">
                        <button className="bg-danger" onClick={() => this.clearFilters()}>
                            <span>Clear All</span>
                        </button>
                    </div>
                </div>
                <div className="filter-header">
                    <div className="expander" onClick={() => this.expand()}>
                        <i className="material-icons">{expandIcon}</i>
                        <span>{showFilters ? "Hide" : "Filters"}</span>
                    </div>
                </div>
                <Collapse in={showFilters}>
                    <div>
                        <div className="type-header">
                            <p>Date</p>
                        </div>
                        {dateMap}

                        <div className="tags-row">
                            <div className="tags-col">
                                <div className="type-header border-right">
                                    <p>Tags</p>
                                </div>
                                {tagsMap}
                            </div>
                            <div className="tags-col">
                                <div className="type-header">
                                    <p>Materials</p>
                                </div>
                                {materialsMap}
                            </div>
                            
                        </div>
                        <div className="tag-link">
                            <Link to="/tag-directory" target="_blank">List of Tags/Materials</Link>
                        </div>
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default withRouter(Filters);
