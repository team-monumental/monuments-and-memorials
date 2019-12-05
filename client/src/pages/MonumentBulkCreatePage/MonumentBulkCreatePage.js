import React from 'react';
import './MonumentBulkCreatePage.scss';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import ContributionAppreciation from "../../components/ContributionAppreciation/ContributionAppreciation";
import BulkCreateForm from "../../components/BulkCreateForm/BulkCreateForm";

/**
 * Root container for the page to bulk create Monuments
 */
class MonumentBulkCreatePage extends React.Component {

    static mapStateToProps(state) {

    }

    handleBulkCreateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    render() {
        return (
            <div className='bulk-create-page-container'>
                <div className='column thank-you-column'>
                    <ContributionAppreciation/>
                </div>
                <div className='column form-column'>
                    <BulkCreateForm
                        onCancelButtonClick={() => this.handleBulkCreateFormCancelButtonClick()}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(connect(MonumentBulkCreatePage.mapStateToProps)(MonumentBulkCreatePage));