import React from 'react';
import './SuggestionCreatedPage.scss';
import Helmet from 'react-helmet';
import { Card } from 'react-bootstrap';
import { NavLink, withRouter } from 'react-router-dom';

/**
 * Root container for the page shown after a Suggestion is created
 */
class SuggestionCreatedPage extends React.Component {

    render() {
        const accountPageLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace('/account');
            }} to="/account" key="account">clicking here</NavLink>
        );

        return (
            <div className="suggestion-created-page-container">
                <Helmet title="Suggestion Created | Monuments and Memorials"/>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            Thank You
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <p>
                            Thank you for taking the time to contribute to our database. Your Suggestion has been
                            created and is awaiting administrator review. You will be notified via email when your
                            Suggestion is approved. You can view all of your Suggestions by {accountPageLink} and
                            scrolling down to the <strong>Your Suggestions</strong> section.
                        </p>
                    </Card.Body>
                </Card>
        </div>
        );
    }
}

export default withRouter(SuggestionCreatedPage);