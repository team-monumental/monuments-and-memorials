import React from 'react';
import './SearchBar.scss';
import { Button, Form } from 'react-bootstrap';
import * as QueryString from 'query-string';
import TextSearch from './TextSearch/TextSearch';
import LocationSearch from './LocationSearch/LocationSearch';

/**
 * Root presentational component for the search bar, including text and location searching
 */
export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        const search = QueryString.parse(window.location.search);
        this.state = {
            textSearchQuery: search.q || '',
            locationLat: search.lat || '',
            locationLon: search.lon || '',
            locationAddress: search.address || ''
        };
    }

    handleTextSearchChange(textSearchQuery) {
        this.setState({textSearchQuery: textSearchQuery});
    }

    async handleTextSearchClear() {
        await this.setState({textSearchQuery: ''});
        console.log('clear');
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
        let { textSearchQuery, locationLat, locationLon, locationAddress } = this.state;
        const queryString = QueryString.stringify({
            q: textSearchQuery,
            page: 1,
            limit: 25,
            lat: locationLat,
            lon: locationLon,
            d: 25,
            address: locationAddress
        });
        window.location.href = `/search/?${queryString}`;
    }

    render() {
        const { textSearchQuery, locationAddress } = this.state;
        return (
            <Form inline className="d-none d-lg-flex">
                <TextSearch value={textSearchQuery}
                            onKeyDown={event => this.handleKeyDown(event)}
                            className="form-control form-control-sm mr-sm-2"
                            onSearchChange={(searchQuery) => this.handleTextSearchChange(searchQuery)}
                            onClear={() => this.handleTextSearchClear()}/>
                <LocationSearch value={locationAddress}
                                className="form-control form-control-sm mr-sm-2"
                                onSuggestionSelect={(lat, lon, address) => this.handleLocationSearchSelect(lat, lon, address)}/>
                <Button variant="primary btn-sm" onClick={() => this.search()}>Search</Button>
            </Form>
        )
    }
}