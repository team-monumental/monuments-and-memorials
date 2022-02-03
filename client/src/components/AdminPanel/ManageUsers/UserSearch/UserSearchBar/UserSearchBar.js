import * as React from 'react';
import './UserSearchBar.scss';
import {withRouter} from 'react-router-dom';
import * as QueryString from 'query-string';
import TextSearch from '../../../../Header/SearchBar/TextSearch/TextSearch';
import {Button, Form} from 'react-bootstrap';
import search from '../../../../../utils/search';

class UserSearchBar extends React.Component {

    constructor(props) {
        super(props);
        const params = QueryString.parse(props.history.location.search);
        this.state = {
            nameSearchQuery: params.name || '',
            emailSearchQuery: params.email || '',
            roleFilter: params.role || ''
        };
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') this.search();
    }

    search() {
        const {history} = this.props;
        let {nameSearchQuery, emailSearchQuery, roleFilter} = this.state;
        search({
            name: nameSearchQuery,
            email: emailSearchQuery,
            role: roleFilter
        }, history, '/panel/manage/users/search');
    }

    handleNameSearchChange(nameSearchQuery) {
        this.setState({nameSearchQuery});
    }

    async handleNameSearchClear() {
        await this.setState({nameSearchQuery: ''});
        this.search();
    }

    handleEmailSearchChange(emailSearchQuery) {
        this.setState({emailSearchQuery});
    }

    async handleEmailSearchClear() {
        await this.setState({emailSearchQuery: ''});
        this.search();
    }

    async handleRoleChange(role) {
        await this.setState({roleFilter: role});
        this.search();
    }

    render() {
        const {nameSearchQuery, emailSearchQuery, roleFilter} = this.state;
        return (
            <div className="user-search-bar">
                <div className="d-flex">
                    <div className="search-bars-container">
                        <Form.Control as="select"
                                      className="min-width-select form-control-sm mr-2"
                                      onChange={event => this.handleRoleChange(event.target.value)}
                                      value={roleFilter}>
                            <option value="">Select a Role</option>
                            <option value="collaborator">Collaborator</option>
                            <option value="partner">Partner</option>
                            <option value="researcher">Researcher</option>
                            <option value="admin">Admin</option>
                        </Form.Control>
                        <TextSearch disableAnimation
                                    placeholder="User Name"
                                    value={nameSearchQuery}
                                    onKeyDown={event => this.handleKeyDown(event)}
                                    className="form-control form-control-sm"
                                    onSearchChange={searchQuery => this.handleNameSearchChange(searchQuery)}
                                    onClear={() => this.handleNameSearchClear()}/>
                        <TextSearch disableAnimation
                                    placeholder="Email Address"
                                    value={emailSearchQuery}
                                    onKeyDown={event => this.handleKeyDown(event)}
                                    className="form-control form-control-sm"
                                    onSearchChange={searchQuery => this.handleEmailSearchChange(searchQuery)}
                                    onClear={() => this.handleEmailSearchClear()}/>
                    </div>
                    <Button className="btn-sm" onClick={() => this.search()}>
                        Search
                    </Button>
                </div>
            </div>
        );
    }
}

export default withRouter(UserSearchBar);