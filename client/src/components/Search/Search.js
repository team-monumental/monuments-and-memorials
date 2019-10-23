import React from 'react';
import './Search.scss';
import request from '../../utils/request';
import SearchResult from '../SearchResult/SearchResult';

export default class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            results: []
        }
    }

    async componentDidMount() {
        await this.search();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search === this.props.location.search) return;
        await this.search();
    }

    async search() {
        let error;
        console.log("Searching", `/api/search/${window.location.search}`);
        const results = await request(`/api/search/${window.location.search}`)
            .catch(err => error = err);

        if (error) {
            console.error(error);
            this.setState({error: error});
            return;
        }

        this.setState({results});
        console.log(results);
    }

    render() {
        if (this.state.error) return this.renderError();
        return (
            <div>
                <div>{this.state.results.length} Search Results</div>
                <div className="search-results">
                    {
                        this.state.results.map((result, index) => result ? (<SearchResult key={result.id} monument={result} index={index}/>) : null)
                    }
                </div>
            </div>
        )
    }

    // TODO: Make this pretty
    renderError() {
        const error = this.state.error;
        return (
            <div className="page-container">
                <span>An error occurred: "{error.message}"</span>
            </div>
        )
    }
}