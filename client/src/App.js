import React from 'react';
import './App.scss';
import './theme.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import Header from './components/Header/Header';
import MonumentPage from './pages/MonumentPage/MonumentPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ErrorHandler from './containers/ErrorHandler/ErrorHandler';
import Toaster from './containers/Toaster/Toaster';
import MapPage from './pages/MapPage/MapPage';
import CreateMonumentPage from './pages/CreateMonumentPage/CreateMonumentPage';
import MonumentBulkCreatePage from './pages/MonumentBulkCreatePage/MonumentBulkCreatePage';
import TagDirectoryPage from './pages/TagDirectoryPage/TagDirectoryPage';
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from './pages/AboutPage/AboutPage';
import UpdateMonumentPage from './pages/UpdateMonumentPage/UpdateMonumentPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import ProtectedRoute from './containers/ProtectedRoute/ProtectedRoute';
import { Roles } from './utils/authentication-util';
import { getUserSession, logout } from './actions/authentication';
import ConfirmSignupPage from './pages/ConfirmSignupPage/ConfirmSignupPage';
import BeginPasswordResetPage from './pages/BeginPasswordResetPage/BeginPasswordResetPage';
import FinishPasswordResetPage from './pages/FinishPasswordResetPage/FinishPasswordResetPage';
import UserPage from './pages/UserPage/UserPage';
import UpdateUserPage from './pages/UpdateUserPage/UpdateUserPage';
import ConfirmEmailChangePage from './pages/ConfirmEmailChangePage/ConfirmEmailChangePage';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headerHeight: 0
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getUserSession());
    }

    async clearUserSession() {
        const { dispatch } = this.props;
        dispatch(logout());
    }

    render() {
        const { headerHeight } = this.state;
        return (
            <div className="App">
                <Helmet title="Monuments and Memorials"/>
                <Toaster/>
                <Router>
                    <Header onRender={headerHeight => this.setState({headerHeight})} onLogout={() => this.clearUserSession()}/>
                    <div style={{height: `calc(100vh - ${headerHeight}px)`}}>
                        <ErrorHandler>
                            <Route exact path="/map" component={MapPage}/>
                            <Route exact path="/" component={HomePage}/>
                            <Route exact path="/login" component={LoginPage}/>
                            <Route exact path="/signup" component={SignupPage}/>
                            <Route path="/monuments/:monumentId/:slug?" component={MonumentPage}/>
                            <Route path="/search" component={SearchPage}/>
                            <ProtectedRoute exact path="/create" component={CreateMonumentPage}/>
                            <ProtectedRoute exact path="/bulk-create" component={MonumentBulkCreatePage} oneOf={[Roles.PARTNER, Roles.RESEARCHER]}/>
                            <Route exact path="/tag-directory" component={TagDirectoryPage}/>
                            <Route exact path="/about" component={AboutPage}/>
                            <ProtectedRoute path="/update-monument/:monumentId" component={UpdateMonumentPage}/>
                            <Route exact path="/signup/confirm" component={ConfirmSignupPage}/>
                            <Route exact path="/password-reset" component={BeginPasswordResetPage}/>
                            <Route exact path="/password-reset/confirm" component={FinishPasswordResetPage}/>
                            <ProtectedRoute exact path="/account" component={UserPage}/>
                            <ProtectedRoute exact path="/account/update" component={UpdateUserPage}/>
                            <Route exact path="/account/update/confirm" component={ConfirmEmailChangePage}/>
                        </ErrorHandler>
                    </div>
                </Router>
            </div>
        );
    }
}

export default connect()(App);
