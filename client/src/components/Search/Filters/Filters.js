import * as React from 'react';
import './Filters.scss';
import { withRouter } from 'react-router-dom';
import { Collapse, Form, Button } from 'react-bootstrap';
import TagsSearch from '../TagsSearch/TagsSearch';
import search from '../../../utils/search';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import 'rc-slider/assets/index.css';
import Filter from './Filter'; 

import * as QueryString from 'query-string';

class Filters extends React.Component {


    constructor(props) {
        super(props);
        const params = QueryString.parse(props.history.location.search);
        const { distance, decade, start, end } = props;
        let dateFiltersMode = 'hidden';
        if (decade) dateFiltersMode = 'decade';
        else if (start && end) dateFiltersMode = 'range';
        this.state = {
            
            filters: {
                distance: distance || '25',
                decade: decade || 'null',
                start,
                end
            },
            dateFiltersMode,
            dateFilterStart: new Date(),
            dateFilterEnd: new Date(),
            newFilterType: 'location',
            filterList: []
        };
    }

    async handleFilterChange(name, value) {
        const { onChange } = this.props;

        const updatedState = {};
        updatedState[name] = value;
        await this.setState({
            filters: {
                ...this.state.filters,
                ...updatedState
            }
        });

        onChange(this.state.filters);
    }

    handleTagsSearchTagSelect(variant, selectedTags) {
        const { uri } = this.props;
        const params = {};

        params[variant] = selectedTags.map(tag => tag.name);
        search(params, this.props.history, uri);
    }

    async handleNewFilterChange(mode) {
         this.setState({newFilterType: mode});
    }

    addFilter(type){
        console.log(type)
        this.setState(state => {
            const daFilters = state.filterList.concat(type);
            return {filterList: daFilters}
        }
        )
        console.log(this.state.filterList)
    }

    render() {

        const { showDistance, tags, materials, decades } = this.props;
        const { dateFiltersMode, dateFilterStart, newFilterType, dateFilterEnd, filters: { decade, distance } } = this.state;

        const distanceFilter = showDistance ? (
            <Form.Control onChange={event => this.handleFilterChange('distance', event.target.value)} as="select" className="min-width-select mr-3" value={distance}>
                <option value="10">Within 10 miles</option>
                <option value="15">Within 15 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
                <option value="100">Within 100 miles</option>
            </Form.Control>
        ) : null;

        return (
            <div className="filters">
                <div className="add-filter">
                    <Form.Control as="select" className="min-width-select" value={newFilterType} onChange={event => this.handleNewFilterChange(event.target.value)}>
                        <option value="location">Location</option>
                        <option value="date">Date</option>
                        <option value="tags">Tags</option>
                        <option value="materials">Materials</option>
                    </Form.Control>
                    <button className="filter-type" onClick={() => this.addFilter(newFilterType)}><i className="material-icons ">add</i></button>
                </div>
                <div>
                    {
                        this.state.filterList.map((type, index) => (<Filter type={type} decades={decades} history={this.props.history} key={index.toString()}></Filter>))
                    }
                    
                    
                </div>
                <div className="tags-container">
                    
                </div>
            </div>
        );
    }
}

export default withRouter(Filters);

/**  
                    {
                        this.state.dateFilters.map((item) => (
                            <div className="d-flex align-items-center">
                            <span className="mr-2">Filter by Date</span>
                            <Form.Control as="select" className="min-width-select"
                                        value={dateFiltersMode}
                                        onChange={event => this.handleDistanceFilterModeChange(event.target.value)}>
                                <option value="hidden">None</option>
                                <option value="range">Range</option>
                                <option value="decade">Decade</option>
                                <option value="slider">Slider</option>
                            </Form.Control>
                        </div>))
                    }
                    {
                        this.state.materialFilters.map((item) => (
                            <TagsSearch
                        variant="materials"
                        tags={materials}
                        onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                        allowTagCreation={false}
                        />))
                    }
                    {
                        this.state.tagFilters.map((item) => (
                            <TagsSearch
                        variant="tags"
                        tags={tags}
                        onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                        allowTagCreation={false}
                    />))
                    }
                    */