import * as React from 'react';
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import * as moment from 'moment';
import './DateFilter.scss';

export default class DateFilter extends React.Component {
    constructor(props) {
        super(props)
        const { data } = props;
        this.state = {

            decade: data.decade || 'null',
            start: data.start,
            end: data.end,
            filterMode: data.filterMode || 'range',
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
            ...this.state,
            ...updatedState
        });
        onChange(updatedState)
    }

    async handleDateFilter(type, value) {
        switch (type) {
            case 'decade':
                if (value === 'null') value = null;
                this.handleFilterChange('decade', value);
                break;
            case 'range':
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
        if (mode !== 'decade') {
            this.handleFilterChange('decade', null);
        }
        if (mode !== 'range') {
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
        this.handleDateFilter('range', [this.state.dateFilterStart, this.state.dateFilterEnd]);
    }

    async removeFilter(){
        const {onRemove} = this.props
        await this.handleTypeChange(null);
        onRemove()
    }
    render() {
        const { filterMode, dateFilterStart, dateFilterEnd, decade } = this.state;
        const { decades } = this.props;
        const minimumDate = new Date(1, 0);
        minimumDate.setFullYear(1);
        const currentDate = new Date();
        const Slider = require('rc-slider');
        const createSliderWithTooltip = Slider.createSliderWithTooltip;
        const Range = createSliderWithTooltip(Slider.Range);
        const sliderStyle = { width: 400, margin: 25 };
        let dateFilter = (<div/>);
        const marks = {
            
            1870: '1870\'s or Earlier',
            1900: '1900\'s',
            1930: '1930\'s',
            1960: '1960\'s',
            1990: '1990\'s',
            2020: 'Present'
        }
        if (filterMode === 'range') {
            dateFilter = (
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
            );
        } else if (filterMode === 'decade') {
            dateFilter = (
                <div className="d-flex align-items-center">
                    <span className="mr-2">Monuments or memorials created in the</span>
                    <Form.Control as="select" className="min-width-select" onChange={event => this.handleDateFilter('decade', event.target.value)} value={decade}>
                        <option value="null">None</option>
                        {decades.map(decade => (
                            <option value={decade} key={decade}>{decade}s</option>
                        ))}
                    </Form.Control>
                </div>
            );
        }else if (filterMode === 'slider') {
            dateFilter = (
                <div className="d-flex align-items-center">
                    <span className="mr-2">Active in</span>
                    <div style = {sliderStyle}>
                        <Range allowCross={false} min={1870} max={2020} step={10} defaultValue={[1870, 1960]} marks = {marks} 
                        handleStyle= {{borderColor: '#42b883', backgroundColor: '#42b883', borderRadius: '0%', width: '6px', height: '18px'}}/>
                     </div>
                </div>
            );
        }

        return ( 
            <div className="filter-body" >
                <button style={{backgroundColor: "white", border: "none"}} onClick={() => this.removeFilter()}>
                    <i className="material-icons ">clear</i>
                </button>
                <div className="d-flex pt-3 pb-3 align-items-center">
                    <span className="date-label">Date</span>
                    <Form.Control as="select" className="min-width-select mr-2"
                                value={filterMode}
                                onChange={event => this.handleTypeChange(event.target.value)}>
                        <option value="range">Created(range)</option>
                        <option value="decade">Created(decade)</option>
                        <option value="slider">Active(range)</option>
                    </Form.Control>
                    {dateFilter}
                </div>
            </div>
            )
        

    }






}