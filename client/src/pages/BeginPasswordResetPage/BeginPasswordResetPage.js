import * as React from 'react';
import './BeginPasswordResetPage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BeginPasswordReset from '../../components/BeginPasswordReset/BeginPasswordReset';
import { beginPasswordReset } from '../../actions/authentication';
import Spinner from '../../components/Spinner/Spinner';
import { Helmet } from 'react-helmet';
import Footer from '../../components/Footer/Footer';

class BeginPasswordResetPage extends React.Component {

    static mapStateToProps(state) {
        return state.beginPasswordReset;
    }

    onSubmit(email) {
        const { dispatch } = this.props;
        dispatch(beginPasswordReset(email))
    }

    render() {
        const { success, error, pending } = this.props;
        return (
            <div className="page-container">
                <div className="page d-flex justify-content-center mt-5">
                    <Helmet title="Reset Password | Monuments and Memorials"/>
                    {pending && <Spinner show={pending}/>}
                    <BeginPasswordReset onResetPassword={data => this.onSubmit(data)}
                        success={success}
                        error={error}/>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default withRouter(connect(BeginPasswordResetPage.mapStateToProps)(BeginPasswordResetPage));