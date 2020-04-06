import * as React from 'react';
import { connect } from 'react-redux';
import { approveCreateSuggestion, fetchBulkCreateSuggestion, fetchCreateSuggestion,
    fetchUpdateSuggestion } from '../../../actions/suggestions';
import Spinner from '../../../components/Spinner/Spinner';
import ManageSuggestions from '../../../components/AdminPanel/ManageSuggestions/ManageSuggestions';
import { withRouter } from 'react-router-dom';
import * as QueryString from 'query-string';

class ManageSuggestionsPage extends React.Component {

    static mapStateToProps(state) {
        return {
            fetchCreateSuggestion: state.fetchCreateSuggestion,
            fetchUpdateSuggestion: state.fetchUpdateSuggestion,
            fetchBulkCreateSuggestion: state.fetchBulkCreateSuggestion,
            approveCreateSuggestion: state.approveCreateSuggestion
        };
    }

    componentDidMount() {
        this.fetchSuggestionIfIdAndTypeExists();
    }

    fetchSuggestionIfIdAndTypeExists() {
        const { dispatch, match: { params: { suggestionId } }, location: { search } } = this.props;
        const type = QueryString.parse(search).type;

        if (suggestionId && type) {
            try {
                if (!isNaN(parseInt(suggestionId))) {
                    switch (type) {
                        case 'create':
                            dispatch(fetchCreateSuggestion(suggestionId));
                            break;
                        case 'update':
                            dispatch(fetchUpdateSuggestion(suggestionId));
                            break;
                        case 'bulk':
                            dispatch(fetchBulkCreateSuggestion(suggestionId));
                            break;
                        default:
                            break;
                    }
                }
            } catch (err) {}
        }
    }

    handleSuggestionApproveButtonClick() {
        const { dispatch, match: { params: { suggestionId } }, location: { search } } = this.props;
        const type = QueryString.parse(search).type;

        if (suggestionId && type) {
            try {
                if (!isNaN(parseInt(suggestionId))) {
                    switch (type) {
                        case 'create':
                            dispatch(approveCreateSuggestion(suggestionId));
                            break;
                    }
                }
            } catch (err) {}
        }
    }

    render() {
        const { mode, fetchCreateSuggestion, fetchUpdateSuggestion, fetchBulkCreateSuggestion,
            approveCreateSuggestion } = this.props;

        const suggestion = fetchCreateSuggestion.result || fetchUpdateSuggestion.result || fetchBulkCreateSuggestion.result;
        const pending = fetchCreateSuggestion.pending || fetchUpdateSuggestion.pending ||
            fetchBulkCreateSuggestion.pending || approveCreateSuggestion.pending;

        return (<>
            <Spinner show={pending}/>
            <ManageSuggestions mode={mode} suggestion={suggestion}
                               onApproveClick={() => this.handleSuggestionApproveButtonClick()}/>
        </>);
    }
}

export default withRouter(connect(ManageSuggestionsPage.mapStateToProps)(ManageSuggestionsPage));