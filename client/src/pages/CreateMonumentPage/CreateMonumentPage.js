import React from 'react';
import './CreateMonumentPage.scss';
import { connect } from 'react-redux';
import CreateOrUpdateForm from '../../components/CreateOrUpdateForm/CreateOrUpdateForm';
import { createCreateSuggestion, createMonument } from '../../actions/create';
import { uploadImagesToS3 } from '../../utils/api-util';
import { Helmet } from 'react-helmet';
import Spinner from '../../components/Spinner/Spinner';
import { withRouter } from 'react-router-dom';
import fetchDuplicates from '../../actions/duplicates';
import DuplicateMonuments from '../../components/Monument/DuplicateMonuments/DuplicateMonuments';
import NoImageModal from '../../components/NoImageModal/NoImageModal';
import CreateReviewModal from '../../components/ReviewModal/CreateReviewModal/CreateReviewModal';
import { Role } from '../../utils/authentication-util';

/**
 * Root container for the page to create a new CreateMonumentSuggestion
 */
class CreateMonumentPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingNoImageModal: false,
            showingReviewModal: false,
            showingDuplicateMonuments: false,
            form: undefined
        };
    }

    static mapStateToProps(state) {
        return {
            ...state.session,
            ...state.createCreateSuggestion,
            ...state.createMonument,
            ...state.duplicateMonuments
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.duplicates && this.props.duplicates) {
            if (this.props.duplicates.length) {
                this.setState({showingDuplicateMonuments: true});
            }
            else {
                if (!this.validateImages()) {
                    this.setState({showingNoImageModal: true});
                }
                else {
                    this.setState({showingReviewModal: true});
                }
            }
        }
    }

    validateImages() {
        const { form } = this.state;

        if (!form) {
            return false;
        }

        return !(!form.images || !form.images.length);
    }

    async submitCreateForm() {
        const { dispatch } = this.props;
        const { form } = this.state;

        // First, upload the images to the temporary S3 folder and save the URLs in the form
        const imageObjectUrls = await uploadImagesToS3(form.images, true);
        form.imagesJson = JSON.stringify(imageObjectUrls);

        // Then, create the CreateMonumentSuggestion
        dispatch(createCreateSuggestion(form));
    }

    handleCreateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    handleCreateFormSubmit(form) {
        const { dispatch } = this.props;
        this.setState({form: form});
        dispatch(fetchDuplicates(form.title, form.latitude, form.longitude, form.address));
    }

    handleDuplicateMonumentsCancelButtonClick() {
        this.setState({showingDuplicateMonuments: false});
    }

    handleDuplicateMonumentsContinueButtonClick() {
        this.setState({showingDuplicateMonuments: false});

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

    handleNoImageModalContinue() {
        this.setState({showingNoImageModal: false, showingReviewModal: true});
    }

    handleReviewModalCancel() {
        this.setState({showingReviewModal: false});
    }

    renderDuplicateMonuments() {
        const { duplicates } = this.props;
        const { showingDuplicateMonuments } = this.state;

        return (
            <DuplicateMonuments duplicates={duplicates}
                                onCancel={() => this.handleDuplicateMonumentsCancelButtonClick()}
                                onConfirm={() => this.handleDuplicateMonumentsContinueButtonClick()}
                                showing={showingDuplicateMonuments}
            />
        );
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
        );
    }

    renderReviewModal() {
        const { showingReviewModal, form } = this.state;

        return (
            <CreateReviewModal
                showing={showingReviewModal}
                onCancel={() => this.handleReviewModalCancel()}
                onConfirm={() => this.submitCreateForm()}
                form={form}
            />
        );
    }

    render() {
        const { createCreateSuggestionPending, createSuggestion, createError, fetchDuplicatesPending,
            pending, user, createMonumentPending, monument, createMonumentError } = this.props;

        if (Role.RESEARCHER_OR_ABOVE.includes(user.role.toUpperCase())) {
            if (createMonumentError === null && monument.id !== undefined) {
                this.props.history.push(`/monuments/${monument.id}`);
            }
        }
        else {
            if (createError === null && createSuggestion.id !== undefined) {
                this.props.history.push('/suggestion-created');
            }
        }

        return (
            <div className="create-page-container">
                <Helmet title="Create | Monuments and Memorials"/>
                <Spinner show={createCreateSuggestionPending || fetchDuplicatesPending || pending || createMonumentPending}/>
                <div className="column left"/>
                <div className="column form-column">
                    <CreateOrUpdateForm
                        onCancelButtonClick={() => this.handleCreateFormCancelButtonClick()}
                        onSubmit={(form) => this.handleCreateFormSubmit(form)}
                    />
                </div>

                {this.renderDuplicateMonuments()}
                {this.renderNoImageModal()}
                {this.renderReviewModal()}
            </div>
        );
    }

}

export default withRouter(connect(CreateMonumentPage.mapStateToProps)(CreateMonumentPage));