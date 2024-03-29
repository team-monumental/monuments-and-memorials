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
import { isEmptyObject } from '../../utils/object-util';
import { Role } from '../../utils/authentication-util';
import Footer from '../../components/Footer/Footer';

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
            addedImages: [],
            addedPhotoSphereImages: []
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (Role.RESEARCHER_OR_ABOVE.includes(this.props.user.role.toUpperCase())) {
            if (this.props.updateError === null && !isEmptyObject(this.props.updatedMonument)) {
                this.props.history.push(`/monuments/${this.props.updatedMonument.id}`);
            }
        }
        else {
            if (this.props.error === null && this.props.updateSuggestion.id !== undefined) {
                this.props.history.push('/suggestion-created?type=update');
            }
        }
    }

    validateImages() {
        const { form, addedImages, addedPhotoSphereImages, monument } = this.state;

        const imagesWereAdded = (addedImages && addedImages.length) || (addedPhotoSphereImages && addedPhotoSphereImages.length);

        let formHasImages = false;
        if (form) {
            formHasImages = (form.images && form.images.length) ||
                (monument.images && monument.images.length > form.deletedImageIds.length);
        }

        return imagesWereAdded || formHasImages;
    }

    async submitUpdateForm() {
        const { dispatch, user } = this.props;
        const { form, monument } = this.state;

        // First, upload the new images to the temporary S3 folder and save the URLs in the form
        const newImageObjectUrls = await uploadImagesToS3(form.images, true);
        form.newImageUrlsJson = JSON.stringify(newImageObjectUrls);

        // Next, store the PhotoSphere Image URLs in the form
        form.newPhotoSphereImageUrlsJson = JSON.stringify(form.photoSphereImages);

        // Then, delete the deleted images from S3
        // TODO:  currently, preprod uses the same S3 as prod.  Once that is fixed, uncomment this line.
        if (form.deletedImageUrls) {
            let resp = await deleteImagesFromS3(form.deletedImageUrls);
        }

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

    async handleUpdateFormSubmit(monument, form, addedImages, addedPhotoSphereImages) {
        await this.setState({monument, form, addedImages, addedPhotoSphereImages});

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
        const { showingReviewModal, monument, form, addedImages, addedPhotoSphereImages } = this.state;

        if (form) {
            form.addedImages = addedImages;
            form.addedPhotoSphereImages = addedPhotoSphereImages;
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
        const { fetchMonumentForUpdatePending, createUpdateSuggestionPending, monument, user } = this.props;

        let action = 'Suggest an update to';
        if (user && Role.RESEARCHER_OR_ABOVE.includes(user.role.toUpperCase())) {
            action = 'Update';
        }

        return (
            <div className="page-container">
                <div className="update-monument-page-container">
                    {monument && <Helmet title={`Update ${monument.title} | Monuments and Memorials`}/>}
                    <Spinner show={fetchMonumentForUpdatePending || createUpdateSuggestionPending}/>
                    <div className="column left"/>
                    <div className="column form-column">
                        <CreateOrUpdateForm
                            monument={monument}
                            onCancelButtonClick={() => this.handleUpdateFormCancelButtonClick()}
                            onSubmit={this.handleUpdateFormSubmit.bind(this)}
                            action={action}
                        />
                    </div>
                    <div className="column"/>

                    {this.renderNoImageModal()}
                    {this.renderReviewModal()}
                </div>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(connect(UpdateMonumentPage.mapStateToProps)(UpdateMonumentPage));