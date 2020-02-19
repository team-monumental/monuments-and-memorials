import * as React from 'react';
import './BeginPasswordResetPage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BeginPasswordReset from '../../components/BeginPasswordReset/BeginPasswordReset';
import { beginPasswordReset } from '../../actions/authentication';
import Spinner from '../../components/Spinner/Spinner';

class BeginPasswordResetPage extends React.Component {

    static mapStateToProps(state) {
        console.log(state);
        return state.beginPasswordReset;
    }

    onSubmit(email) {
        const { dispatch } = this.props;
        dispatch(beginPasswordReset(email))
    }

    render() {
        const { success, error, pending } = this.props;
        return (
            <div className="page d-flex justify-content-center mt-5">
                {pending && <Spinner show={pending}/>}
                <BeginPasswordReset onResetPassword={data => this.onSubmit(data)}
                    success={success}
                    error={error && error.message}/>
            </div>
        )
    }
}

export default withRouter(connect(BeginPasswordResetPage.mapStateToProps)(BeginPasswordResetPage));