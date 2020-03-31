import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as QueryString from 'query-string';

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
            const { createSuggestions, createSuggestionCount } = state.createSuggestionSearchPage;
            if (!createSuggestions.error && !createSuggestionCount.error && !createSuggestions.errors &&
                !createSuggestionCount.errors) {
                result['createSuggestions'] = {createSuggestions, createSuggestionCount};
            }
        }

        if (state.updateSuggestionSearchPage) {
            const { updateSuggestions, updateSuggestionCount } = state.updateSuggestionSearchPage;
            if (!updateSuggestions.error && !updateSuggestionCount.error && !updateSuggestions.errors &&
                !updateSuggestionCount.errors) {
                result['updateSuggestions'] = {updateSuggestions, updateSuggestionCount};
            }
        }

        if (state.bulkCreateSuggestionSearchPage) {
            const { bulkCreateSuggestions, bulkCreateSuggestionCount } = state.bulkCreateSuggestionSearchPage;
            if (!bulkCreateSuggestions.error && !bulkCreateSuggestionCount.error && !bulkCreateSuggestions.errors &&
                !bulkCreateSuggestionCount.errors) {
                result['bulkCreateSuggestions'] = {bulkCreateSuggestions, bulkCreateSuggestionCount};
            }
        }

        return result;
    }

    componentDidMount() {
        const { showSearchResults, dispatch, location: { search } } = this.props;
        if (showSearchResults) dispatch()
    }
}

export default withRouter(connect(SuggestionSearchPage.mapStateToProps)(SuggestionSearchPage));