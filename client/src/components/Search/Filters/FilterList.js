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
                date: [ 
                    { config:{}, params:{ 
                        decade: 2000
                    }}, { config:{filterMode: 'range'}, params:{
                    start: '2000-01-25', end: '2021-01-27'}}
                ],
                location: [],
                tags: [''],
                materials: ['']
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
        this.setState(state => {
            const daFilters = state.filterList;
            daFilters[type].splice(id, 1);
            return {filterList: daFilters};
        })
    }

    async expand(){
        this.setState(state => {
            return {showFilters: !state.showFilters}
        })
    }
    
    handleDateSearchSelect(params, id) {
        const { uri } = this.props;
        const updatedState = this.state.filterList.date
        updatedState[id].params = params
        this.setState({
            ...this.state,
            ...updatedState
        })
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

    handleTagsSearchTagSelect(variant, selectedTags, tag) {
        const { uri } = this.props;
        const params = {};
        params[variant] = selectedTags.map(tag => tag.name);
        search(params, this.props.history, uri);
    }

    async handleLocationSearchSelect(lat, lon, address) {
        await this.setState({locationLat: lat, locationLon: lon, locationAddress: address});
        this.search({lat: lat, lon: lon, address: address}, this.props.history, this.props.uri);
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
                    <div className="add-filter">
                        <button className="filter-type" onClick={() => this.addFilter(newFilterType)}>
                            <span>New Filter</span>
                        </button>
                        <Form.Control as="select" className="min-width-select" value={newFilterType} 
                                onChange={event => this.handleNewFilterChange(event.target.value)}>
                            <option value="location">Location</option>
                            <option value="date">Date</option>
                            <option value="tags">Tags</option>
                            <option value="materials">Materials</option>
                        </Form.Control>
                        
                    </div>
                </div>
                <Collapse in={showFilters}>
                    <div>
                        {
                            this.state.filterList.date.map((params, index) => (
                                    <DateFilter key={index.toString()}
                                        onRemove={() => this.removeFilter('date', index)}
                                        data={params}
                                        decades={decades}
                                        onChange={(params) => this.handleDateSearchSelect(params, index)}>
                                    </DateFilter>))
                        }
                        {
                            this.state.filterList.location.map((params, index) => (
                                <div className="filter-body" key={index.toString()}>
                                    <button style={{backgroundColor: "white", border: "none"}} onClick={() => this.removeFilter()}>
                                        <i className="material-icons ">clear</i>
                                    </button>
                                    <LocationSearch
                                        value={params}
                                        onChange={(params) => this.handleLocationSearchSelect(params)}>
                                    </LocationSearch>
                                </div>))
                        }
                        {
                            this.state.filterList.materials.map((params, index) => (
                                <div className="filter-body" key={index.toString()}>
                                    <button style={{backgroundColor: "white", border: "none"}} onClick={() => this.removeFilter()}>
                                        <i className="material-icons ">clear</i>
                                    </button>
                                    <TagsSearch
                                        variant="materials"
                                        tags={params}
                                        allowTagCreation={false}
                                        onChange={(variant, params) => this.handleTagsSearchTagSelect(variant, params)}>
                                    </TagsSearch>
                                </div>))
                        }
                        {
                            this.state.filterList.tags.map((params, index) => (
                                <div className="filter-body" key={index.toString()}>
                                    <button style={{backgroundColor: "white", border: "none"}} onClick={() => this.removeFilter()}>
                                        <i className="material-icons ">clear</i>
                                    </button>
                                    <TagsSearch
                                        variant="tags"
                                        onRemove= {() => this.removeFilter('tags', index)}
                                        tags={params}
                                        allowTagCreation={false}
                                        onChange={(variant, params) => this.handleTagsSearchTagSelect(variant, params)}>
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
