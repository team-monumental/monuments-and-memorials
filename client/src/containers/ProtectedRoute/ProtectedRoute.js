import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginPage from '../../pages/LoginPage/LoginPage';

/**
 * Wraps React Router's Route component with some permissions checking, allowing routes
 * to be limited to certain user groups
 */
class ProtectedRoute extends React.Component {

    static mapStateToProps(state) {
        return {authentication: state.authentication};
    }

    render() {
        const { authentication, oneOf, any, component: Component } = this.props;

        let canView = false;
        let loggedIn = authentication && authentication.role;

        if (!loggedIn && (oneOf || any)) canView = false;
        else if (oneOf) canView = oneOf.includes(authentication.role);
        else if (any) canView = true;

        return (
            <Route {...this.props} component={null} render={(props) => (
                canView ? (<Component {...props} />) :
                (<Redirect to='/login'/>)
            )}/>
        );
    }
}

export default connect(ProtectedRoute.mapStateToProps)(ProtectedRoute);
