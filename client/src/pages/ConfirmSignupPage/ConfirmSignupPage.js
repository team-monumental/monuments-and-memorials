import React from 'react';
import './ConfirmSignupPage.scss';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import * as QueryString from 'query-string';
import { Button, Card } from 'react-bootstrap';
import { confirmSignup, resendConfirmation } from '../../actions/authentication';
import Spinner from '../../components/Spinner/Spinner';
import { Helmet } from 'react-helmet';
import Footer from '../../components/Footer/Footer';

class ConfirmSignupPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            resend: false,
            signup: false
        };
    }

    componentDidMount() {
        this.initialize();
    }

    initialize() {
        const { dispatch, location: { search }, session } = this.props;
        const params = search && QueryString.parse(search);

        const token = params.token;
        const resend = params.resend;
        const signup = params.signup;

        if (resend) {
            if (session.user) {
                return this.resendConfirmation();
            } else {
                return this.setState({resend: true, signup});
            }
        }

        if (token) {
            return dispatch(confirmSignup(token));
        }

        // How did you get here you little rascal?
        return this.setState({redirect: '/'});
    }

    static mapStateToProps(state) {
        return {
            confirmSignup: state.confirmSignup,
            resendConfirmation: state.resendConfirmation,
            session: state.session
        };
    }

    async beginResendConfirmation() {
        await this.setState({redirect: '/signup/confirm?resend=true&signup=true'});
        this.initialize();
    }

    resendConfirmation() {
        const { dispatch, session: { user } } = this.props;
        const { signup } = this.state;
        dispatch(resendConfirmation(user, signup));
    }

    render() {
        return (<>
            <Helmet title="Confirm Signup | Monuments and Memorials"/>
            {this.renderPage()}
        </>);
    }

    renderPage() {
        const { confirmSignup, resendConfirmation, session } = this.props;
        const { resend, redirect } = this.state;

        if (redirect) {
            return (<Redirect to={redirect} push/>)
        }

        if (confirmSignup.pending || resendConfirmation.pending) {
            return (<Spinner show/>)
        }

        if (resend && !resendConfirmation.pending && !resendConfirmation.error && !resendConfirmation.success) {
            if (session.user) {
                this.resendConfirmation();
            }
            return (<></>);
        }

        if (resendConfirmation.error || resendConfirmation.success || resendConfirmation.pending) {
            return this.renderResult(
                resendConfirmation,
                'Something went wrong while resending your email confirmation.',
                'A confirmation email has been sent to your email address.'
            );
        }
        else if (confirmSignup.error || confirmSignup.success || confirmSignup.pending) {
            return this.renderResult(
                confirmSignup,
                'Something went wrong while confirming your email address.',
                'Your email address has been confirmed successfully.',
                true);
        }
        else {
            return (<></>);
        }
    }

    renderResult({error, success, pending}, errorMessage, successMessage, allowResend = false) {
        const { session } = this.props;

        errorMessage = typeof error === 'string' ? error : errorMessage;

        return (
            <div className="page-container">
                <div className="confirm-signup-page page d-flex justify-content-center mt-5">
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                {error && 'Whoops!'}
                                {success && 'Success!'}
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {error && <>
                                {errorMessage} {session.user && allowResend &&
                                    <Button
                                       variant="link"
                                       className="p-0"
                                       onClick={() => this.beginResendConfirmation()}>
                                        Try sending a new one.
                                    </Button>
                                }
                            </>}
                            {success && successMessage}
                        </Card.Body>
                    </Card>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default withRouter(connect(ConfirmSignupPage.mapStateToProps)(ConfirmSignupPage));