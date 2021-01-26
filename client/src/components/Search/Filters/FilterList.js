import * as React from 'react';
import './Filters.scss';
import { withRouter } from 'react-router-dom';
import { Form, Collapse } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import Filter from './Filter'; 

class Filters extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            newFilterType: 'location',
            filterList: ['date', 'location', 'tags', 'materials'],
            showFilters: true
        };
    }

    async handleNewFilterChange(mode) {
         this.setState({newFilterType: mode});
    }

    async addFilter(type){
        console.log(type)
        this.setState(state => {
            const daFilters = state.filterList.concat(type);
            return {filterList: daFilters};
        })
    }

    async removeFilter(id){
        this.setState(state => {
            const daFilters = state.filterList;
            daFilters.splice(id, 1);
            return {filterList: daFilters};
        })
    }

    async expand(){
        this.setState(state => {
            return {showFilters: !state.showFilters}
        })
    }
    
    render() {

        const { decades } = this.props;
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
                        <Form.Control as="select" className="min-width-select" value={newFilterType} onChange={event => this.handleNewFilterChange(event.target.value)}>
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
                            this.state.filterList.map((type, index) => (<Filter 
                                type={type} 
                                decades={decades} 
                                history={this.props.history} 
                                removeFilter={() => this.removeFilter(index)} 
                                key={index.toString()}></Filter>))
                        }
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default withRouter(Filters);
