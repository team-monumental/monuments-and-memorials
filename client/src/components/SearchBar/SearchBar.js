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
            textSearchQuery: ''
        };
    }

    handleTextSearchChange(textSearchQuery) {
        this.setState({textSearchQuery: textSearchQuery});
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') this.search();
    }

    search() {
        /*const searchQuery = '';
        if (!searchQuery) return;
        const queryString = QueryString.stringify({
            q: searchQuery,
            page: 1,
            limit: 25
        });
        window.location.replace(`/search/?${queryString}`);*/
        console.log(this.state.textSearchQuery);
    }

    render() {
        return (
            <Form inline className="d-none d-lg-block">
                <TextSearch value={QueryString.parse(window.location.search)['q'] || ''}
                            onKeyDown={event => this.handleKeyDown(event)}
                            className="form-control form-control-sm mr-sm-2"
                            onSearchChange={(searchQuery) => this.handleTextSearchChange(searchQuery)}/>
                <LocationSearch value={QueryString.parse(window.location.search)['d'] || ''}
                                onKeyDown={event => this.handleKeyDown(event)}
                                className="form-control form-control-sm mr-sm-2"
                                onSearch={(searchQuery) => this.handleSearch(searchQuery)}/>
                <Button variant="primary btn-sm" onClick={() => this.search()}>Search</Button>
            </Form>
        )
    }
}