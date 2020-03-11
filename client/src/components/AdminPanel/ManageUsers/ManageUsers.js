import * as React from 'react';
import './ManageUsers.scss';
import { Button, Card } from 'react-bootstrap';
import ManageUser from './ManageUser/ManageUser';
import UpdateUserPage from '../../../pages/AdminPage/ManageUsersPage/UpdateUserPage/UpdateUserPage';
import UserSearchPage from '../../../pages/AdminPage/ManageUsersPage/UserSearchPage/UserSearchPage';

export default class ManageUsers extends React.Component {

    render() {
        const { mode, history } = this.props;
        return (
            <div className="manage-users">
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <Card.Title>
                            Manage Users
                        </Card.Title>
                        {mode === 'user' && <>
                            <Button variant="light" className="h-75" onClick={() => history.goBack()}>Back</Button>
                        </>}
                    </Card.Header>
                    <Card.Body>
                        {(!mode || mode === 'search') &&
                            <UserSearchPage showSearchResults={mode === 'search'}/>
                        }
                        {mode === 'user' &&
                            <ManageUser/>
                        }
                        {mode === 'update' &&
                            <UpdateUserPage/>
                        }
                    </Card.Body>
                </Card>
            </div>
        );
    }
}