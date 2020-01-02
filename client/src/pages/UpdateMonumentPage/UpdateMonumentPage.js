import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import fetchMonumentForUpdate from '../../actions/update-monument';
import CreateOrUpdateForm from "../../components/CreateOrUpdateForm/CreateOrUpdateForm";
import Spinner from '../../components/Spinner/Spinner';

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

    render() {
        const { fetchMonumentForUpdatePending, monument } = this.props;

        return (
            <div className='update-monument-page-container'>
                <Spinner show={fetchMonumentForUpdatePending}/>
                <CreateOrUpdateForm monument={monument}/>
            </div>
        );
    }
}

export default withRouter(connect(UpdateMonumentPage.mapStateToProps)(UpdateMonumentPage));