import * as React from 'react';
import './LoginPage.scss';
import {connect} from 'react-redux';
import Login from '../../components/Login/Login';
import {login} from '../../actions/authentication';
import * as QueryString from 'query-string';
import {Redirect, withRouter} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import Footer from '../../components/Footer/Footer';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: null
        };
    }

    static mapStateToProps(state) {
        return state.login;
    }

    onLogin(data) {
        const {dispatch, history} = this.props;
        const redirect = QueryString.parse(this.props.location.search).redirect;
        dispatch(login(data, () => {
            if (redirect) {
                this.setState({redirect});
            } else {
                history.goBack();
            }
        }))
    }

    render() {
        const {error, result} = this.props;
        const {redirect} = this.state;
        const warn = QueryString.parse(this.props.location.search).warn === 'true';
        if (redirect) {
            return (<Redirect to={redirect}/>);
        }
        return (
            <div className="page-container">
                <div className="page d-flex justify-content-center mt-5">
                    <Helmet title="Login | Monuments and Memorials"/>
                    <Login onLogin={data => this.onLogin(data)}
                           result={result}
                           error={error && error.message}
                           warn={warn}/>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default withRouter(connect(LoginPage.mapStateToProps)(LoginPage));
