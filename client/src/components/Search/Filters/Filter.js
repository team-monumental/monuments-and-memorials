import React from 'react';
import LocationSearch from '../../Header/SearchBar/LocationSearch/LocationSearch';
import './Filters.scss';
import search from '../../../utils/search';
import TagsSearch from '../TagsSearch/TagsSearch';

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
    handleTagsSearchTagSelect(variant, selectedTags) {
        const { uri } = this.props;
        const params = {};

        params[variant] = selectedTags.map(tag => tag.name);
        search(params, this.props.history, uri);
    }

    render() {
        const { type, index } = this.props;
        let toRender = (<div>ERROR</div>)
        switch(type){
            case 'tags':{
                toRender = (<TagsSearch
                    variant="tags"
                    tags={[]}
                    onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                    allowTagCreation={true}
                    />)
                break;
            }
            case 'materials':{
                toRender = (<TagsSearch
                    variant="materials"
                    tags={[]}
                    onChange={(variant, selectedTags) => this.handleTagsSearchTagSelect(variant, selectedTags)}
                    allowTagCreation={true}
                    />)
                break;
            }
            case 'location':{
                toRender = (<LocationSearch value={this.state.locationAddress}
                    className="form-control form-control-sm"
                    onSuggestionSelect={(lat, lon, address) => this.handleLocationSearchSelect(lat, lon, address)}/>)
                
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