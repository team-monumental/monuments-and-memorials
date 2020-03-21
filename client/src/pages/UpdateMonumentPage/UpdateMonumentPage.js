import React from 'react';
import './UpdateMonumentPage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchMonumentForUpdate, createUpdateSuggestion } from '../../actions/update-monument';
import CreateOrUpdateForm from '../../components/CreateOrUpdateForm/CreateOrUpdateForm';
import Spinner from '../../components/Spinner/Spinner';
import ContributionAppreciation from '../../components/ContributionAppreciation/ContributionAppreciation';
import { uploadImagesToS3, deleteImagesFromS3 } from '../../utils/api-util';
import { Helmet } from 'react-helmet';
import UpdateReviewModal from '../../components/ReviewModal/UpdateReviewModal/UpdateReviewModal';
import NoImageModal from '../../components/NoImageModal/NoImageModal';

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
        return state.updateMonumentPage;
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
            formHasImages = form.images && form.images.length;
        }

        return imagesWereAdded || formHasImages;
    }

    async submitUpdateForm() {
        const { dispatch } = this.props;
        const { form, monument } = this.state;

        // First, upload the new images to the temporary S3 folder and save the URLs in the form
        const newImageObjectUrls = await uploadImagesToS3(form.images, true);
        form.newImageUrlsJson = JSON.stringify(newImageObjectUrls);

        // Then, delete the deleted images from S3
        await deleteImagesFromS3(form.deletedImageUrls);

        // Finally, create the UpdateMonumentSuggestion
        dispatch(createUpdateSuggestion(monument.id, form));
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

        return (
            <UpdateReviewModal
                showing={showingReviewModal}
                onCancel={() => this.handleReviewModalCancel()}
                onConfirm={() => this.submitUpdateForm()}
                oldMonument={monument}
                newMonument={form}
                addedImages={addedImages}
            />
        );
    }

    render() {
        const { fetchMonumentForUpdatePending, createUpdateSuggestionPending, monument, updateSuggestion, error } = this.props;

        if (error === null && updateSuggestion.id !== undefined) {
            // TODO: Fix
            //this.props.history.push(`/monuments/${updateSuggestion.id}`);
        }

        return (
            <div className="update-monument-page-container">
                {monument && <Helmet title={`Update ${monument.title} | Monuments and Memorials`}/>}
                <Spinner show={fetchMonumentForUpdatePending || createUpdateSuggestionPending}/>
                <div className="column thank-you-column">
                    <ContributionAppreciation/>
                </div>
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