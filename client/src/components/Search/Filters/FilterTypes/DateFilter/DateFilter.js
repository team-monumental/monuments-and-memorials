import * as React from 'react';
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import * as moment from 'moment';

export default class DateSearch extends React.Component {
    constructor(props) {
        super(props)
        const { decade, start, end } = props;
        let dateFiltersMode = 'hidden';
        this.state = {
                
            filters: {
                decade: decade || 'null',
                start,
                end
            },
            dateFiltersMode,
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
            filters: {
                ...this.state.filters,
                ...updatedState
            }
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
        await this.setState({dateFiltersMode: mode});
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

    render() {
        const { dateFiltersMode, dateFilterStart, dateFilterEnd, filters: { decade, distance } } = this.state;
        const { value, decades } = this.props;
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
        if (dateFiltersMode === 'range') {
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
        } else if (dateFiltersMode === 'decade') {
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
        }else if (dateFiltersMode === 'slider') {
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
            <div className="d-flex pt-3 pb-3 align-items-center">
                <Form.Control as="select" className="min-width-select mr-2"
                            value={dateFiltersMode}
                            onChange={event => this.handleTypeChange(event.target.value)}>
                    <option value="hidden">None</option>
                    <option value="range">Range</option>
                    <option value="decade">Decade</option>
                    <option value="slider">Slider</option>
                </Form.Control>
                {dateFilter}
            </div>
            )
        

    }






}