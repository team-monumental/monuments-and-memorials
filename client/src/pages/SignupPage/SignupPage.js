import * as React from 'react';
import './SignupPage.scss';
import { connect } from 'react-redux';
import Signup from '../../components/Signup/Signup';
import { signup } from '../../actions/authentication';
import Spinner from '../../components/Spinner/Spinner';
import { Redirect, withRouter } from 'react-router-dom';

class SignupPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }

    static mapStateToProps(state) {
        return state.signup;
    }

    signup(data) {
        const { dispatch } = this.props;
        dispatch(signup(data, () => this.setState({redirect: true})));
    }

    render() {
        const { redirect } = this.state;
        const { pending, error, result } = this.props;
        if (redirect) {
            return (<Redirect to="/"/>);
        }
        return (
            <div className="page d-flex justify-content-center mt-5">
                <Spinner show={pending}/>
                <Signup onSignup={data => this.signup(data)} error={error && error.message} result={result}/>
            </div>
        )
    }
}

export default withRouter(connect(SignupPage.mapStateToProps)(SignupPage));
