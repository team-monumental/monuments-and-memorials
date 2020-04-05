import * as React from 'react';
import './SuggestionSearchBar.scss';
import * as QueryString from 'query-string';
import search from '../../../../../utils/search';
import { Form, Button } from 'react-bootstrap';
import TextSearch from '../../../../Header/SearchBar/TextSearch/TextSearch';
import { withRouter } from 'react-router-dom';

class SuggestionSearchBar extends React.Component {

    constructor(props) {
        super(props);

        const params = QueryString.parse(this.props.history.location.search);
        this.state = {
            searchQuery: params.q || '',
            statusFilter: params.status || '',
            typeFilter: params.type || ''
        };
    }

    search() {
        const { history } = this.props;
        const { searchQuery, statusFilter, typeFilter } = this.state;

        search({
            q: searchQuery,
            isApproved: statusFilter === 'approved',
            isRejected: statusFilter === 'rejected',
            type: typeFilter
        }, history, '/panel/manage/suggestions/search');
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.search();
        }
    }

    handleSearchQueryChange(searchQuery) {
        this.setState({searchQuery});
    }

    async handleSearchQueryClear() {
        await this.setState({searchQuery: ''});
        this.search();
    }

    async handleStatusChange(status) {
        await this.setState({statusFilter: status});
        this.search();
    }

    async handleTypeChange(type) {
        await this.setState({typeFilter: type});
        this.search();
    }

    render() {
        const { searchQuery, statusFilter, typeFilter } = this.state;

        return (
            <div className="suggestion-search-bar">
                <div className="d-flex">
                    <div className="form-container">
                        <Form.Control as="select"
                                      className="min-width-select form-control-sm mr-2"
                                      onChange={event => this.handleStatusChange(event.target.value)}
                                      value={statusFilter}>
                            <option value="">Select a Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </Form.Control>
                        <Form.Control as="select"
                                      className="min-width-select form-control-sm mr-2"
                                      onChange={event => this.handleTypeChange(event.target.value)}
                                      value={typeFilter}>
                            <option value="">Select a Suggestion Type</option>
                            <option value="all">All Suggestions</option>
                            <option value="create">Create Suggestions</option>
                            <option value="update">Update Suggestions</option>
                            <option value="bulk">Bulk-Create Suggestions</option>
                        </Form.Control>
                        <TextSearch disableAnimation
                                    placeholder="Created By User Name or Email"
                                    value={searchQuery}
                                    onKeyDown={event => this.handleKeyDown(event)}
                                    className="form-control form-control-sm"
                                    onSearchChange={searchQuery => this.handleSearchQueryChange(searchQuery)}
                                    onClear={() => this.handleSearchQueryClear()}/>
                    </div>
                    <Button className="btn-sm" onClick={() => this.search()}>
                        Search
                    </Button>
                </div>
            </div>
        );
    }
}

export default withRouter(SuggestionSearchBar);