import * as React from 'react';
import './ManageUsers.scss';
import {withRouter} from 'react-router-dom';
import {Button, Card} from 'react-bootstrap';
import ManageUser from './ManageUser/ManageUser';
import UserSearchPage from '../../../pages/AdminPage/ManageUsersPage/UserSearchPage/UserSearchPage';

class ManageUsers extends React.Component {

    render() {
        const {mode, history, user, contributions, onChangeRole, changeRoleSuccess, session} = this.props;
        return (
            <div className="manage-users">
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <Card.Title>
                            Manage Users
                        </Card.Title>
                        {mode === 'user' && <>
                            <Button variant="light" className="h-100" onClick={() => history.goBack()}>Back</Button>
                        </>}
                    </Card.Header>
                    <Card.Body>
                        {(!mode || mode === 'search') &&
                            <UserSearchPage showSearchResults={mode === 'search'}/>
                        }
                        {(mode === 'user' && user) &&
                            <ManageUser user={user} contributions={contributions} onChangeRole={onChangeRole}
                                        changeRoleSuccess={changeRoleSuccess} session={session}/>
                        }
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default withRouter(ManageUsers);