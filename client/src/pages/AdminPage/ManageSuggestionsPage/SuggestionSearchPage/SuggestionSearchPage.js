import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as QueryString from 'query-string';
import {searchSuggestions} from '../../../../actions/search';
import search from '../../../../utils/search';
import {Helmet} from 'react-helmet';
import Spinner from '../../../../components/Spinner/Spinner';
import SuggestionSearch from '../../../../components/AdminPanel/ManageSuggestions/SuggestionSearch/SuggestionSearch';

class SuggestionSearchPage extends React.Component {

    constructor(props) {
        super(props);

        const params = QueryString.parse(props.history.location.search);
        this.state = {
            page: params.page || 1,
            limit: params.limit || 25,
            type: params.type || ''
        };
    }

    static mapStateToProps(state) {
        const result = {};

        if (state.createSuggestionSearchPage) {
            const {createSuggestions, count, pending, error} = state.createSuggestionSearchPage;
            if (!error) {
                result['createSuggestions'] = {
                    results: createSuggestions,
                    count,
                    pending
                };
            }
        }

        if (state.updateSuggestionSearchPage) {
            const {updateSuggestions, count, pending, error} = state.updateSuggestionSearchPage;
            if (!error) {
                result['updateSuggestions'] = {
                    results: updateSuggestions,
                    count,
                    pending
                };
            }
        }

        if (state.bulkCreateSuggestionSearchPage) {
            const {bulkCreateSuggestions, count, pending, error} = state.bulkCreateSuggestionSearchPage;
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
        const {showSearchResults, dispatch, location: {search}} = this.props;
        if (showSearchResults) dispatch(searchSuggestions(QueryString.parse(search)));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {dispatch, location: {search}} = this.props;
        const params = QueryString.parse(search);

        if (params.type !== this.state.type) {
            this.setState({type: params.type});
        }
        if (prevProps.location.search !== search) {
            const queryParams = QueryString.parse(search);
            this.setState({...queryParams});
            dispatch(searchSuggestions(queryParams));
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
        search(this.state, this.props.history, '/panel/manage/suggestions/search');
    }

    render() {
        const {showSearchResults, createSuggestions, updateSuggestions, bulkCreateSuggestions} = this.props;
        const {type} = this.state;

        const pending = createSuggestions.pending || updateSuggestions.pending || bulkCreateSuggestions.pending;

        let count, suggestions;
        switch (type) {
            case 'create':
                count = createSuggestions.count;
                suggestions = {
                    createSuggestions: createSuggestions.results
                };
                break;
            case 'update':
                count = updateSuggestions.count;
                suggestions = {
                    updateSuggestions: updateSuggestions.results
                };
                break;
            case 'bulk':
                count = bulkCreateSuggestions.count;
                suggestions = {
                    bulkCreateSuggestions: bulkCreateSuggestions.results
                };
                break;
            default:
                count = createSuggestions.count + updateSuggestions.count + bulkCreateSuggestions.count;
                suggestions = {
                    createSuggestions: createSuggestions.results,
                    updateSuggestions: updateSuggestions.results,
                    bulkCreateSuggestions: bulkCreateSuggestions.results
                };
                break;
        }

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