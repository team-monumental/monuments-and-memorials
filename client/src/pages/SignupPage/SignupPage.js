import * as React from 'react';
import './SignupPage.scss';
import { connect } from 'react-redux';
import Signup from '../../components/Signup/Signup';
import { signup } from '../../actions/authentication';
import Spinner from '../../components/Spinner/Spinner';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';

class SignupPage extends React.Component {

    static mapStateToProps(state) {
        return state.signup;
    }

    signup(data) {
        const { dispatch } = this.props;
        dispatch(signup(data));
    }

    render() {
        const { pending, error, result } = this.props;
        return (
            <div className="page d-flex justify-content-center mt-5">
                <Helmet title="Signup | Monuments and Memorials"/>
                <Spinner show={pending}/>
                <Signup onSignup={data => this.signup(data)} error={error && error.message} result={result}/>
            </div>
        )
    }
}

export default withRouter(connect(SignupPage.mapStateToProps)(SignupPage));
