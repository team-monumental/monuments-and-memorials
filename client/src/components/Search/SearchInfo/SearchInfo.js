import * as React from 'react';
import { Form } from 'react-bootstrap';

export default class SearchInfo extends React.Component {

    limitOptions = [10, 25, 50, 100];

    render() {
        const { onLimitChange, onSortChange, limit, page, count, sort, showDistanceSort } = this.props;

        const pageEnd = Math.min((limit * (page - 1)) + limit, count);
        const pageStart = Math.min((limit * (page - 1)) + 1, pageEnd);
        return (
            <div className="search-info">
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
                    <Form.Control as="select" className="ml-2" defaultValue={sort} onChange={event => onSortChange(event.target.value)} >
                        <option value="relevance">Relevance</option>
                        {
                            showDistanceSort ? <option value="distance">Distance</option> : null
                        }
                        <option value="newest">Date Created (Newest First)</option>
                        <option value="oldest">Date Created (Oldest First)</option>
                    </Form.Control>
                </div>
            </div>
        )
    }
}