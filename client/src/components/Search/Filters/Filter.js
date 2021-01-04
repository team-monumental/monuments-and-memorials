import React from 'react';
import LocationSearch from '../../Header/SearchBar/LocationSearch/LocationSearch';
import './Filters.scss';
import search from '../../../utils/search';
import TagsSearch from '../TagsSearch/TagsSearch';
import DateSearch from './DateSearch'
import 'rc-slider/assets/index.css';

/**
 * A condensed Monument info card for use in search results
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
        console.log(tag)
        params[variant] = selectedTags.map(tag => tag.name);
        search(params, this.props.history, uri);
    }

    handleDateSearchSelect(params) {
        const { uri } = this.props;
        search(params, this.props.history, uri);
    }

    render() {
        const { type, decades, index } = this.props;
        
        let toRender = (<div>ERROR</div>)
        switch(type){
            case 'tags':{
                toRender = (<TagsSearch
                    variant="tags"
                    tags={['Men']}
                    onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags, "tag")}
                    allowTagCreation={true}
                    />)
                break;
            }
            case 'materials':{
                toRender = (<TagsSearch
                    variant="materials"
                    tags={['Metal']}
                    onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                    allowTagCreation={true}
                    />)
                break;
            }
            case 'location':{
                toRender = (<LocationSearch value={this.state.locationAddress}
                    className="form-control form-control-sm"
                    onSuggestionSelect={(lat, lon, address) => this.handleLocationSearchSelect(lat, lon, address)}/>)
                break;
            }
            case 'date':{
                toRender = (<DateSearch decades={decades} value={this.state.locationAddress}
                    onChange = {(params) => this.handleDateSearchSelect(params)}
                    className="form-control form-control-sm"/>)
                break;
            }

        }
        return (
            <div className="filter-body">
                <button style={{backgroundColor: "white", border: "none"}}><i className="material-icons ">clear</i></button>
                {toRender}
            </div>
        )
    }
}

/**
 * <LocationSearch value={locationAddress}
                                className="form-control form-control-sm"
                                onSuggestionSelect={(lat, lon, address) => this.handleLocationSearchSelect(lat, lon, address)}/>
 */