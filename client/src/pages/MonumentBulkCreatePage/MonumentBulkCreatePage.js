import React from 'react';
import './MonumentBulkCreatePage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ContributionAppreciation from '../../components/ContributionAppreciation/ContributionAppreciation';
import BulkCreateForm from '../../components/BulkCreateForm/BulkCreateForm';
import { readCsvFileContents } from '../../utils/file-util';
import bulkCreateMonuments, { bulkCreateMonumentsZip } from '../../actions/bulk-create';
import Spinner from '../../components/Spinner/Spinner';
import ErrorModal from "../../components/ErrorModal/ErrorModal";

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

    handleBulkCreateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    async handleBulkCreateCsvFormSubmit(form) {
        const { dispatch } = this.props;

        // First, read all of the lines of the CSV file into an array
        const csvContents = await readCsvFileContents(form.file);

        // Then, send the array to be processed
        dispatch(bulkCreateMonuments(csvContents));
    }

    handleBulkCreateZipFormSubmit(form) {
        const { dispatch } = this.props;

        // Send the .zip file to the server to be processed
        dispatch(bulkCreateMonumentsZip(form.file));
    }

    handleErrorModalClose() {
        this.setState({showingErrorModal: false});
    }

    render() {
        const { showingErrorModal } = this.state;
        const { bulkCreateMonumentsPending, bulkCreateMonumentsZipPending, result, error } = this.props;

        return (
            <div className='bulk-create-page-container'>
                <Spinner show={bulkCreateMonumentsPending || bulkCreateMonumentsZipPending}/>
                <div className='column thank-you-column'>
                    <ContributionAppreciation/>
                </div>
                <div className='column form-column'>
                    <BulkCreateForm
                        onCancelButtonClick={() => this.handleBulkCreateFormCancelButtonClick()}
                        onCsvSubmit={(form) => this.handleBulkCreateCsvFormSubmit(form)}
                        onZipSubmit={(form) => this.handleBulkCreateZipFormSubmit(form)}
                        bulkCreateResult={result}
                    />
                </div>
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