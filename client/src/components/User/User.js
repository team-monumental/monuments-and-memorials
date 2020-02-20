import * as React from 'react';
import './User.scss';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class User extends React.Component {
    render() {
        const { user } = this.props;
        return (
            <div className="d-flex flex-column align-items-center">
                <Card className="mb-4">
                    <Card.Header>
                        <Card.Title>Your Account</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="mb-2">
                            Name: {user.firstName} {user.lastName}
                        </div>
                        {user.role &&
                        <div className="mb-2">
                            Role: {user.role.substring(0, 1) + user.role.substring(1).toLowerCase()}
                        </div>
                        }
                        <div className="mb-2">
                            Email Address: {user.email}
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
                <Card>
                    <Card.Header>
                        <Card.Title>Your Favorites</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {user.favorites && <>

                        </>}
                        {(!user.favorites || !user.favorites.length) && <>
                            You don't have any favorites yet. You can favorite monuments and memorials by clicking the star on their page.
                        </>}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}