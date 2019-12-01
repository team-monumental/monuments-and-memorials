import React from 'react';
import './CreatePage.scss'
import { connect } from 'react-redux';

import CreateForm from '../../components/CreateForm/CreateForm';
import ContributionAppreciation from "../../components/CreateForm/ContributionAppreciation/ContributionAppreciation";
import createMonument from "../../actions/create";
import uploadImagesToS3 from "../../utils/api-util";
import Spinner from "../../components/Spinner/Spinner";
import { withRouter } from "react-router-dom";

/**
 * Root container for the page to create a new Monument
 */
class CreatePage extends React.Component {

    static mapStateToProps(state) {
        return state.createPage;
    }

    handleCreateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    async handleCreateFormSubmit(form) {
        const { dispatch } = this.props;

        // First, upload the images to S3 and save the URLs in the form
        form.images = await uploadImagesToS3(form.images);

        // Then, create the Monument
        dispatch(createMonument(form));
    }

    render() {
        const { createMonumentPending, monument, error } = this.props;

        if (error === null && monument.id !== undefined) {
            this.props.history.push(`/monuments/${monument.id}`);
        }

        return (
            <div className="create-page-container">
                <Spinner show={createMonumentPending}/>
                <div className="column thank-you-column">
                    <ContributionAppreciation/>
                </div>
                <div className="column form-column">
                    <CreateForm
                        onCancelButtonClick={() => this.handleCreateFormCancelButtonClick()}
                        onSubmit={(form) => this.handleCreateFormSubmit(form)}
                    />
                </div>
            </div>
        );
    }

}

export default withRouter(connect(CreatePage.mapStateToProps)(CreatePage));