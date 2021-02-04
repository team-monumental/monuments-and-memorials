import * as React from 'react';
import './Filters.scss';
import { withRouter } from 'react-router-dom';
import { Form, Collapse } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import LocationSearch from './FilterTypes/LocationFilter/LocationFilter';
import './Filters.scss';
import search from '../../../utils/search';
import TagsSearch from './FilterTypes/TagsFilters/TagsFilters';
import DateFilter from './FilterTypes/DateFilter/DateFilter'

class Filters extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            newFilterType: 'location',
            filterList: {
                date: [],
                location: [],
                tags: [],
                materials: []
            },
            showFilters: true,
        };
    }

    async handleNewFilterChange(mode) {
         this.setState({newFilterType: mode});
    }

    async addFilter(type){
        console.log(type)
        this.setState(state => {
            const daFilters = state.filterList;
            daFilters[type].push({config:{}, params:{}});
            return {filterList: daFilters};
        })
    }

    async removeFilter(type, id){
        console.log(type)
        await this.setState(state => {
            const daFilters = state.filterList;
            daFilters[type].splice(id, 1);
            console.log(daFilters)
            return {filterList: daFilters};
        })
        this.handleSearch()
    }

    async clearFilters(){
        await this.setState(state => {
            const daFilters =  {
                date: [],
                location: [],
                tags: [],
                materials: []
            }
            return {filterList: daFilters};
        })
        this.handleSearch()
    }

    async expand(){
        this.setState(state => {
            return {showFilters: !state.showFilters}
        })
    }
    
    async handleSearch(){
        const {uri} = this.props;
        const try1 = {}
        console.log(this.state.filterList)
        for(var filterType in this.state.filterList){
            var curPar = this.state.filterList[filterType]
            for( var i in curPar){
                for(let parName in curPar[i].params){
                    if(!try1[parName]){
                        try1[parName] = []
                    }
                    if(curPar[i].params[parName]) try1[parName].push(curPar[i].params[parName])
                }
            }
        }
        console.log(try1)
        search(try1, this.props.history, uri);

    }
    handleDateSearchSelect(params, id) {
        const { uri } = this.props;
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
            return {filterList: daFilters}
        })
        this.handleSearch()
    }

    async handleLocationSearchSelect(lat, lon, address, id) {
        const updatedState = this.state.filterList.location
        updatedState[id].params = {lat: lat, lon: lon, address: address}
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

    

    render() {

        const { decades } = this.props
        const { newFilterType, showFilters } = this.state;
        const expandIcon = showFilters ? "add" : "remove";

        return (
            <div className="filters">
                <div className="filter-header">
                    <div className="expander" onClick={() => this.expand()}>
                        <i className="material-icons">{expandIcon}</i>
                        <span>{showFilters ? "Show" : "Hide"}</span>
                    </div>
                    <div className="clear-filters">
                        <button onClick={() => this.clearFilters()}>
                            <span>Clear Filters</span>
                        </button>
                        
                    </div>
                </div>
                <Collapse in={showFilters}>
                    <div>
                        <div className="type-header">
                            <p>Date</p> 
                            <div className="filter-type" onClick={() => this.addFilter('date')}>
                                <i className="material-icons">{expandIcon}</i>
                                <span>{this.state.filterList.date.length > 0 ? "OR" : "New" }</span>
                            </div>
                        </div>
                        {
                            this.state.filterList.date.map((params, index) => (
                                    <DateFilter key={index.toString()}
                                        onRemove={() => this.removeFilter('date', index)}
                                        data={params}
                                        decades={decades}
                                        onChange={(params) => this.handleDateSearchSelect(params, index)}>
                                    </DateFilter>))
                        }
                        <div className="type-header">
                            <p>Location</p> 
                            <div className="filter-type" onClick={() => this.addFilter('location')}>
                                <i className="material-icons">{expandIcon}</i>
                                <span>{this.state.filterList.location.length > 0 ? "OR" : "New" }</span>
                            </div>
                        </div>
                        {
                            this.state.filterList.location.map((params, index) => (
                                <div className="filter-body" key={index.toString()}>
                                    <button style={{backgroundColor: "white", border: "none"}} onClick={() => this.removeFilter('location', index)}>
                                        <i className="material-icons ">clear</i>
                                    </button>
                                    <LocationSearch
                                        onSuggestionSelect={(lat, lon, address) => this.handleLocationSearchSelect(lat, lon, address, index)}
                                        changeDistance={(distance)=> this.handleChangeDistance(distance, index)}>
                                    </LocationSearch>
                                </div>))
                        }
                        <div className="type-header">
                            <p>Materials</p> 
                            <div className="filter-type" onClick={() => this.addFilter('materials')}>
                                <i className="material-icons">{expandIcon}</i>
                                <span>{this.state.filterList.materials.length > 0 ? "OR" : "New" }</span>
                            </div>
                        </div>
                        {
                            this.state.filterList.materials.map((params, index) => (
                                <div className="filter-body" key={index.toString()}>
                                    <button style={{backgroundColor: "white", border: "none"}} onClick={() => this.removeFilter('materials', index)}>
                                        <i className="material-icons ">clear</i>
                                    </button>
                                    <TagsSearch
                                        variant="materials"
                                        tags={params}
                                        allowTagCreation={false}
                                        onChange={(variant, params) => this.handleTagsSearchTagSelect(variant, params, index)}>
                                    </TagsSearch>
                                </div>))
                        }
                        <div className="type-header">
                            <p>Tags</p> 
                            <div className="filter-type" onClick={() => this.addFilter('tags')}>
                                <i className="material-icons">{expandIcon}</i>
                                <span>{this.state.filterList.tags.length > 0 ? "OR" : "New" }</span>
                            </div>
                        </div>
                        {
                            this.state.filterList.tags.map((params, index) => (
                                <div className="filter-body" key={index.toString()}>
                                    <button style={{backgroundColor: "white", border: "none"}} onClick={() => this.removeFilter('tags', index)}>
                                        <i className="material-icons ">clear</i>
                                    </button>
                                    <TagsSearch
                                        variant="tags"
                                        onRemove= {() => this.removeFilter('tags', index)}
                                        tags={params}
                                        allowTagCreation={false}
                                        onChange={(variant, params) => this.handleTagsSearchTagSelect(variant, params, index)}>
                                    </TagsSearch>
                                </div>))
                        }
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default withRouter(Filters);
