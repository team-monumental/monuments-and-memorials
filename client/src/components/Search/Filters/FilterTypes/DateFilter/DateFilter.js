import * as React from 'react';
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import * as moment from 'moment';
import './DateFilter.scss';
import Slider from 'rc-slider';
import {Mode} from './DateEnum';

export default class DateFilter extends React.Component {
    
    constructor(props) {
        super(props)
        const { data } = props;
        
        this.state = {
            params:{
                decade: data.params.decade || null,
                start: data.params.start || null, //TODO - make date dynamic
                end: data.params.end || null
            },

            filterMode: data.config.filterMode || Mode.NONE,
            dateFilterStart: new Date(),
            dateFilterEnd: new Date(),
            filterList: []
        };
    }

    async handleFilterChange(name, value) {

        const updatedState = {};
        const {onChange} = this.props;
        updatedState[name] = value;
        await this.setState({
            params:{
                ...this.state.params,
                ...updatedState
            }
        });
        onChange(this.state.params)
    }

    async handleDateFilter(type, value) {
        switch (type) {
            case Mode.DECADE:
                if (value === 'null') value = null;
                this.handleFilterChange(Mode.DECADE, value);
                break;
            case Mode.RANGE:
                if (value === 'null') value = null;
                const [ startDate, endDate ] = value;
                await this.handleFilterChange('start', moment(startDate).format('YYYY-MM-DD'));
                this.handleFilterChange('end', moment(endDate).format('YYYY-MM-DD'));
                break;
            default:
                break;
        }
    }

    async handleTypeChange(mode) {
        await this.setState({filterMode: mode});
        if (mode !== Mode.DECADE) {
            this.handleFilterChange(Mode.DECADE, null);
        }
        if (mode !== Mode.RANGE) {
            await this.handleFilterChange('start', null);
            this.handleFilterChange('end', null);
        }
    }

    async handleRangeChange(type, value) {
        if (type === 'start') {
            await this.setState({dateFilterStart: value});
        } else {
            await this.setState({dateFilterEnd: value});
        }
        this.handleDateFilter(Mode.RANGE, [this.state.dateFilterStart, this.state.dateFilterEnd]);
    }

    async removeFilter(){
        const {onRemove} = this.props
        onRemove()
    }

    makeRangeFilter() {
        const{ dateFilterStart, dateFilterEnd } = this.state;
        const minimumDate = new Date(1, 0);
        minimumDate.setFullYear(1);
        const currentDate = new Date();
        return (
            <div className="d-flex align-items-center">
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
        )
    }

    makeDecadeFilter() {
        const { decades } = this.props;
        const { params } = this.state;
        const decade = params.decade
        return (
            <div className="d-flex align-items-center">
                <span className="mr-2">Monuments or memorials created in the</span>
                <Form.Control as="select" className="min-width-select" onChange={event => this.handleDateFilter(Mode.DECADE, event.target.value)} value={decade}>
                    <option value="null">None</option>
                    {decades.map(decade => (
                        <option value={decade} key={decade}>{decade}s</option>
                    ))}
                </Form.Control>
            </div>
        )
    }

    makeSliderFilter() {
        const createSliderWithTooltip = Slider.createSliderWithTooltip;
        const Range = createSliderWithTooltip(Slider.Range);
        
        const marks = {

            1870: '1870\'s or Earlier',
            1900: '1900\'s',
            1930: '1930\'s',
            1960: '1960\'s',
            1990: '1990\'s',
            2020: 'Present'
        }
        return (
            <div className="d-flex align-items-center">
                <span className="mr-2">Active in</span>
                <div className="slider">
                    <Range allowCross={false} min={1870} max={2020} step={10} defaultValue={[1870, 1960]} marks={marks}
                        handleStyle={{ borderColor: '#42b883', backgroundColor: '#42b883', borderRadius: '0%', width: '6px', height: '18px' }} />
                </div>
            </div>
        )
    }

    render() {
        const { filterMode } = this.state;
        let dateFilter = null;
        switch (filterMode){
            case Mode.RANGE: 
                dateFilter = this.makeRangeFilter();
                break;
            case Mode.DECADE:
                dateFilter = this.makeDecadeFilter();
                break;
            case Mode.SLIDER: 
                dateFilter = this.makeSliderFilter();
                break;
            default:
                dateFilter = (<div></div>)
                break;
        }

        return ( 
            <div className="filter-body" >
                <button style={{backgroundColor: "white", border: "none"}} onClick={() => this.removeFilter()}>
                    <i className="material-icons ">clear</i>
                </button>
                <div className="d-flex pt-3 pb-3 align-items-center">
                    <Form.Control as="select" className="min-width-select mr-2"
                                value={filterMode}
                                onChange={event => this.handleTypeChange(event.target.value)}>
                        <option value={Mode.NONE}>None</option>
                        <option value={Mode.RANGE}>Created(range)</option>
                        <option value={Mode.DECADE}>Created(decade)</option>
                        <option value={Mode.SLIDER}>Active(slider)</option>
                    </Form.Control>
                    {dateFilter}
                </div>
            </div>
            )
        

    }






}