import React from 'react';
import './SearchBar.scss';
import { Button, Form } from 'react-bootstrap';
import * as QueryString from 'query-string';
import TextSearch from './TextSearch/TextSearch';

/**
 * Root presentational component for the search bar, including text and location searching
 */
export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.TextSearch = React.createRef();
    }

    render() {
        return (
            <Form inline className="d-none d-lg-block">
                <TextSearch value={QueryString.parse(window.location.search)['q'] || ''}
                            onKeyDown={event => this.handleKeyDown(event)}
                            className="form-control form-control-sm mr-sm-2"
                            ref={this.TextSearch}/>
                <input type="text"
                       placeholder="Near..."
                       className="form-control form-control-sm mr-sm-2"/>
                <Button variant="primary btn-sm" onClick={() => this.search()}>Search</Button>
            </Form>
        )
    }

    search() {
        const searchQuery = this.TextSearch.current.state.searchQuery;
        if (!searchQuery) return;
        const queryString = QueryString.stringify({
            q: searchQuery,
            page: 1,
            limit: 25
        });
        window.location.replace(`/search/?${queryString}`);
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') this.search();
    }
}