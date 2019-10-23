import React from 'react';
import './Search.scss';
import request from '../../utils/request';
import SearchResult from '../SearchResult/SearchResult';
import Pagination from '../Pagination/Pagination';
import { Form, Spinner } from 'react-bootstrap';

export default class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            monuments: [],
            page: this.getPage() || 1,
            limit: this.getLimit() || 25,
            loading: true
        };
        console.log(this.state, props);
    }

    limitOptions = [10, 25, 50, 100];

    getPage() {
        return this.getQueryParam('page');
    }

    getLimit() {
        return this.getQueryParam('limit');
    }

    getQueryParam(param) {
        let value = this.props.history.location.search.match(new RegExp(`(?<=${param}=)\\d+`));
        if (value) {
            try {
                value = parseInt(value);
                let state = {};
                state[param] = value;
                if (value !== this.state[param]) this.setState(state);
            } catch (err) {}
        }
        return value;
    }

    async componentDidMount() {
        console.log('mount');
        await this.search();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('update');
        if (prevProps.location.search !== this.props.location.search) {
            this.setState({loading: true});
            this.getPage();
            this.getLimit();
            await this.search();
        }
    }

    async search() {
        let error;
        console.log('searching');
        const results = await Promise.all([
            request(`/api/search${this.props.location.search}`),
            request(`/api/search/count/${this.props.location.search}`)
        ]).catch(err => error = err);

        if (error) {
            console.error(error);
            this.setState({loading: false, error: error});
            return;
        }

        const [monuments, count] = results;
        this.setState({loading: false, monuments, count});
        console.log(this.state);
    }

    render() {
        const { error, monuments, count, page, limit, loading } = this.state;
        if (error) return this.renderError();
        const pageCount = Math.ceil(count / limit);
        return (
                <div className="search-results-column">
                    {loading ?
                        (<div className="spinner-container">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>)
                        : null
                    }
                    <div className="search-results">
                        <div className="search-header">
                            <div>
                                {count} Search Results
                            </div>
                            <div>
                                <span>Show</span>
                                <Form.Control as="select" className="mx-2" onChange={event => this.props.history.push(`/search${this.props.location.search.replace(/limit=\d+/g, 'limit=' + event.target.value)}`)}>
                                    {
                                        this.limitOptions.map(opt => (
                                            <option value={opt} selected={opt === limit}>{opt}</option>
                                        ))
                                    }
                                </Form.Control>
                                <span>per page</span>
                            </div>
                            <div>
                                <span>Sort by</span>
                                <Form.Control as="select" className="ml-2">
                                    <option>Relevance</option>
                                    <option>Distance</option>
                                </Form.Control>
                            </div>
                        </div>
                        {
                            monuments.map((result, index) => result ? (<SearchResult key={result.id} monument={result} index={index + ((page - 1) * limit)}/>) : null)
                        }
                        <div className="d-flex justify-content-center">
                            <Pagination count={pageCount}
                                        page={page - 1}
                                        onPage={page => this.props.history.push(`/search${this.props.location.search.replace(/page=\d+/g, 'page=' + (page + 1))}`)}/>
                        </div>
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