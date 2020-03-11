import * as React from 'react';
import './UserSearchResult.scss';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class UserSearchResult extends React.Component {

    render() {
        const { user, index } = this.props;

        return (
            <div className="user-search-result">
                <Card>
                    <Card.Title>
                        <Link to={`/panel/manage/users/${user.id}`}>
                            {index + 1}. {user.firstName} {user.lastName}
                        </Link>
                    </Card.Title>
                    <Card.Body>
                        <div>
                            Role: {user.role.substring(0, 1) + user.role.substring(1).toLowerCase()}
                        </div>
                        <div>
                            Email Address: {user.email}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}