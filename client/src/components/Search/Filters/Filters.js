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

    
    async handleDateFilter(type, value) {
        switch (type) {
            case 'decade':
                if (value === 'null') value = null;
                this.handleFilterChange('decade', value);
                break;
            case 'range':
            default:
                const [ startDate, endDate ] = value;
                await this.handleFilterChange('start', moment(startDate).format('YYYY-MM-DD'));
                this.handleFilterChange('end', moment(endDate).format('YYYY-MM-DD'));
                break;
        }
    }

    async handleDistanceFilterModeChange(mode) {
        await this.setState({dateFiltersMode: mode});
        if (mode !== 'decade') {
            this.handleFilterChange('decade', 'null');
        }
        if (mode !== 'range') {
            await this.handleFilterChange('start', null);
            this.handleFilterChange('end', null);
        }
    }

    async handleNewFilterChange(mode) {
         this.setState({newFilterType: mode});
    }

    async handleRangeChange(type, value) {
        if (type === 'start') {
            await this.setState({dateFilterStart: value});
        } else {
            await this.setState({dateFilterEnd: value});
        }
        this.handleDateFilter('range', [this.state.dateFilterStart, this.state.dateFilterEnd]);
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

        const showDateFilter = dateFiltersMode !== 'hidden';
        let dateFilter = (<div/>);

        const minimumDate = new Date(1, 0);
        minimumDate.setFullYear(1);
        const currentDate = new Date();
        const Slider = require('rc-slider');
        const createSliderWithTooltip = Slider.createSliderWithTooltip;
        const Range = createSliderWithTooltip(Slider.Range);
        const sliderStyle = { width: 400, margin: 25 };
        const marks = {
            
            1870: '1870\'s or Earlier',
            1900: '1900\'s',
            1930: '1930\'s',
            1960: '1960\'s',
            1990: '1990\'s',
            2020: 'Present'
        }
        if (dateFiltersMode === 'range') {
            dateFilter = (
                <div className="d-flex pt-3 align-items-center">
                    <span className="mr-2">Start Date</span>
                    <DatePicker
                        selected={dateFilterStart}
                        onChange={(date) => this.handleRangeChange('start', date)}
                        minDate={minimumDate}
                        maxDate={currentDate}
                    />
                    <span className="ml-3 mr-2">End Date</span>
                    <DatePicker
                        selected={dateFilterEnd}
                        onChange={(date) => this.handleRangeChange('end', date)}
                        minDate={minimumDate}
                        maxDate={currentDate}
                    />
                </div>
            );
        } else if (dateFiltersMode === 'decade') {
            dateFilter = (
                <div className="pt-3 d-flex align-items-center">
                    <span className="mr-2">Monuments or memorials created in the</span>
                    <Form.Control as="select" className="min-width-select" onChange={event => this.handleDateFilter(event.target.value)} value={decade}>
                        <option value="null">None</option>
                        {decades.map(decade => (
                            <option value={decade} key={decade}>{decade}s</option>
                        ))}
                    </Form.Control>
                </div>
            );
        }else if (dateFiltersMode === 'slider') {
            dateFilter = (
                <div className="pt-3 d-flex align-items-center">
                    <span className="mr-2">Monuments existing within the</span>
                    <div style = {sliderStyle}>
                        <Range allowCross={false} min={1870} max={2020} step={10} defaultValue={[1870, 1960]} marks = {marks} 
                        handleStyle= {{borderColor: '#42b883', backgroundColor: '#42b883', borderRadius: '0%', width: '6px', height: '18px'}}/>
                     </div>
                </div>
            );
        }

        return (
            <div className="filters">
                <Form.Control as="select" className="min-width-select" value={newFilterType} onChange={event => this.handleNewFilterChange(event.target.value)}>
                    <option value="location">Location</option>
                    <option value="date">Date</option>
                    <option value="tags">Tags</option>
                    <option value="materials">Materials</option>
                </Form.Control>
                <button className="filter-type" onClick={() => this.addFilter(newFilterType)} style={{backgroundColor: "white", border: "none"}}><i className="material-icons ">add</i></button>
                <div className="d-flex">
                    {
                        this.state.filterList.map((type, index) => (<Filter type={type} key={index.toString()}></Filter>))
                    }
                    
                    
                </div>
                <Collapse in={showDateFilter}>
                    {dateFilter}
                </Collapse>
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