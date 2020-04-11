import * as React from 'react';
import { connect } from 'react-redux';
import { approveCreateSuggestion, approveUpdateSuggestion, fetchBulkCreateSuggestion, fetchCreateSuggestion,
    fetchUpdateSuggestion, rejectCreateSuggestion, rejectUpdateSuggestion, rejectBulkCreateSuggestion,
    approveBulkCreateSuggestion } from '../../../actions/suggestions';
import Spinner from '../../../components/Spinner/Spinner';
import ManageSuggestions from '../../../components/AdminPanel/ManageSuggestions/ManageSuggestions';
import { withRouter } from 'react-router-dom';
import * as QueryString from 'query-string';
import { Modal, ProgressBar } from 'react-bootstrap';

class ManageSuggestionsPage extends React.Component {

    static mapStateToProps(state) {
        return {
            fetchCreateSuggestion: state.fetchCreateSuggestion,
            fetchUpdateSuggestion: state.fetchUpdateSuggestion,
            fetchBulkCreateSuggestion: state.fetchBulkCreateSuggestion,
            approveCreateSuggestion: state.approveCreateSuggestion,
            rejectCreateSuggestion: state.rejectCreateSuggestion,
            approveUpdateSuggestion: state.approveUpdateSuggestion,
            rejectUpdateSuggestion: state.rejectUpdateSuggestion,
            approveBulkCreateSuggestion: state.approveBulkCreateSuggestion,
            rejectBulkCreateSuggestion: state.rejectBulkCreateSuggestion
        };
    }

    componentDidMount() {
        this.fetchSuggestionIfIdAndTypeExists();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dispatch, match: { params: { suggestionId } } } = this.props;

        if (prevProps.approveBulkCreateSuggestion.pending && !this.props.approveBulkCreateSuggestion.pending &&
            Array.isArray(this.props.approveBulkCreateSuggestion.result)) {
            dispatch(fetchBulkCreateSuggestion(suggestionId));
        }
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
                        case 'bulk':
                            dispatch(approveBulkCreateSuggestion(suggestionId));
                            break;
                        default:
                            return;
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
                        case 'bulk':
                            dispatch(rejectBulkCreateSuggestion(suggestionId));
                            break;
                        default:
                            return;
                    }
                }
            } catch (err) {}
        }
    }

    render() {
        const { mode, fetchCreateSuggestion, fetchUpdateSuggestion, fetchBulkCreateSuggestion,
            approveCreateSuggestion, rejectCreateSuggestion, approveUpdateSuggestion, rejectUpdateSuggestion,
            location: { search }, rejectBulkCreateSuggestion, approveBulkCreateSuggestion } = this.props;
        const type = QueryString.parse(search).type;

        const suggestion = approveCreateSuggestion.result || rejectCreateSuggestion.result ||
            approveUpdateSuggestion.result || rejectUpdateSuggestion.result || rejectBulkCreateSuggestion.result ||
            fetchCreateSuggestion.result || fetchUpdateSuggestion.result || fetchBulkCreateSuggestion.result;

        const pending = approveCreateSuggestion.pending || rejectCreateSuggestion.pending ||
            approveUpdateSuggestion.pending || rejectUpdateSuggestion.pending || rejectBulkCreateSuggestion.pending ||
            fetchCreateSuggestion.pending || fetchUpdateSuggestion.pending || fetchBulkCreateSuggestion.pending;

        return (<>
            <Spinner show={pending}/>
            <ManageSuggestions type={type} mode={mode} suggestion={suggestion}
                               onApproveClick={() => this.handleSuggestionApproveButtonClick()}
                               onRejectClick={() => this.handleSuggestionRejectButtonClick()}/>
           <Modal show={approveBulkCreateSuggestion.pending}>
               <Modal.Header>
                   <Modal.Title>
                       Bulk Creating Monuments or Memorials
                   </Modal.Title>
               </Modal.Header>
               <Modal.Body>
                   <div>
                       Please wait while the monuments or memorials are being created...
                   </div>
                   <ProgressBar now={approveBulkCreateSuggestion.progress * 100}/>
               </Modal.Body>
           </Modal>
        </>);
    }
}

export default withRouter(connect(ManageSuggestionsPage.mapStateToProps)(ManageSuggestionsPage));