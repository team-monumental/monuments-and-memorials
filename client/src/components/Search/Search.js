import React from 'react';
import './Search.scss';
import SearchResult from './SearchResult/SearchResult';
import Pagination from '../Pagination/Pagination';
import { Form } from 'react-bootstrap';
import MapResults from './MapResults/MapResults';

/**
 * Root presentational component for the search page
 */
export default class Search extends React.Component {

    limitOptions = [10, 25, 50, 100];

    render() {
        const { monuments, onLimitChange, onPageChange } = this.props;
        const [ count, page, limit ] = [ parseInt(this.props.count) || 0, parseInt(this.props.page) || 0, parseInt(this.props.limit) || 0 ];

        const pageCount = Math.ceil(count / limit);
        const pageEnd = Math.min((limit * (page - 1)) + limit, count);
        const pageStart = Math.min((limit * (page - 1)) + 1, pageEnd);

        return (
                <div className="search-results-page">
                    <div/>
                    <div className="search-results">
                        <div className="search-header">
                            <div>
                                Showing {pageStart} - {pageEnd} of {count}  results
                            </div>
                            <div>
                                <span>Show</span>
                                <Form.Control as="select" className="mx-2" defaultValue={limit} onChange={event => onLimitChange(event.target.value)}>
                                    {
                                        this.limitOptions.map(opt => (
                                            <option value={opt} key={opt}>{opt}</option>
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
                            monuments && monuments.length ?
                                monuments.map((result, index) => result ? (<SearchResult key={result.id} monument={result} index={index + ((page - 1) * limit)}/>) : null)
                                : <div className="mb-4 mt-3 text-center">No search results were found. Try broadening your search.</div>
                        }
                        <div className="d-flex justify-content-center">
                            <Pagination count={pageCount}
                                        page={page - 1}
                                        onPage={page => onPageChange(page + 1)}/>
                        </div>
                    </div>
                    <div className="map-results">
                        <MapResults monuments={monuments} zoom={4}/>
                    </div>
                </div>
        )
    }
}