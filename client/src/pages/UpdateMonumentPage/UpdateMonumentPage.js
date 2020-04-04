import React from 'react';
import './UpdateMonumentPage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchMonumentForUpdate, createUpdateSuggestion, updateMonument } from '../../actions/update-monument';
import CreateOrUpdateForm from '../../components/CreateOrUpdateForm/CreateOrUpdateForm';
import Spinner from '../../components/Spinner/Spinner';
import { uploadImagesToS3, deleteImagesFromS3 } from '../../utils/api-util';
import { Helmet } from 'react-helmet';
import UpdateReviewModal from '../../components/ReviewModal/UpdateReviewModal/UpdateReviewModal';
import NoImageModal from '../../components/NoImageModal/NoImageModal';
import {isEmptyObject} from "../../utils/object-util";

/**
 * Root container for the page to suggest an update to an existing Monument
 */
class UpdateMonumentPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingReviewModal: false,
            showingNoImageModal: false,
            monument: undefined,
            form: undefined,
            addedImages: []
        };
    }

    static mapStateToProps(state) {
        return {
            ...state.session,
            ...state.updateMonumentPage,
            ...state.updateMonument
        };
    }

    componentDidMount() {
        const { dispatch, match: { params: { monumentId } } } = this.props;
        dispatch(fetchMonumentForUpdate(monumentId));
    }

    validateImages() {
        const { form, addedImages } = this.state;

        const imagesWereAdded = addedImages && addedImages.length;

        let formHasImages = false;
        if (form) {
            formHasImages = (form.images && form.images.length) || (form.imagesForUpdate && form.imagesForUpdate.length);
        }

        return imagesWereAdded || formHasImages;
    }

    async submitUpdateForm() {
        const { dispatch, user } = this.props;
        const { form, monument } = this.state;

        // First, upload the new images to the temporary S3 folder and save the URLs in the form
        const newImageObjectUrls = await uploadImagesToS3(form.images, true);
        form.newImageUrlsJson = JSON.stringify(newImageObjectUrls);

        // Then, delete the deleted images from S3
        await deleteImagesFromS3(form.deletedImageUrls);

        // Finally, make the appropriate API call
        // Researchers and Admins bypass Suggestions and can directly update Monuments
        if (Role.RESEARCHER_OR_ABOVE.includes(user.role.toUpperCase())) {
            dispatch(updateMonument(monument.id, form));
        }
        // Any other role has to create a Suggestion
        else {
            dispatch(createUpdateSuggestion(monument.id, form));
        }
    }

    handleUpdateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    async handleUpdateFormSubmit(monument, form, addedImages) {
        await this.setState({monument: monument, form: form, addedImages: addedImages});

        if (!this.validateImages()) {
            this.setState({showingNoImageModal: true});
        }
        else {
            this.setState({showingReviewModal: true});
        }
    }

    handleNoImageModalClose() {
        this.setState({showingNoImageModal: false});
    }

    handleReviewModalCancel() {
        this.setState({showingReviewModal: false});
    }

    handleNoImageModalContinue() {
        this.setState({showingNoImageModal: false, showingReviewModal: true});
    }

    renderNoImageModal() {
        const { showingNoImageModal } = this.state;

        return (
            <NoImageModal
                showing={showingNoImageModal}
                onClose={() => this.handleNoImageModalClose()}
                onCancel={() => this.handleNoImageModalClose()}
                onContinue={() => this.handleNoImageModalContinue()}
            />
        )
    }

    renderReviewModal() {
        const { showingReviewModal, monument, form, addedImages } = this.state;

        if (form) {
            form.addedImages = addedImages;
        }

        return (
            <UpdateReviewModal
                showing={showingReviewModal}
                onCancel={() => this.handleReviewModalCancel()}
                onConfirm={() => this.submitUpdateForm()}
                oldMonument={monument}
                newMonument={form}
            />
        );
    }

    render() {
        const { fetchMonumentForUpdatePending, createUpdateSuggestionPending, monument, updateSuggestion, error,
            user, updateError, updatedMonument } = this.props;

        if (Role.RESEARCHER_OR_ABOVE.includes(user.role.toUpperCase())) {
            if (updateError === null && !isEmptyObject(updatedMonument)) {
                this.props.history.push(`/monuments/${updatedMonument.id}`);
            }
        }
        else {
            if (error === null && updateSuggestion.id !== undefined) {
                this.props.history.push('/suggestion-created');
            }
        }

        return (
            <div className="update-monument-page-container">
                {monument && <Helmet title={`Update ${monument.title} | Monuments and Memorials`}/>}
                <Spinner show={fetchMonumentForUpdatePending || createUpdateSuggestionPending}/>
                <div className="column left"/>
                <div className="column form-column">
                    <CreateOrUpdateForm
                        monument={monument}
                        onCancelButtonClick={() => this.handleUpdateFormCancelButtonClick()}
                        onSubmit={(id, form, addedImages) => this.handleUpdateFormSubmit(id, form, addedImages)}
                    />
                </div>

                {this.renderNoImageModal()}
                {this.renderReviewModal()}
            </div>
        );
    }
}

export default withRouter(connect(UpdateMonumentPage.mapStateToProps)(UpdateMonumentPage));