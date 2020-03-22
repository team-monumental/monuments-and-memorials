import * as React from 'react';
import './User.scss';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Favorites from './Favorites/Favorites';
import { capitalize, getUserFullName } from '../../utils/string-util';
import Suggestions from './Suggestions/Suggestions';

export default class User extends React.Component {

    render() {
        const { user, favorites, suggestions, role } = this.props;
        return (
            <div className="d-flex justify-content-center">
                <div className="d-flex flex-column">
                    <Card className="mb-4 w-100">
                        <Card.Header>
                            <Card.Title>Your Account</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-2">
                                <span className="font-weight-bold">Name:</span> {getUserFullName(user)}
                            </div>
                            {user.role &&
                            <div className="mb-2">
                                <span className="font-weight-bold">Role:</span> {capitalize(user.role)}
                            </div>
                            }
                            <div className="mb-2">
                                <span className="font-weight-bold">Email Address:</span> {user.email}
                                <div className="mt-2 pl-2 font-italic">
                                    {!user.isEmailVerified && <>
                                        Your email address is not yet verified. <Link to="/signup/confirm?resend=true">
                                            Click here
                                        </Link> to resend the verification email.
                                    </>}
                                    {user.isEmailVerified && <>
                                        <i className="material-icons text-primary verified-icon">
                                            check_circle
                                        </i> Verified
                                    </>}
                                </div>
                            </div>
                            <div className="mb-2">
                                <Link to="/account/update">
                                    Update your information
                                </Link>
                            </div>
                            <div>
                                <Link to="/password-reset">
                                    Change your password
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                    <Favorites favorites={favorites.result} pending={favorites.pending} error={favorites.error}/>
                    <Suggestions createSuggestions={suggestions.createSuggestions} updateSuggestions={suggestions.updateSuggestions}
                                 bulkCreateSuggestions={suggestions.bulkCreateSuggestions} pending={suggestions.pending}
                                 error={suggestions.error} role={role}
                     />
                </div>
            </div>
        );
    }
}