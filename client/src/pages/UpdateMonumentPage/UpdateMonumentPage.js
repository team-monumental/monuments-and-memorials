import React from 'react';
import './UpdateMonumentPage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import fetchMonumentForUpdate, { updateMonument } from '../../actions/update-monument';
import CreateOrUpdateForm from "../../components/CreateOrUpdateForm/CreateOrUpdateForm";
import Spinner from '../../components/Spinner/Spinner';
import ContributionAppreciation from '../../components/ContributionAppreciation/ContributionAppreciation';
import uploadImagesToS3, {deleteImagesFromS3} from "../../utils/api-util";

/**
 * Root container for the page to update an existing Monument
 */
class UpdateMonumentPage extends React.Component {

    static mapStateToProps(state) {
        return state.updateMonumentPage;
    }

    componentDidMount() {
        const { dispatch, match: { params: { monumentId } } } = this.props;
        dispatch(fetchMonumentForUpdate(monumentId));
    }

    handleCreateOrUpdateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    async handleCreateOrUpdateFormSubmit(id, form) {
        const { dispatch } = this.props;

        // First, upload the new images to S3 and save the URLs in the form
        form.newImageUrls = await uploadImagesToS3(form.images);

        // Then, delete the deleted images from S3
        await deleteImagesFromS3(form.deletedImageUrls);

        // Finally, update the Monument
        dispatch(updateMonument(id, form));
    }

    render() {
        const { fetchMonumentForUpdatePending, updateMonumentPending, monument, updatedMonument, error } = this.props;

        if (error === null && updatedMonument.id !== undefined) {
            //this.props.history.push(`/monuments/${updatedMonument.id}`);
        }

        return (
            <div className='update-monument-page-container'>
                <Spinner show={fetchMonumentForUpdatePending || updateMonumentPending}/>
                <div className="column thank-you-column">
                    <ContributionAppreciation/>
                </div>
                <div className='column form-column'>
                    <CreateOrUpdateForm
                        monument={monument}
                        onCancelButtonClick={() => this.handleCreateOrUpdateFormCancelButtonClick()}
                        onSubmit={(id, form) => this.handleCreateOrUpdateFormSubmit(id, form)}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(connect(UpdateMonumentPage.mapStateToProps)(UpdateMonumentPage));