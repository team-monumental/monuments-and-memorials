import * as React from 'react';
import './Filters.scss';
import { withRouter } from 'react-router-dom';
import { Collapse, Button } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import LocationSearch from './FilterTypes/LocationFilter/LocationFilter';
import search from '../../../utils/new-search';
import TagsFilters from './FilterTypes/TagsFilters/TagsFilters';
import DateFilter from './FilterTypes/DateFilter/DateFilter';
import TextFilter from './FilterTypes/TextFilter/TextFilter';
import * as QueryString from 'query-string';
import { Link } from 'react-router-dom';
import { Mode } from './FilterTypes/DateFilter/DateEnum';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';

class Filters extends React.Component {


    constructor(props) {
        super(props);
        const params = QueryString.parse(props.history.location.search);
        const qTags = (params.tags) ? params.tags.split(',') : [];
        const qMats = (params.materials) ? params.materials.split(',') : [];
        this.state = {
            filterList: {
                date: { filterMode: Mode.RANGE, params: {} },
                location: { params: {
                        address: params.address || '',
                        lat: params.lat || '',
                        lon: params.lon || '',
                        d: params.d || '25'
                    },
                    badLocationState: false,
                },
                hideTemporary: {params: {hideTemporary: params.hideTemporary || false}},
                tags: { params: {tags: qTags} },
                materials: {params: {materials: qMats} },
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

    async clearTags(type) {
        await this.setState(state => {
            const daFilters = state.filterList;
            daFilters[type].params[type] = [];
            return { filterList: daFilters };
        })
        this.handleSearch()
    }

    async clearLocation() {
        await this.setState(state => {
            const daFilters = state.filterList;
            daFilters.location.params = {d: '25', address: ''};
            return { filterList: daFilters };
        })
        this.handleSearch()
    }

    async clearFilters() {
        await this.setState(state => {
            const daFilters = {
                date: { filterMode: Mode.NONE, params: {} },
                location: { params: {d: '25', address: ''}, badLocationState: false },
                tags: { params: {tags: []}},
                materials: { params: {materials: []}},
                q: {params: {q: ''}},
                hideTemporary: {params: {hideTemporary: false}}
            }
            return { filterList: daFilters };
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

    async handleDateChangeMode(mode){
        await this.setState(state => {
            const daFilters = state.filterList;
            daFilters.date.filterMode = mode;
            return { filterList: daFilters };
        })
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

    async handleTagsSearchTagSelect(variant, addOrRemove, tag) {
        let selectedTags = this.state.filterList[variant].params[variant]
        // If the tag is being selected, add it to the selected tags and sort them alphabetically
        if (addOrRemove) {
            selectedTags.push(tag);
        } else {
            const index = selectedTags.findIndex(t => t === tag);
            if (index >= 0) {
                selectedTags.splice(index, 1);
            }
        }
        await this.setState({
            ...this.state,
            ...selectedTags
        })
        this.handleSearch()
    }

    async handleLocationSearchSelect(lat, lon, address, state) {
        var updatedState = this.state.filterList.location;
        (!state && updatedState.params.d < 0) ? updatedState.badLocationState = true :
            updatedState.badLocationState = false;
        updatedState.params = { ...updatedState.params, lat: lat, lon: lon, address: address, state: state }
        this.setState({
            ...this.state,
            ...updatedState
        })
        if (!updatedState.badLocationState) this.handleSearch()
    }

    async retrieveStateFromAddress(address) {
        if (address) {
            const results = await geocodeByAddress(address);
            const addressComponents = results[0].address_components;
            var state = '';
            for (const val of addressComponents) {
                if (val.types.includes("administrative_area_level_1")) {
                    state = val.short_name
                }
            }
            return state
        }
        return undefined
    }

    async handleChangeDistance(value) {
        var updatedState = this.state.filterList.location
        updatedState.params.d = value
        const geoState = await this.retrieveStateFromAddress(updatedState.params.address)
        if( value < 0 && !geoState){
            updatedState.badLocationState = true;
        } else {
            updatedState.badLocationState = false;
            updatedState.params.state = geoState
        }
        this.setState({
            ...this.state,
            ...updatedState
        })
        if(updatedState.params.lat && updatedState.params.lon && !updatedState.badLocationState){
            this.handleSearch();
        }
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

    handleTempChange(value){
        var updatedState = this.state.filterList.hideTemporary
        updatedState.params.hideTemporary = value
        this.setState({
            ...this.state,
            ...updatedState
        })
        this.handleSearch()
    }

    render() {
        const { showFilters, filterList } = this.state;
        const expandIcon = showFilters ? "remove" : "add";
        let dateMap = (
            <DateFilter 
                onRemove={() => this.clearTags('date')}
                data={filterList.date}
                filterMode={filterList.date.filterMode}
                hideTemporary={filterList.hideTemporary.params.hideTemporary}
                onTempChange={(value) => this.handleTempChange(value)}
                changeMode={(mode) => this.handleDateChangeMode(mode)}
                onChange={(dateParams) => this.handleDateSearchSelect(dateParams)}>
            </DateFilter>)
        let tagsMap = (
            <div className="filter-body" >
                
                <TagsFilters
                    variant="tags"
                    tags={filterList.tags.params.tags}
                    allowTagCreation={false}
                    onChange={(addOrRemove, params) => this.handleTagsSearchTagSelect("tags", addOrRemove, params)}>
                </TagsFilters>
                <button className="clear-button" onClick={() => this.clearTags('tags')}>
                    <i className="material-icons ">clear</i>
                </button>
            </div>);

        let materialsMap = (
            <div className="filter-body">
                
                <TagsFilters
                    variant="materials"
                    tags={filterList.materials.params.materials}
                    allowTagCreation={false}
                    onChange={(addOrRemove, params) => this.handleTagsSearchTagSelect("materials", addOrRemove, params)}>
                </TagsFilters>
                <button className="clear-button" onClick={() => this.clearTags('materials')}>
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
                        badLocationState={filterList.location.badLocationState}
                        onSuggestionSelect={(lat, lon, address, state) => this.handleLocationSearchSelect(lat, lon, address, state)}
                        onClear={()=> this.clearLocation()}
                        changeDistance={(distance) => this.handleChangeDistance(distance)}
                        retrieveStateFromAddress={()=> this.retrieveStateFromAddress()}>
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
