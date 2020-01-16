import React from 'react';
import './SearchBar.scss';
import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import * as QueryString from 'query-string';
import TextSearch from './TextSearch/TextSearch';
import LocationSearch from './LocationSearch/LocationSearch';
import search from '../../../utils/search';

/**
 * Root presentational component for the search bar, including text and location searching
 */
class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        const params = QueryString.parse(props.history.location.search);
        this.state = {
            textSearchQuery: params.q || '',
            locationLat: params.lat || '',
            locationLon: params.lon || '',
            locationAddress: params.address || '',
            distanceFilter: params.d || 25
        };
    }

    handleTextSearchChange(textSearchQuery) {
        this.setState({textSearchQuery: textSearchQuery});
    }

    async handleTextSearchClear() {
        await this.setState({textSearchQuery: ''});
        this.search();
    }

    async handleLocationSearchSelect(lat, lon, address) {
        await this.setState({locationLat: lat, locationLon: lon, locationAddress: address});
        this.search();
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') this.search();
    }

    search() {
        let { textSearchQuery, locationLat, locationLon, locationAddress, distanceFilter } = this.state;
        search({
            q: textSearchQuery,
            lat: locationLat,
            lon: locationLon,
            d: distanceFilter,
            address: locationAddress
        }, this.props.history);
        if(typeof this.props.onCloseModal == 'function') {
            this.props.onCloseModal();
        }
    }

    render() {
        const { textSearchQuery, locationAddress } = this.state;
        return (
            <Form inline className="search-bar">
                <TextSearch value={textSearchQuery}
                            onKeyDown={event => this.handleKeyDown(event)}
                            className="form-control form-control-sm"
                            onSearchChange={(searchQuery) => this.handleTextSearchChange(searchQuery)}
                            onClear={() => this.handleTextSearchClear()}/>
                <LocationSearch value={locationAddress}
                                className="form-control form-control-sm"
                                onSuggestionSelect={(lat, lon, address) => this.handleLocationSearchSelect(lat, lon, address)}/>
                <Button variant="primary btn-sm" className="search-button" onClick={() => this.search()}>Search</Button>
            </Form>
        )
    }
}

export default withRouter(SearchBar);