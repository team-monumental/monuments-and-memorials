import * as React from 'react';
import './FinishPasswordResetPage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FinishPasswordReset from '../../components/FinishPasswordReset/FinishPasswordReset';
import { finishPasswordReset } from '../../actions/authentication';
import Spinner from '../../components/Spinner/Spinner';
import { Helmet } from 'react-helmet';
import Footer from '../../components/Footer/Footer';

class FinishPasswordResetPage extends React.Component {

    static mapStateToProps(state) {
        return state.finishPasswordReset;
    }

    onSubmit(data) {
        const { dispatch } = this.props;
        dispatch(finishPasswordReset(data))
    }

    render() {
        const { success, error, pending } = this.props;
        return (
            <div className="page-container">
                <div className="page d-flex justify-content-center mt-5">
                    <Helmet title="Reset Password | Monuments and Memorials"/>
                    {pending && <Spinner show={pending}/>}
                    <FinishPasswordReset onResetPassword={data => this.onSubmit(data)}
                       success={success}
                       error={error}/>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default withRouter(connect(FinishPasswordResetPage.mapStateToProps)(FinishPasswordResetPage));