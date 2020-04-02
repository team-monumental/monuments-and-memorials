import React from 'react';
import './MonumentBulkCreatePage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BulkCreateForm from '../../../components/BulkCreateForm/BulkCreateForm';
import { bulkValidateSuggestions, bulkCreateSuggestions } from '../../../actions/bulk';
import Spinner from '../../../components/Spinner/Spinner';
import ErrorModal from '../../../components/Error/ErrorModal/ErrorModal';
import { Modal, ProgressBar } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { Role } from '../../../utils/authentication-util'

/**
 * Root container for the page to bulk suggest Monument creations
 */
class MonumentBulkCreatePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingErrorModal: false,
            showValidationResults: false,
            showCreateResults: false,
            term: Role.RESEARCHER_OR_ABOVE.includes(props.role.toUpperCase()) ? 'Create' : 'Suggest'
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.error && !prevState.showingErrorModal) {
            this.setState({showingErrorModal: true});
        }
    }

    static mapStateToProps(state) {
        return state.bulkCreatePage;
    }

    handleValidationSubmit(form) {
        const { dispatch } = this.props;

        // Send the .zip or .csv file and the mapping to the server to be processed
        dispatch(bulkValidateSuggestions(form));
        this.setState({showValidationResults: true});
    }

    handleCreateSubmit(form) {
        const { dispatch } = this.props;

        // Send the .zip or .csv file and the mapping to the server to be processed
        dispatch(bulkCreateSuggestions(form));
        this.setState({showValidationResults: false, showCreateResults: true});
    }

    handleErrorModalClose() {
        this.setState({showingErrorModal: false});
    }

    render() {
        let { showingErrorModal, showValidationResults, term } = this.state;
        const {
            bulkSuggestionCreatePending, bulkSuggestionValidatePending, validationResult, validationError,
            createResult, createError, createProgress
        } = this.props;

        console.log(createProgress);

        const showCreateResults = createResult && !bulkSuggestionCreatePending;

        if (showCreateResults) {
            this.props.history.push('/panel/suggestion-created');
        }

        showValidationResults = !showCreateResults && showValidationResults && !bulkSuggestionValidatePending;

        return (
            <div className="bulk page d-flex justify-content-center">
                <Helmet title={`Bulk ${term} | Monuments and Memorials`}/>
                <Spinner show={bulkSuggestionValidatePending}/>
                <BulkCreateForm
                    onValidationSubmit={(form) => this.handleValidationSubmit(form)}
                    onCreateSubmit={(form) => this.handleCreateSubmit(form)}
                    onResetForm={() => this.setState({showValidationResults: false, showCreateResults: false})}
                    term={term} pastTenseTerm={this.getTermPastTense()} actionHappeningTerm={this.getTermActionHappening()}
                    {...{validationResult, createResult, showValidationResults}}
                />
                <Modal show={bulkSuggestionCreatePending}>
                    <Modal.Header className="pb-0">
                        <Modal.Title>
                            Bulk {this.getTermActionHappening()} Monuments or Memorials
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            Please wait while your monuments or memorials are {this.getTermPastTense().toLowerCase()}...
                        </div>
                        <ProgressBar now={createProgress * 100}/>
                    </Modal.Body>
                </Modal>
                <ErrorModal
                    showing={showingErrorModal}
                    errorMessage={(validationError || createError || {}).message || ''}
                    onClose={() => this.handleErrorModalClose()}
                />
            </div>
        );
    }

    getTermPastTense() {
        const { term } = this.state;
        return term === 'Suggest' ? term + 'ed' : term + 'd';
    }

    getTermActionHappening() {
        const { term } = this.state;
        return term === 'Suggest' ? term + 'ing' : 'Creating';
    }
}

export default withRouter(connect(MonumentBulkCreatePage.mapStateToProps)(MonumentBulkCreatePage));