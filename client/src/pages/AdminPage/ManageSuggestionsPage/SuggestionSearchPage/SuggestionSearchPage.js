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
            const { createSuggestions, count, pending, error } = state.createSuggestionSearchPage;
            if (!error) {
                result['createSuggestions'] = {
                    results: createSuggestions,
                    count,
                    pending
                };
            }
        }

        if (state.updateSuggestionSearchPage) {
            const { updateSuggestions, count, pending, error } = state.updateSuggestionSearchPage;
            if (!error) {
                result['updateSuggestions'] = {
                    results: updateSuggestions,
                    count,
                    pending
                };
            }
        }

        if (state.bulkCreateSuggestionSearchPage) {
            const { bulkCreateSuggestions, count, pending, error } = state.bulkCreateSuggestionSearchPage;
            if (!error) {
                result['bulkCreateSuggestions'] = {
                    results: bulkCreateSuggestions,
                    count,
                    pending
                };
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
        const { showSearchResults, createSuggestions, updateSuggestions, bulkCreateSuggestions } = this.props;

        const pending = createSuggestions.pending || updateSuggestions.pending || bulkCreateSuggestions.pending;
        const suggestions = {
            createSuggestions: createSuggestions.results,
            updateSuggestions: updateSuggestions.results,
            bulkCreateSuggestions: bulkCreateSuggestions.results
        };
        const count = createSuggestions.count + updateSuggestions.count + bulkCreateSuggestions.count;

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