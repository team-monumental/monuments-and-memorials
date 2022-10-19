import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import { addToast } from '../../../actions/toasts';

import BulkEditPanel from "../../../components/AdminPanel/BulkEdit/BulkEditPanel";

class BulkEditPage extends React.Component {

    showSuccessToast = () => {
        const { dispatch } = this.props;
        dispatch(addToast({
            title: 'Success!',
            message: `The monument was successfully saved`,
            variant: 'success'
        }));
    }

    showErrorToast = () => {
        const { dispatch } = this.props;
        dispatch(addToast({
            title: 'Error!',
            message: `An error occured when attempting to save the monument`,
            variant: 'error'
        }));
    }

    render() {
        return (
            <>
                <Helmet title={`Bulk Edit | Monuments and Memorials`}/>
                <BulkEditPanel showSuccessToast={this.showSuccessToast} showErrorToast={this.showErrorToast}/>
            </>
        );
    }
}

export default withRouter(connect(BulkEditPage.mapStateToProps)(BulkEditPage));