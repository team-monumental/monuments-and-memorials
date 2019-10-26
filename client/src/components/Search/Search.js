import React from 'react';
import './Search.scss';
import SearchResult from '../SearchResult/SearchResult';
import Pagination from '../Pagination/Pagination';
import { Form } from 'react-bootstrap';

export default class Search extends React.Component {

    limitOptions = [10, 25, 50, 100];

    render() {
        const { monuments, onLimitChange, onPageChange } = this.props;
        const [ count, page, limit ] = [ parseInt(this.props.count), parseInt(this.props.page), parseInt(this.props.limit) ];

        const pageCount = Math.ceil(count / limit);
        const pageStart = (limit * (page - 1)) + 1;
        const pageEnd = Math.min((limit * (page - 1)) + limit, count);

        return (
                <div className="search-results-column">
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
                            monuments.map((result, index) => result ? (<SearchResult key={result.id} monument={result} index={index + ((page - 1) * limit)}/>) : null)
                        }
                        <div className="d-flex justify-content-center">
                            <Pagination count={pageCount}
                                        page={page - 1}
                                        onPage={page => onPageChange(page + 1)}/>
                        </div>
                    </div>
                </div>
        )
    }
}