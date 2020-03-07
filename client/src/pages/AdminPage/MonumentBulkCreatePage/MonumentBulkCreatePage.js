import React from 'react';
import './MonumentBulkCreatePage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BulkCreateForm from '../../../components/BulkCreateForm/BulkCreateForm';
import { bulkValidateMonuments, bulkCreateMonuments } from '../../../actions/bulk';
import Spinner from '../../../components/Spinner/Spinner';
import ErrorModal from '../../../components/Error/ErrorModal/ErrorModal';
import { Modal, ProgressBar } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

/**
 * Root container for the page to bulk create Monuments
 */
class MonumentBulkCreatePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingErrorModal: false,
            showValidationResults: false,
            showCreateResults: false
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
        dispatch(bulkValidateMonuments(form));
        this.setState({showValidationResults: true});
    }

    handleCreateSubmit(form) {
        const { dispatch } = this.props;

        // Send the .zip or .csv file and the mapping to the server to be processed
        dispatch(bulkCreateMonuments(form));
        this.setState({showValidationResults: false, showCreateResults: true});
    }

    handleErrorModalClose() {
        this.setState({showingErrorModal: false});
    }

    render() {
        let { showingErrorModal, showValidationResults } = this.state;
        const {
            bulkCreateMonumentsPending, bulkValidateMonumentsPending, validationResult, validationError,
            createResult, createError, createProgress
        } = this.props;

        const showCreateResults = createResult && !bulkCreateMonumentsPending;
        showValidationResults = !showCreateResults && showValidationResults && !bulkValidateMonumentsPending;

        return (
            <div className="bulk page d-flex justify-content-center">
                <Helmet title="Bulk Create | Monuments and Memorials"/>
                <Spinner show={bulkValidateMonumentsPending}/>
                <BulkCreateForm
                    onValidationSubmit={(form) => this.handleValidationSubmit(form)}
                    onCreateSubmit={(form) => this.handleCreateSubmit(form)}
                    onResetForm={() => this.setState({showValidationResults: false, showCreateResults: false})}
                    {...{validationResult, createResult, showValidationResults, showCreateResults}}
                />
                <Modal show={bulkCreateMonumentsPending}>
                    <Modal.Header className="pb-0">
                        <Modal.Title>
                            Bulk Creating Monuments or Memorials
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            Please wait while your monuments or memorials are created...
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
}

export default withRouter(connect(MonumentBulkCreatePage.mapStateToProps)(MonumentBulkCreatePage));