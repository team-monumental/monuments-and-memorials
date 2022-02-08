import React from 'react';
import './ConfirmEmailChangePage.scss';
import {connect} from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import * as QueryString from 'query-string';
import {confirmEmailChange} from '../../actions/user';
import {Card} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import Footer from '../../components/Footer/Footer';

class ConfirmEmailChangePage extends React.Component {

    static mapStateToProps(state) {
        return state.confirmEmailChange;
    }

    componentDidMount() {
        this.initialize();
    }

    initialize() {
        const {dispatch, location: {search}} = this.props;
        const token = search && QueryString.parse(search).token;

        if (token) {
            this.setState({confirmEmail: true});
            return dispatch(confirmEmailChange(token));
        }
    }

    render() {
        const {pending, success, error} = this.props;
        return (
            <div className="page-container">
                <div className="change-email-confirmation page d-flex flex-column align-items-center">
                    <Helmet title="Confirm Your Email Address | Monuments and Memorials"/>
                    <Spinner show={pending}/>
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                Confirm Email Change
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {success && <>
                                Success! Your email address has been verified
                            </>}
                            {error && <div className="error-message mb-3">
                                {error}
                            </div>}
                        </Card.Body>
                    </Card>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(connect(ConfirmEmailChangePage.mapStateToProps)(ConfirmEmailChangePage));