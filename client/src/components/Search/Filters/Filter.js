import React from 'react';
import LocationSearch from './FilterTypes/LocationFilter/LocationFilter';
import './Filters.scss';
import search from '../../../utils/search';
import TagsSearch from './FilterTypes/TagsFilters/TagsFilters';
import DateFilter from './FilterTypes/DateFilter/DateFilter'
import 'rc-slider/assets/index.css';

/**
 * A generic filter
 */
export default class Filter extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            locationAddress: ''
        }
    }
    handleTagsSearchTagSelect(variant, selectedTags, tag) {
        const { uri } = this.props;
        const params = {};
        params[variant] = selectedTags.map(tag => tag.name);
        search(params, this.props.history, uri);
    }

    handleRemoveFilter(){
        const {removeFilter} = this.props;

        removeFilter();
    }
    
    render() {
        const { type, query, decades, removeFilter } = this.props;
        
        let toRender = (<div>ERROR</div>)
        switch(type){
            case 'tags':{
                toRender = (<TagsSearch
                    variant="tags"
                    tags={''}
                    onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags, "tag")}
                    allowTagCreation={false}
                    />)
                break;
            }
            case 'materials':{
                toRender = (<TagsSearch
                    variant="materials"
                    tags={''}
                    onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                    allowTagCreation={false}
                    />)
                break;
            }
            case 'location':{
                toRender = (<LocationSearch value={this.state.locationAddress}
                    className="form-control form-control-sm"
                    onSuggestionSelect={(lat, lon, address) => this.handleLocationSearchSelect(lat, lon, address)}/>)
                break;
            }

        }
        return (
            <div className="filter-body">
                <button style={{backgroundColor: "white", border: "none"}} onClick={() => removeFilter()}><i className="material-icons ">clear</i></button>
                {toRender}
            </div>
        )
    }
}
