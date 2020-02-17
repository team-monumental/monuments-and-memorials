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

/**
 * Root container for the page to create a new Monument
 */
class CreateMonumentPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingNoImageModal: false,
            showingCreateReviewModal: false,
            showingDuplicateMonuments: false
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
                this.setState({showingNoImageModal: true});
            }
        }
    }

    handleCreateOrUpdateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    handleCreateOrUpdateFormSubmit(form) {
        const { dispatch } = this.props;
        dispatch(fetchDuplicates(form.title, form.latitude, form.longitude, form.address));

        // First, upload the images to S3 and save the URLs in the form
        //form.images = await uploadImagesToS3(form.images);

        // Then, create the Monument
        //dispatch(createMonument(form));
    }

    handleDuplicateMonumentsCancelButtonClick() {
        this.setState({showingDuplicateMonuments: false});
    }

    handleDuplicateMonumentsContinueButtonClick() {
        this.setState({showingDuplicateMonuments: false});
    }

    renderDuplicateMonuments() {
        const { duplicates } = this.props;
        const { showingDuplicateMonuments } = this.state;

        if (showingDuplicateMonuments) {
            return (
                <DuplicateMonuments duplicates={duplicates}
                                    onCancel={() => this.handleDuplicateMonumentsCancelButtonClick()}
                                    onConfirm={() => this.handleDuplicateMonumentsContinueButtonClick()}
                                    showing={showingDuplicateMonuments}/>
            );
        }
        else {
            return <div/>;
        }
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
                        onCancelButtonClick={() => this.handleCreateOrUpdateFormCancelButtonClick()}
                        onSubmit={(form) => this.handleCreateOrUpdateFormSubmit(form)}
                    />
                </div>

                {this.renderDuplicateMonuments()}
            </div>
        );
    }

}

export default withRouter(connect(CreateMonumentPage.mapStateToProps)(CreateMonumentPage));