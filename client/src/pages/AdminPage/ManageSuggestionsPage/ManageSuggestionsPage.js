import * as React from 'react';
import {connect} from 'react-redux';
import {
    approveBulkCreateSuggestion,
    approveCreateSuggestion,
    approveUpdateSuggestion,
    fetchBulkCreateSuggestion,
    fetchCreateSuggestion,
    fetchUpdateSuggestion,
    rejectBulkCreateSuggestion,
    rejectCreateSuggestion,
    rejectUpdateSuggestion
} from '../../../actions/suggestions';
import Spinner from '../../../components/Spinner/Spinner';
import ManageSuggestions from '../../../components/AdminPanel/ManageSuggestions/ManageSuggestions';
import {withRouter} from 'react-router-dom';
import * as QueryString from 'query-string';
import {Modal, ProgressBar} from 'react-bootstrap';

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
        this.fetchSuggestionIfIdAndTypeExist();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {dispatch, match: {params: {suggestionId}}} = this.props;

        if (prevProps.approveBulkCreateSuggestion.pending && !this.props.approveBulkCreateSuggestion.pending &&
            Array.isArray(this.props.approveBulkCreateSuggestion.result)) {
            dispatch(fetchBulkCreateSuggestion(suggestionId));
        }
    }

    dispatchSuggestionActions(actions) {
        const {dispatch, match: {params: {suggestionId}}, location: {search}} = this.props;
        const type = QueryString.parse(search).type;

        if (suggestionId && type) {
            try {
                if (!isNaN(parseInt(suggestionId))) {
                    switch (type) {
                        case 'create':
                            dispatch(actions.create(suggestionId));
                            break;
                        case 'update':
                            dispatch(actions.update(suggestionId));
                            break;
                        case 'bulk':
                            dispatch(actions.bulk(suggestionId));
                            break;
                        default:
                            return;
                    }
                }
            } catch (err) {
            }
        }
    }

    fetchSuggestionIfIdAndTypeExist() {
        this.dispatchSuggestionActions({
            create: fetchCreateSuggestion,
            update: fetchUpdateSuggestion,
            bulk: fetchBulkCreateSuggestion
        });
    }

    handleSuggestionApproveButtonClick() {
        this.dispatchSuggestionActions({
            create: approveCreateSuggestion,
            update: approveUpdateSuggestion,
            bulk: approveBulkCreateSuggestion
        });
    }

    handleSuggestionRejectButtonClick() {
        this.dispatchSuggestionActions({
            create: rejectCreateSuggestion,
            update: rejectUpdateSuggestion,
            bulk: rejectBulkCreateSuggestion
        });
    }

    render() {
        const {
            mode, fetchCreateSuggestion, fetchUpdateSuggestion, fetchBulkCreateSuggestion,
            approveCreateSuggestion, rejectCreateSuggestion, approveUpdateSuggestion, rejectUpdateSuggestion,
            location: {search}, rejectBulkCreateSuggestion, approveBulkCreateSuggestion
        } = this.props;
        const type = QueryString.parse(search).type;

        const reducers = [
            approveCreateSuggestion, rejectCreateSuggestion, approveUpdateSuggestion, rejectUpdateSuggestion,
            rejectBulkCreateSuggestion, fetchCreateSuggestion, fetchUpdateSuggestion, fetchBulkCreateSuggestion
        ];

        /**
         * This code determines what Suggestion object to pass down to the ManageSuggestions component
         * The order these ||'s are evaluated in is important. Typically all of these values will be falsey besides one,
         * which is the one we will assign to suggestion.
         * However in the situation where we approve a suggestion, say a Create Suggestion,
         * approveCreateSuggestion.result AND fetchCreateSuggestion.result will both be truthy.
         * Therefore, we check approveCreateSuggestion.result first since it is the updated Suggestion.
         */
        const suggestion = approveCreateSuggestion.result || rejectCreateSuggestion.result ||
            approveUpdateSuggestion.result || rejectUpdateSuggestion.result || rejectBulkCreateSuggestion.result ||
            fetchCreateSuggestion.result || fetchUpdateSuggestion.result || fetchBulkCreateSuggestion.result;

        const pending = reducers.filter(reducer => reducer.pending).length > 0;

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