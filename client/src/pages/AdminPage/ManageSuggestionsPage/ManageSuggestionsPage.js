import * as React from 'react';
import { connect } from 'react-redux';
import { approveCreateSuggestion, approveUpdateSuggestion, fetchBulkCreateSuggestion, fetchCreateSuggestion,
    fetchUpdateSuggestion, rejectCreateSuggestion, rejectUpdateSuggestion } from '../../../actions/suggestions';
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
            approveCreateSuggestion: state.approveCreateSuggestion,
            rejectCreateSuggestion: state.rejectCreateSuggestion,
            approveUpdateSuggestion: state.approveUpdateSuggestion,
            rejectUpdateSuggestion: state.rejectUpdateSuggestion
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
                        case 'update':
                            dispatch(approveUpdateSuggestion(suggestionId));
                            break;
                    }
                }
            } catch (err) {}
        }
    }

    handleSuggestionRejectButtonClick() {
        const { dispatch, match: { params: { suggestionId } }, location: { search } } = this.props;
        const type = QueryString.parse(search).type;

        if (suggestionId && type) {
            try {
                if (!isNaN(parseInt(suggestionId))) {
                    switch (type) {
                        case 'create':
                            dispatch(rejectCreateSuggestion(suggestionId));
                            break;
                        case 'update':
                            dispatch(rejectUpdateSuggestion(suggestionId));
                            break;
                    }
                }
            } catch (err) {}
        }
    }

    render() {
        const { mode, fetchCreateSuggestion, fetchUpdateSuggestion, fetchBulkCreateSuggestion,
            approveCreateSuggestion, rejectCreateSuggestion, approveUpdateSuggestion, rejectUpdateSuggestion,
            location: { search } } = this.props;
        const type = QueryString.parse(search).type;

        const suggestion = approveCreateSuggestion.result || rejectCreateSuggestion.result ||
            approveUpdateSuggestion.result || rejectUpdateSuggestion.result || fetchCreateSuggestion.result ||
            fetchUpdateSuggestion.result || fetchBulkCreateSuggestion.result;

        const pending = approveCreateSuggestion.pending || rejectCreateSuggestion.pending ||
            approveUpdateSuggestion.pending || rejectUpdateSuggestion.pending || fetchCreateSuggestion.pending ||
            fetchUpdateSuggestion.pending || fetchBulkCreateSuggestion.pending;

        return (<>
            <Spinner show={pending}/>
            <ManageSuggestions type={type} mode={mode} suggestion={suggestion}
                               onApproveClick={() => this.handleSuggestionApproveButtonClick()}
                               onRejectClick={() => this.handleSuggestionRejectButtonClick()}/>
        </>);
    }
}

export default withRouter(connect(ManageSuggestionsPage.mapStateToProps)(ManageSuggestionsPage));