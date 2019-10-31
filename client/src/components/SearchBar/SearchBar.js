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
        this.state = {
            textSearchQuery: '',
            locationLat: '',
            locationLon: ''
        };
    }

    handleTextSearchChange(textSearchQuery) {
        this.setState({textSearchQuery: textSearchQuery});
    }

    handleLocationSearchSelect(lat, lon) {
        this.setState({locationLat: lat, locationLon: lon});
        this.search();
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') this.search();
    }

    search() {
        let { textSearchQuery, locationLat, locationLon } = this.state;
        if (!textSearchQuery && (!locationLat || !locationLon)) return;
        textSearchQuery = (textSearchQuery === '') ? null : textSearchQuery;
        const queryString = QueryString.stringify({
            q: textSearchQuery,
            page: 1,
            limit: 25,
            lat: locationLat,
            lon: locationLon,
            d: 25
        });
        window.location.replace(`/search/?${queryString}`);
    }

    render() {
        return (
            <Form inline className="d-none d-lg-block">
                <TextSearch value={QueryString.parse(window.location.search)['q'] || ''}
                            onKeyDown={event => this.handleKeyDown(event)}
                            className="form-control form-control-sm mr-sm-2"
                            onSearchChange={(searchQuery) => this.handleTextSearchChange(searchQuery)}/>
                <LocationSearch value={QueryString.parse(window.location.search)['d'] || ''}
                                className="form-control form-control-sm mr-sm-2"
                                onSuggestionSelect={(lat, lon) => this.handleLocationSearchSelect(lat, lon)}/>
                <Button variant="primary btn-sm" onClick={() => this.search()}>Search</Button>
            </Form>
        )
    }
}