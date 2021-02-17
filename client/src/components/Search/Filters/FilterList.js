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

class Filters extends React.Component {


    constructor(props) {
        super(props);
        const params = QueryString.parse(props.history.location.search);
        this.state = {
            filterList: {
                date: [{ config: {}, params: {} }],
                location: [{ config: {}, params: {} }],
                tags: [{ config: {}, params: {} }],
                materials: [{ config: {}, params: {} }]
            },
            textSearchQuery: params.q || '',
            locationAddress: params.address || '',
            showFilters: false,
        };
    }


    async addFilter(type) {
        console.log(type)
        this.setState(state => {
            const daFilters = state.filterList;
            daFilters[type].push({ config: {}, params: {} });
            return { filterList: daFilters };
        })
    }

    async removeFilter(type, id) {
        console.log(type)
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
                date: [{ config: {}, params: {} }],
                location: [{ config: {}, params: {} }],
                tags: [{ config: {}, params: {} }],
                materials: [{ config: {}, params: {} }]
            }
            return { filterList: daFilters, textSearchQuery: '', locationAddress: '' };
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
            for (var i in curPar) {
                for (let parName in curPar[i].params) {
                    if (!try1[parName]) {
                        try1[parName] = []
                    }
                    if (curPar[i].params[parName]) try1[parName].push(curPar[i].params[parName])
                }
            }
        }
        try1.q = this.state.textSearchQuery;
        search(try1, this.props.history, uri);

    }
    handleDateSearchSelect(params, id) {
        const updatedState = this.state.filterList.date
        updatedState[id].params = params
        this.setState({
            ...this.state,
            ...updatedState
        })
        this.handleSearch()
    }

    handleTagsSearchTagSelect(variant, selectedTags, id) {
        this.setState(state => {
            const daFilters = state.filterList;
            daFilters[variant][id].params[variant] = selectedTags.map(tag => tag.name);
            return { filterList: daFilters }
        })
        this.handleSearch()
    }

    async handleLocationSearchSelect(lat, lon, address, id) {
        const updatedState = this.state.filterList.location
        updatedState[id].params = { lat: lat, lon: lon, address: address }
        this.setState({
            ...this.state,
            ...updatedState
        })
        this.handleSearch()
    }

    async handleChangeDistance(value, id) {
        const updatedState = this.state.filterList.location
        updatedState[id].params.d = value
        this.setState({
            ...this.state,
            ...updatedState
        })
        this.handleSearch()
    }

    handleTextSearchChange(textSearchQuery) {
        this.setState({ textSearchQuery: textSearchQuery });
    }

    async handleTextSearchClear() {
        await this.setState({ textSearchQuery: '' });
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') this.handleSearch();
    }

    render() {

        const { decades } = this.props
        const { showFilters, textSearchQuery, locationAddress } = this.state;
        const expandIcon = showFilters ? "remove" : "add";

        let dateMap = this.state.filterList.date.map((params, index) => (
            <DateFilter key={index.toString()}
                onRemove={() => this.removeFilter('date', index)}
                data={params}
                decades={decades}
                onChange={(params) => this.handleDateSearchSelect(params, index)}>
            </DateFilter>))

        let tagsMap = this.state.filterList.tags.map((params, index) => (
            <div className="filter-body border-right" key={index.toString()}>
                
                <TagsSearch
                    variant="tags"
                    tags={params}
                    allowTagCreation={false}
                    onChange={(variant, params) => this.handleTagsSearchTagSelect(variant, params, index)}>
                </TagsSearch>
                <button className="clear-button" onClick={() => this.removeFilter('tags', index)}>
                    <i className="material-icons ">clear</i>
                </button>
            </div>));

        let materialsMap = this.state.filterList.materials.map((params, index) => (
            <div className="filter-body" key={index.toString()}>
                
                <TagsSearch
                    variant="materials"
                    tags={params}
                    allowTagCreation={false}
                    onChange={(variant, params) => this.handleTagsSearchTagSelect(variant, params, index)}>
                </TagsSearch>
                <button style={{ backgroundColor: "white", border: "none" }} onClick={() => this.removeFilter('materials', index)}>
                    <i className="material-icons ">clear</i>
                </button>
            </div>))

        return (

            <div className="filters">
                <div className="text-search-header">
                    <TextFilter value={textSearchQuery}
                        onKeyDown={event => this.handleKeyDown(event)}
                        className="form-control form-control-sm"
                        onSearchChange={(searchQuery) => this.handleTextSearchChange(searchQuery)}
                        onClear={() => this.handleTextSearchClear()} />
                    <Button variant="primary btn-sm" className="search-button" onClick={() => this.handleSearch()}><span>Search  <i className="material-icons ">search</i></span></Button>
                </div>
                <div className="location-row">
                    <LocationSearch value={locationAddress}
                        onSuggestionSelect={(lat, lon, address) => this.handleLocationSearchSelect(lat, lon, address, 0)}
                        changeDistance={(distance) => this.handleChangeDistance(distance, 0)}>
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
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default withRouter(Filters);
