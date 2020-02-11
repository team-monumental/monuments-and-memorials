import * as React from 'react';
import './LoginPage.scss';
import { connect } from 'react-redux';
import Login from '../../components/Login/Login';
import { login } from '../../actions/authentication';
import Spinner from '../../components/Spinner/Spinner';

class LoginPage extends React.Component {

    static mapStateToProps(state) {
        return state.login;
    }

    render() {
        const { pending, error, result, dispatch } = this.props;
        return (
            <div className="page d-flex justify-content-center mt-5">
                <Spinner show={pending}/>
                <Login onLogin={data => dispatch(login(data))} result={result} error={error && error.message}/>
            </div>
        )
    }
}

export default connect(LoginPage.mapStateToProps)(LoginPage);
