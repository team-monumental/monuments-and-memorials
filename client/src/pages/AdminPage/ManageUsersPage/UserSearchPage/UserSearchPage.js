import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as QueryString from 'query-string';
import UserSearch from '../../../../components/AdminPanel/ManageUsers/UserSearch/UserSearch';
import {Helmet} from 'react-helmet';
import Spinner from '../../../../components/Spinner/Spinner';
import {searchUsers} from '../../../../actions/search';
import search from '../../../../utils/search';

class UserSearchPage extends React.Component {

    constructor(props) {
        super(props);
        const params = QueryString.parse(props.history.location.search);
        this.state = {
            page: params.page || 1,
            limit: params.limit || 25
        }
    }

    static mapStateToProps(state) {
        if (state.userSearchPage) {
            const {users, count} = state.userSearchPage;
            if (users.error || count.error || users.errors || count.errors) return {};
        }
        return state.userSearchPage;
    }

    componentDidMount() {
        const {showSearchResults, dispatch, location: {search}} = this.props;
        if (showSearchResults) dispatch(searchUsers(QueryString.parse(search)));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {dispatch, location: {search}} = this.props;
        if (prevProps.location.search !== search) {
            dispatch(searchUsers(QueryString.parse(search)));
        }
    }

    getQueryParams() {
        return {
            ...QueryString.parse(this.props.history.location.search, {arrayFormat: 'comma'}),
            ...this.state
        };
    }

    handleLimitChange(limit) {
        this.search({limit, page: 1});
    }

    handlePageChange(page) {
        this.search({page});
    }

    async search(changedState) {
        await this.setState(changedState);
        search(this.state, this.props.history, '/panel/manage/users/search');
    }

    render() {
        const {showSearchResults, users, pending, count} = this.props;
        return (
            <div className="users-search">
                <Helmet title="Search Users | Monuments and Memorials"/>
                <Spinner show={pending}/>
                <UserSearch users={users} {...this.getQueryParams()} count={count}
                            showSearchResults={showSearchResults}
                            onLimitChange={this.handleLimitChange.bind(this)}
                            onPageChange={this.handlePageChange.bind(this)}/>
            </div>
        );
    }
}

export default withRouter(connect(UserSearchPage.mapStateToProps)(UserSearchPage));