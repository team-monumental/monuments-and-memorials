import React from 'react';
import './MonumentBulkCreatePage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BulkCreateForm from '../../components/BulkCreateForm/BulkCreateForm';
import { bulkCreateMonuments } from '../../actions/bulk-create';
import Spinner from '../../components/Spinner/Spinner';
import ErrorModal from '../../components/Error/ErrorModal/ErrorModal';

/**
 * Root container for the page to bulk create Monuments
 */
class MonumentBulkCreatePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingErrorModal: false
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

    handleSubmit(form) {
        const { dispatch } = this.props;

        // Send the .zip or .csv file and the mapping to the server to be processed
        dispatch(bulkCreateMonuments(form));
    }

    handleErrorModalClose() {
        this.setState({showingErrorModal: false});
    }

    render() {
        const { showingErrorModal } = this.state;
        const { bulkCreateMonumentsPending, bulkCreateMonumentsZipPending, result, error } = this.props;

        return (
            <div className="page d-flex justify-content-center">
                <Spinner show={bulkCreateMonumentsPending || bulkCreateMonumentsZipPending}/>
                <BulkCreateForm
                    onSubmit={(form) => this.handleSubmit(form)}
                    bulkCreateResult={result}
                />
                <ErrorModal
                    showing={showingErrorModal}
                    errorMessage={error ? error.message : ''}
                    onClose={() => this.handleErrorModalClose()}
                />
            </div>
        );
    }
}

export default withRouter(connect(MonumentBulkCreatePage.mapStateToProps)(MonumentBulkCreatePage));