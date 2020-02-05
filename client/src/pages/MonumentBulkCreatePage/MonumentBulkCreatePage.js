import React from 'react';
import './MonumentBulkCreatePage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BulkCreateForm from '../../components/BulkCreateForm/BulkCreateForm';
import { bulkValidateMonuments, bulkCreateMonuments } from '../../actions/bulk';
import Spinner from '../../components/Spinner/Spinner';
import ErrorModal from '../../components/Error/ErrorModal/ErrorModal';

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
        const { showingErrorModal, showValidationResults } = this.state;
        const {
            bulkCreateMonumentsPending, bulkValidateMonumentsPending, validationResult, validationError,
            createResult, createError
        } = this.props;

        return (
            <div className="page d-flex justify-content-center">
                <Spinner show={bulkCreateMonumentsPending || bulkValidateMonumentsPending}/>
                <BulkCreateForm
                    onValidationSubmit={(form) => this.handleValidationSubmit(form)}
                    onCreateSubmit={(form) => this.handleCreateSubmit(form)}
                    onResetForm={() => this.setState({showValidationResults: false, showCreateResults: false})}
                    validationResult={validationResult}
                    createResult={createResult}
                    showValidationResults={showValidationResults && !bulkValidateMonumentsPending}
                />
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