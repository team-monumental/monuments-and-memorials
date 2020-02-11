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
        const { authentication, oneOf, allOf, any, component: Component } = this.props;

        let canView = true;

        if ((!authentication || !authentication.roles) && (oneOf || allOf || any)) {
            canView = false;
        } else {
            if (oneOf) {
                canView = false;
                for (let role of oneOf) {
                    if (authentication.roles.includes(role)) {
                        canView = true;
                        break;
                    }
                }
            }
            if (allOf) {
                for (let role of allOf) {
                    if (!authentication.roles.includes(role)) {
                        canView = false;
                        break;
                    }
                }
            }
        }

        return (
            <Route {...this.props} component={null} render={(props) => (
                canView ? (<Component {...props} />) :
                (<Redirect to='/login'/>)
            )}/>
        );
    }
}

export default connect(ProtectedRoute.mapStateToProps)(ProtectedRoute);
