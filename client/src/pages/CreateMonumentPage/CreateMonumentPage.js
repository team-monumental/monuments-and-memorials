import React from 'react';
import './CreateMonumentPage.scss';
import { connect } from 'react-redux';
import CreateOrUpdateForm from '../../components/CreateOrUpdateForm/CreateOrUpdateForm';
import ContributionAppreciation from '../../components/ContributionAppreciation/ContributionAppreciation';
import createMonument from '../../actions/create';
import { uploadImagesToS3 } from '../../utils/api-util';
import { Helmet } from 'react-helmet';
import Spinner from '../../components/Spinner/Spinner';
import { withRouter } from 'react-router-dom';
import fetchDuplicates from '../../actions/duplicates';
import DuplicateMonuments from '../../components/Monument/DuplicateMonuments/DuplicateMonuments';
import NoImageModal from '../../components/NoImageModal/NoImageModal';
import CreateReviewModal from '../../components/ReviewModal/CreateReviewModal/CreateReviewModal';

/**
 * Root container for the page to create a new Monument
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
            ...state.createPage,
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

        // First, upload the images to S3 and save the URLs in the form
        form.images = await uploadImagesToS3(form.images);

        // Then, create the Monument
        dispatch(createMonument(form));
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
        const { createMonumentPending, monument, createError, fetchDuplicatesPending } = this.props;

        if (createError === null && monument.id !== undefined) {
            this.props.history.push(`/monuments/${monument.id}`);
        }

        return (
            <div className="create-page-container">
                <Helmet title="Create | Monuments and Memorials"/>
                <Spinner show={createMonumentPending || fetchDuplicatesPending}/>
                <div className="column thank-you-column">
                    <ContributionAppreciation/>
                </div>
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