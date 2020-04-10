import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

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
        const { session, oneOf, component: Component, path, history, exact, customProps, verifyEmail } = this.props;

        // Wait until we've finished getting the user session before making any redirects
        if (session.pending) {
            return (<></>);
        }

        const noAccessRedirect = message => (<Redirect to={{
            pathname: '/',
            state: history.location.state && history.location.state.suppressAuthenticationBanner ? {} : {
                alert: message
            }
        }}/>);

        let loggedIn = session.user && session.user.role;
        let render = (props) => (<Component {...props} {...customProps} />);

        // If using exact path, match exactly, otherwise do some fuzzy checking
        const active = exact ? history.location.pathname === path :
            history.location.pathname.startsWith(path.replace(/\/:[a-zA-Z_-]*/g, ''));

        // If you log out while on a restricted page, this will instantly redirect back to the homepage
        if (!loggedIn && active) {
            return noAccessRedirect('You must be logged in to view that page.');
        }

        // In all other cases, we pass our action to the render function of the route rather than instantly redirect,
        // because they need to run when the route is actually navigated to
        if (!loggedIn && oneOf) {
            render = () => (<Redirect to={`/login?warn=true&redirect=${encodeURIComponent(path)}`}/>)
        }
        // TODO: This doesn't support role hierarchy, and probably should
        else if (oneOf && !oneOf.includes(session.user.role)) {
            render = () => noAccessRedirect('You do not have sufficient privileges to view that page.');
        }
        // If the user has not verified their email and email verification is required for the route,
        // redirect them
        if (verifyEmail && session.user && !session.user.isEmailVerified) {
            render = () => noAccessRedirect('You must verify your email address to view that page.');
        }

        return (
            <Route {...this.props} component={null} render={(props) => render(props)}/>
        );
    }
}

export default withRouter(connect(ProtectedRoute.mapStateToProps)(ProtectedRoute));
