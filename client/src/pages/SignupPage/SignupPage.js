import * as React from 'react';
import './SignupPage.scss';
import { connect } from 'react-redux';
import Signup from '../../components/Signup/Signup';
import { signup } from '../../actions/authentication';
import Spinner from '../../components/Spinner/Spinner';

class SignupPage extends React.Component {

    static mapStateToProps(state) {
        console.log('state', state);
        return {
            ...state.signup,
            authentication: state.authentication
        };
    }

    render() {
        const { dispatch, pending, error, result, authentication } = this.props;
        return (
            <div className="page d-flex justify-content-center mt-5">
                <Spinner show={pending}/>
                <Signup onSignup={data => dispatch(signup(data))} error={error && error.message} result={result}/>
            </div>
        )
    }
}

export default connect(SignupPage.mapStateToProps)(SignupPage);
