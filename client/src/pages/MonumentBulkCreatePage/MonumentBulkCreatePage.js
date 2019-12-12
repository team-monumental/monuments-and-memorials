import React from 'react';
import './MonumentBulkCreatePage.scss';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import ContributionAppreciation from "../../components/ContributionAppreciation/ContributionAppreciation";
import BulkCreateForm from "../../components/BulkCreateForm/BulkCreateForm";
import {readCsvFileContents} from "../../utils/file-util";
import bulkCreateMonuments from "../../actions/bulk-create";
import Spinner from "../../components/Spinner/Spinner";

/**
 * Root container for the page to bulk create Monuments
 */
class MonumentBulkCreatePage extends React.Component {

    static mapStateToProps(state) {
        return state.bulkCreatePage;
    }

    handleBulkCreateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    async handleBulkCreateFormSubmit(form) {
        const { dispatch } = this.props;

        // First, read all of the lines of the CSV file into an array
        const csvContents = await readCsvFileContents(form.file);

        // Then, send the array to be processed
        dispatch(bulkCreateMonuments(csvContents));
    }

    render() {
        const { bulkCreateMonumentsPending, result } = this.props;

        return (
            <div className='bulk-create-page-container'>
                <Spinner show={bulkCreateMonumentsPending}/>
                <div className='column thank-you-column'>
                    <ContributionAppreciation/>
                </div>
                <div className='column form-column'>
                    <BulkCreateForm
                        onCancelButtonClick={() => this.handleBulkCreateFormCancelButtonClick()}
                        onSubmit={(form) => this.handleBulkCreateFormSubmit(form)}
                        bulkCreateResult={result}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(connect(MonumentBulkCreatePage.mapStateToProps)(MonumentBulkCreatePage));