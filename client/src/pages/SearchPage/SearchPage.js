import React from 'react';
import { connect } from 'react-redux';
import { searchMonuments } from '../../actions/search';
import Spinner from '../../components/Spinner/Spinner';
import Search from '../../components/Search/Search';
import * as QueryString from 'query-string';
import newSearch from '../../utils/new-search';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

/**
 * Root container component for the search page which handles retrieving the search results
 * and the total count of search results via redux actions. It does this solely by checking the
 * page's query params when it is rendered, so other pages must redirect to the search page in order
 * to trigger a search
 */
class SearchPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static mapStateToProps(state) {
        if (state.searchPage) {
            const { monuments, count } = state.searchPage;
            if (monuments.error || count.error || monuments.errors || count.errors) return {};
        }
        return state.searchPage;
    }

    componentDidMount() {
        const { dispatch, location: { search } } = this.props;
        const params = QueryString.parse(search);
        dispatch(searchMonuments(params));
        this.setState({
            q: params.q,
            page: params.page || 1,
            limit: params.limit || 25,
            d: params.d || 25
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dispatch, location: { search } } = this.props;
        if (prevProps.location.search !== search) {
            const params = QueryString.parse(search);
            dispatch(searchMonuments(params));
            this.setState({
                ...params
            });
        }
    }

    render() {
        const { monuments, count, pending, hideMap, hideImages, searchUri, monumentUri } = this.props;
        return (
            <div className="h-100">
                <Helmet title="Search | Monuments and Memorials"/>
                <Spinner show={pending}/>
                <Search monuments={monuments} {...this.getQueryParams()} count={count} hideMap={hideMap} hideImages={hideImages} searchUri={searchUri} monumentUri={monumentUri}
                        onLimitChange={this.handleLimitChange.bind(this)} onPageChange={this.handlePageChange.bind(this)}
                        onSortChange={this.handleSortChange.bind(this)}/>
            </div>
        );
    }

    getQueryParams() {
        const params = {
            ...QueryString.parse(this.props.history.location.search, {arrayFormat: 'comma'}),
            ...this.state
        };
        if (params.tags && typeof params.tags === 'string') params.tags = [params.tags];
        return params;
    }

    handleLimitChange(limit) {
        this.search({limit, page: 1});
    }

    handlePageChange(page) {
        this.search({page});
    }

    handleSortChange(sort) {
        this.search({
            sort
        });
    }

    async search(changedState) {
        const { uri } = this.props;
        await this.setState(changedState);
        newSearch(this.state, this.props.history, uri);
    }
}

export default withRouter(connect(SearchPage.mapStateToProps)(SearchPage));