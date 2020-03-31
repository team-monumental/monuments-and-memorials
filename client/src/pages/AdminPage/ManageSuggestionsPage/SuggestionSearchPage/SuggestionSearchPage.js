import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as QueryString from 'query-string';
import { searchSuggestions } from '../../../../actions/search';
import search from '../../../../utils/search';
import { Helmet } from 'react-helmet';
import Spinner from '../../../../components/Spinner/Spinner';
import SuggestionSearch from '../../../../components/AdminPanel/ManageSuggestions/SuggestionSearch/SuggestionSearch';

class SuggestionSearchPage extends React.Component {

    constructor(props) {
        super(props);

        const params = QueryString.parse(props.history.location.search);
        this.state = {
            page: params.page || 1,
            limit: params.limit || 25
        };
    }

    static mapStateToProps(state) {
        const result = {};

        if (state.createSuggestionSearchPage) {
            const { createSuggestions, createSuggestionCount, pending } = state.createSuggestionSearchPage;
            if (!createSuggestions.error && !createSuggestionCount.error && !createSuggestions.errors &&
                !createSuggestionCount.errors) {
                result['createSuggestions'] = {createSuggestions, createSuggestionCount, pending};
            }
        }

        if (state.updateSuggestionSearchPage) {
            const { updateSuggestions, updateSuggestionCount, pending } = state.updateSuggestionSearchPage;
            if (!updateSuggestions.error && !updateSuggestionCount.error && !updateSuggestions.errors &&
                !updateSuggestionCount.errors) {
                result['updateSuggestions'] = {updateSuggestions, updateSuggestionCount, pending};
            }
        }

        if (state.bulkCreateSuggestionSearchPage) {
            const { bulkCreateSuggestions, bulkCreateSuggestionCount, pending } = state.bulkCreateSuggestionSearchPage;
            if (!bulkCreateSuggestions.error && !bulkCreateSuggestionCount.error && !bulkCreateSuggestions.errors &&
                !bulkCreateSuggestionCount.errors) {
                result['bulkCreateSuggestions'] = {bulkCreateSuggestions, bulkCreateSuggestionCount, pending};
            }
        }

        return result;
    }

    componentDidMount() {
        const { showSearchResults, dispatch, location: { search } } = this.props;
        if (showSearchResults) dispatch(searchSuggestions(QueryString.parse(search)));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dispatch, location: { search } } = this.props;
        if (prevProps.location.search !== search) {
            dispatch(searchSuggestions(QueryString.parse(search)));
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
        await this.setState({changedState});
        search(this.state, this.props.history, '/panel/manage/suggestions/search');
    }

    render() {
        // TODO: Determine how the props from redux will be formatted
        const { showSearchResults, suggestions, pending, count } = this.props;

        return (
            <div className="suggestions-search">
                <Helmet title="Search Suggestions | Monuments and Memorials"/>
                <Spinner show={pending}/>
                <SuggestionSearch suggestions={suggestions} {...this.getQueryParams()} count={count}
                                  showSearchResults={showSearchResults}
                                  onLimitChange={this.handleLimitChange.bind(this)}
                                  onPageChange={this.handlePageChange.bind(this)}/>
            </div>
        );
    }
}

export default withRouter(connect(SuggestionSearchPage.mapStateToProps)(SuggestionSearchPage));