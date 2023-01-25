import * as React from 'react';
import './UserSearchResult.scss';
import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {capitalize, getUserFullName} from '../../../../../../utils/string-util';

export default class UserSearchResult extends React.Component {

    render() {
        const {user, index} = this.props;

        return (
            <div className="user-search-result">
                <Card>
                    <Card.Title>
                        <Link to={`/panel/manage/users/user/${user.id}`}>
                            {index + 1}. {getUserFullName(user)}
                        </Link>
                    </Card.Title>
                    <Card.Body>
                        <div>
                            Role: {capitalize(user.role)}
                        </div>
                        <div>
                            Email Address: <a href={`mailto:${user.email}`}>{user.email}</a>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}