import * as React from 'react';
import DatePicker from 'react-datepicker';
import { Form, Button, ButtonGroup } from 'react-bootstrap';
import * as moment from 'moment';
import './DateFilter.scss';
import { Range } from 'rc-slider';
import { Mode } from './DateEnum';
import SliderHandle  from './SliderHandle/SliderHandle';


export default class DateFilter extends React.Component {
    
    constructor(props) {
        super(props)
        const { data } = props;
        
        this.state = {
            params:{
                decade: data.params.decade || null,
                start: data.params.start || null, //TODO - make date dynamic
                end: data.params.end || null,
                activeStart: data.params.activeStart || null,
                activeEnd: data.params.activeEnd || null,
            },
            sliderValues: [1870, 1960],
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

    async handleModeChange(mode) {
        const { changeMode } = this.props
        changeMode({filterMode:mode});
        if (mode !== Mode.DECADE) {
            await this.handleFilterChange('decade', null);
        }
        if (mode !== Mode.RANGE) {
            await this.handleFilterChange('start', null);
            this.handleFilterChange('end', null);
        }
        if (mode !== Mode.SLIDER) {
            await this.handleFilterChange('activeStart', null);
            this.handleFilterChange('activeEnd', null);
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

    async handleSliderSearch(value){
        await this.handleFilterChange('activeStart', value[0] )
        this.handleFilterChange('activeEnd', value[1])
    }

    handleTempChange(value){
        const { hideTemporary, onTempChange } = this.props
        if (value !== hideTemporary) onTempChange(value);
    }
    onSliderChange = (value) =>{
        this.setState({sliderValues: value})
      };
    onSliderSerach = value => {
        this.handleSliderSearch(value);
    };

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
        const { params } = this.state;
        const decade = params.decade
        return (
            <div className="d-flex align-items-center">
                <span className="mr-2">Monuments or memorials created in the</span>
                <Form.Control as="select" className="min-width-select" onChange={event => this.handleDateFilter(Mode.DECADE, event.target.value)} value={decade}>
                    <option value="null">None</option>
                    <option value="1850">1850s</option>
                    <option value="1860">1860s</option>
                    <option value="1870">1870s</option>
                    <option value="1880">1880s</option>
                    <option value="1890">1890s</option>
                    <option value="1900">1900s</option>
                    <option value="1910">1910s</option>
                    <option value="1920">1920s</option>
                    <option value="1930">1930s</option>
                    <option value="1940">1940s</option>
                    <option value="1950">1950s</option>
                    <option value="1960">1960s</option>
                    <option value="1970">1970s</option>
                    <option value="1980">1980s</option>
                    <option value="1990">1990s</option>
                    <option value="2000">2000s</option>
                    <option value="2010">2010s</option>
                    <option value="2020">2020s</option>
                </Form.Control>
            </div>
        )
    }

    makeSliderFilter() {
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
                    <Range allowCross={false} min={1870} max={2020} step={10} value={this.state.sliderValues} marks={marks}
                        handle={SliderHandle}
                        dotStyle={{ height: '12px', width: '12px', top: '-4px'}}
                        onChange={this.onSliderChange} onAfterChange={this.onSliderSerach} />
                </div>
            </div>
        )
    }

    render() {
        const { filterMode, hideTemporary } = this.props;
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
            <div>
                <div className="filter-body" >
                    <button className="clear-button" onClick={() => this.handleModeChange(Mode.NONE)}>
                        <i className="material-icons ">clear</i>
                    </button>
                    <div className="d-flex pt-3 pb-3 align-items-center">
                        <Form.Control as="select" className="min-width-select mr-2"
                                    value={filterMode}
                                    onChange={event => this.handleModeChange(event.target.value)}>
                            <option value={Mode.NONE}>None</option>
                            <option value={Mode.RANGE}>Created(range)</option>
                            <option value={Mode.DECADE}>Created(decade)</option>
                            <option value={Mode.SLIDER}>Active(slider)</option>
                            
                        </Form.Control>
                        {dateFilter}
                    </div>
                </div>
                <div className="temp-monuments-toggle">
                    <div className="temp-monuments-label">
                        Show Temporary Monuments?
                        <img className={!hideTemporary? 'monument-pin' : 'temp-img-no'} src='/marker-icon-2x-green.png' alt="Temporary monument pin"/>
                    </div>
                    <ButtonGroup>
                        <Button variant={!hideTemporary ? 'primary' : 'outline-primary'} size="sm" active={!hideTemporary}
                                    onClick={() => this.handleTempChange(false)}>
                            Yes
                        </Button>
                        <Button variant={hideTemporary ? 'perm-color' : 'outline-info'} size="sm" active={hideTemporary}
                                    onClick={() => this.handleTempChange(true)}>
                            No
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
            )
    }
}
