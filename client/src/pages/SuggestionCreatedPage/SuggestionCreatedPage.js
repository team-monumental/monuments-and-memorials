import React from 'react';
import './SuggestionCreatedPage.scss';
import Helmet from 'react-helmet';
import {Button, Card} from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom';
import * as QueryString from 'query-string';
import Footer from '../../components/Footer/Footer';

/**
 * Root container for the page shown after a Suggestion is created
 */
class SuggestionCreatedPage extends React.Component {

    handleButtonClick() {
        const {location: {search}, history} = this.props;
        const type = QueryString.parse(search).type;

        switch (type) {
            case 'create':
                history.push('/create');
                break;
            case 'bulk':
                history.push('/panel/bulk');
                break;
            default:
                return;
        }
    }

    render() {
        const {location: {search}} = this.props;
        const type = QueryString.parse(search).type;

        const accountPageLink = (
            <Link to="/account" key="account">clicking here</Link>
        );

        return (
            <div className="page-container">
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
                            {type && (type === 'create' || type === 'bulk') &&
                                <Button variant="primary" onClick={() => this.handleButtonClick()}>
                                    {
                                        type === 'bulk' ? 'SUGGEST MORE CHANGEs' : 'SUGGEST ANOTHER CHANGE'
                                    }
                                </Button>
                            }
                        </Card.Body>
                    </Card>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(SuggestionCreatedPage);