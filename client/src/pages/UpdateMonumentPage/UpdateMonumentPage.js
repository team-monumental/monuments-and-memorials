import React from 'react';
import './UpdateMonumentPage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import fetchMonumentForUpdate from '../../actions/update-monument';
import CreateOrUpdateForm from "../../components/CreateOrUpdateForm/CreateOrUpdateForm";
import Spinner from '../../components/Spinner/Spinner';
import ContributionAppreciation from '../../components/ContributionAppreciation/ContributionAppreciation';

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

    render() {
        const { fetchMonumentForUpdatePending, monument } = this.props;

        return (
            <div className='update-monument-page-container'>
                <Spinner show={fetchMonumentForUpdatePending}/>
                <div className="column thank-you-column">
                    <ContributionAppreciation/>
                </div>
                <div className='column form-column'>
                    <CreateOrUpdateForm
                        monument={monument}
                        onCancelButtonClick={() => this.handleCreateOrUpdateFormCancelButtonClick()}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(connect(UpdateMonumentPage.mapStateToProps)(UpdateMonumentPage));