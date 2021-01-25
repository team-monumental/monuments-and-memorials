import * as React from 'react';
import './Filters.scss';
import { withRouter } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import Filter from './Filter'; 

class Filters extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            newFilterType: 'location',
            filterList: []
        };
    }

    async handleNewFilterChange(mode) {
         this.setState({newFilterType: mode});
    }

    async addFilter(type){
        console.log(type)
        await this.setState(state => {
            const daFilters = state.filterList.concat(type);
            return {filterList: daFilters};
        })
    }

    async removeFilter(id){
        await this.setState(state => {
            const daFilters = state.filterList;
            daFilters.splice(id, 1);
            return {filterList: daFilters};
        })
    }

    render() {

        const { decades } = this.props;
        const { newFilterType } = this.state;

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
                        this.state.filterList.map((type, index) => (<Filter 
                            type={type} 
                            decades={decades} 
                            history={this.props.history} 
                            removeFilter={() => this.removeFilter(index)} 
                            key={index.toString()}></Filter>))
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Filters);
