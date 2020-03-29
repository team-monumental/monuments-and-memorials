import * as React from 'react';
import { connect } from 'react-redux';

class ManageSuggestionsPage extends React.Component {

    static mapStateToProps(state) {
        return {
            fetchCreateSuggestion: state.fetchCreateSuggestion,
            fetchUpdateSuggestion: state.fetchUpdateSuggestion,
            fetchBulkCreateSuggestion: state.fetchBulkCreateSuggestion
        };
    }

    componentDidMount() {
        this.fetchSuggestionIfIdExists();
    }

    fetchSuggestionIfIdExists() {
        const { dispatch, match: { params: { suggestionId } } } = this.props;

        if (suggestionId) {
            try {
                if (!isNaN(parseInt(suggestionId))) {
                    dispatch(fetch)
                }
            }
        }
    }
}

export default connect(ManageSuggestionsPage.mapStateToProps)(ManageSuggestionsPage);