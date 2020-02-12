import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as QueryString from 'query-string';

/**
 * Wraps React Router's Route component with some permissions checking, allowing routes
 * to be limited to certain user groups. If `oneOf` is not specified, then it simply
 * checks that the user is logged into an account of any type
 */
class ProtectedRoute extends React.Component {

    static mapStateToProps(state) {
        return {session: state.session};
    }

    render() {
        const { session, oneOf, component: Component, path, history } = this.props;

        // Wait until we've finished getting the user session before making any redirects
        if (session.pending) {
            return (<></>);
        }

        const noAccessRedirect = (<Redirect to={{
            pathname: '/',
            state: {alert: 'You do not have sufficient privileges to view that page.'}
        }}/>);

        let loggedIn = session.user && session.user.role;
        let render = (props) => (<Component {...props} />);

        // If you log out while on a restricted page, this will instantly redirect back to the homepage
        if (!loggedIn && path === history.location.pathname) {
            return noAccessRedirect;
        }

        // In all other cases, we pass our action to the render function of the route rather than instantly redirect,
        // because they need to run when the route is actually navigated to
        if (!loggedIn && oneOf) {
            render = () => (<Redirect to={`/login?warn=true&redirect=${encodeURIComponent(path)}`}/>)
        }
        // TODO: This doesn't support role hierarchy, and probably should
        else if (oneOf && !oneOf.includes(session.user.role)) {
            // TODO: Add alert banner to homepage when this is rebased with homepage PR
            render = () => noAccessRedirect;
        }

        return (
            <Route {...this.props} component={null} render={(props) => render(props)}/>
        );
    }
}

export default withRouter(connect(ProtectedRoute.mapStateToProps)(ProtectedRoute));
