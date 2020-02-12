import React from 'react';
import './CreateMonumentPage.scss';
import { connect } from 'react-redux';

import CreateOrUpdateForm from '../../components/CreateOrUpdateForm/CreateOrUpdateForm';
import ContributionAppreciation from "../../components/ContributionAppreciation/ContributionAppreciation";
import createMonument from "../../actions/create";
import { uploadImagesToS3 } from '../../utils/api-util';
import Spinner from "../../components/Spinner/Spinner";
import { withRouter } from "react-router-dom";

/**
 * Root container for the page to create a new Monument
 */
class CreateMonumentPage extends React.Component {

    static mapStateToProps(state) {
        return state.createPage;
    }

    handleCreateOrUpdateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    async handleCreateOrUpdateFormSubmit(form) {
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
                    <CreateOrUpdateForm
                        onCancelButtonClick={() => this.handleCreateOrUpdateFormCancelButtonClick()}
                        onSubmit={(form) => this.handleCreateOrUpdateFormSubmit(form)}
                    />
                </div>
            </div>
        );
    }

}

export default withRouter(connect(CreateMonumentPage.mapStateToProps)(CreateMonumentPage));