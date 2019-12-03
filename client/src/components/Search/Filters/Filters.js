import * as React from 'react';
import './Filters.scss';
import { withRouter } from 'react-router-dom';
import { Collapse, Form } from 'react-bootstrap';
import TagsSearch from '../TagsSearch/TagsSearch';
import search from "../../../utils/search";
import DatePicker from 'react-datepicker/es';
import * as moment from 'moment';

class Filters extends React.Component {

    constructor(props) {
        super(props);
        const { distance, decade, start, end } = props;
        let dateFiltersMode = 'hidden';
        if (decade) dateFiltersMode = 'decade';
        if (start && end) dateFiltersMode = 'range';
        this.state = {
            filters: {
                distance: distance || '25',
                decade: decade || 'null',
                start,
                end
            },
            dateFiltersMode,
            dateFilterStart: new Date(),
            dateFilterEnd: new Date()
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
        const params = {};

        params[variant] = selectedTags.map(tag => tag.name);
        search(params, this.props.history);
    }

    async handleDateFilter(type, value) {
        switch (type) {
            case 'decade':
                if (value === 'null') return;
                this.handleFilterChange('decade', value);
                break;
            case 'range':
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

    async handleRangeChange(type, value) {
        if (type === 'start') {
            await this.setState({dateFilterStart: value});
        } else {
            await this.setState({dateFilterEnd: value});
        }
        this.handleDateFilter('range', [this.state.dateFilterStart, this.state.dateFilterEnd]);
    }

    render() {

        const { showDistance, tags, materials, decades } = this.props;
        const { dateFiltersMode, dateFilterStart, dateFilterEnd, filters: { decade, distance } } = this.state;

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
                    <Form.Control as="select" className="min-width-select" onChange={event => this.handleDateFilter('decade', event.target.value)} value={decade}>
                        <option value="null">-----</option>
                        {decades.map(decade => (
                            <option value={decade} key={decade}>{decade}s</option>
                        ))}
                    </Form.Control>
                </div>
            );
        }

        return (
            <div className="filters">
                <div className="d-flex">
                    {distanceFilter}
                    <div className="d-flex align-items-center">
                        <span className="mr-2">Filter by Date</span>
                        <Form.Control as="select" className="min-width-select"
                                      value={dateFiltersMode}
                                      onChange={event => this.handleDistanceFilterModeChange(event.target.value)}>
                            <option value="hidden">None</option>
                            <option value="range">Range</option>
                            <option value="decade">Decade</option>
                        </Form.Control>
                    </div>
                </div>
                <Collapse in={showDateFilter}>
                    {dateFilter}
                </Collapse>
                <div className="tags-container">
                    <TagsSearch
                        variant="tags"
                        tags={tags}
                        onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                        allowTagCreation={false}
                    />
                    <TagsSearch
                        variant="materials"
                        tags={materials}
                        onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                        allowTagCreation={false}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(Filters);