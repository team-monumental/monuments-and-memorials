import React from 'react';
import './MonumentBulkUpdatePage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BulkUpdateForm from "../../../components/BulkUpdateForm/BulkUpdateForm";
import { bulkValidateSuggestions, bulkCreateSuggestions, bulkUpdateMonuments} from "../../../actions/bulk-update";
import Spinner from '../../../components/Spinner/Spinner';
import ErrorModal from '../../../components/Error/ErrorModal/ErrorModal';
import { Modal, ProgressBar } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { Role } from '../../../utils/authentication-util'

/**
 * Root container for the page to bulk suggest Monument updates
 */
class MonumentBulkUpdatePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingErrorModal: false,
            showValidationResults: false,
            showUpdateResults: false,
            term: Role.RESEARCHER_OR_ABOVE.includes(props.role.toUpperCase()) ? 'Update' : 'Suggest'
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.error && !prevState.showingErrorModal) {
            this.setState({showingErrorModal: true});
        }
        else if (this.props.createSuggestionResult && !this.props.bulkSuggestionCreatePending) {
            this.props.history.push('/panel/suggestion-created?type=bulk');
        }
        else if (this.props.createResult && !this.props.bulkUpdatePending && !prevProps.createResult) {
            this.setState({showUpdateResults: true})
        } else if (prevState.showUpdateResults) {
            this.setState({showUpdateResults: false})
        }
    }

    static mapStateToProps(state) {
        return {
            ...state.session,
            ...state.bulkUpdatePage
        };
    }

    handleValidationSubmit(form) {
        const { dispatch } = this.props;

        // Send the .zip or .csv file and the mapping to the server to be processed
        dispatch(bulkValidateSuggestions(form));
        this.setState({showValidationResults: true});
    }

    handleCreateSubmit(form) {
        const { dispatch, user } = this.props;

        // Make the appropriate API call
        // Researchers and Admins bypass Suggestions and can directly bulk-create new Monuments
        if (user && Role.RESEARCHER_OR_ABOVE.includes(user.role.toUpperCase())) {
            dispatch(bulkUpdateMonuments(form));
        }
        // Any other role has to create a Suggestion
        else {
            dispatch(bulkCreateSuggestions(form));
        }

        this.setState({showValidationResults: false});
    }

    handleErrorModalClose() {
        this.setState({showingErrorModal: false});
    }

    render() {
        let { showingErrorModal, showValidationResults, term, showCreateResults } = this.state;
        const { bulkSuggestionCreatePending, bulkSuggestionValidatePending, bulkCreatePending, validationResult,
            validationError, createSuggestionResult, createSuggestionError, createSuggestionProgress,
            createProgress, createResult, createError } = this.props;

        showCreateResults = showCreateResults && createResult
        showValidationResults = showValidationResults && !bulkSuggestionValidatePending && !showCreateResults;

        return (
            <div className="bulk-update page d-flex justify-content-center">
                <Helmet title={`Bulk ${term} | Monuments and Memorials`}/>
                <Spinner show={bulkSuggestionValidatePending}/>
                <BulkUpdateForm
                    onValidationSubmit={(form) => this.handleValidationSubmit(form)}
                    onCreateSubmit={(form) => this.handleCreateSubmit(form)}
                    onResetForm={() => this.setState({showValidationResults: false, showCreateResults: false})}
                    term={term} pastTenseTerm={this.getTermPastTense()} actionHappeningTerm={this.getTermActionHappening()}
                    {...{validationResult, createSuggestionResult, showValidationResults, showCreateResults, createResult}}
                />
                <Modal show={bulkSuggestionCreatePending || bulkCreatePending}>
                    <Modal.Header className="pb-0">
                        <Modal.Title>
                            Bulk {this.getTermActionHappening()} Monuments or Memorials
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            Please wait while your monuments or memorials are {this.getTermPastTense().toLowerCase()}...
                        </div>
                        <ProgressBar now={(createSuggestionProgress || createProgress) * 100}/>
                    </Modal.Body>
                </Modal>
                <ErrorModal
                    showing={showingErrorModal}
                    errorMessage={(validationError || createSuggestionError || createError || {}).message || ''}
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

export default withRouter(connect(MonumentBulkUpdatePage.mapStateToProps(MonumentBulkUpdatePage)))