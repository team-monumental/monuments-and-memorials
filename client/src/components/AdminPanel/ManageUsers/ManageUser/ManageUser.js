import * as React from 'react';
import { capitalize, prettyPrintDate } from '../../../../utils/string-util';
import { Link } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { Role } from '../../../../utils/authentication-util';

export default class ManageUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editingRole: false,
            role: props.user.role,
            confirmAdminModalOpen: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.changeRoleSuccess && this.props.changeRoleSuccess !== prevProps.changeRoleSuccess) {
            this.setState({editingRole: false});
        }
    }

    handleChangeRole(confirm=false) {
        const { onChangeRole } = this.props;
        const { role } = this.state;

        if (role === Role.ADMIN && !confirm) {
            this.setState({confirmAdminModalOpen: true});
        } else {
            if (confirm) {
                this.setState({confirmAdminModalOpen: false});
            }
            onChangeRole(role)
        }
    }

    render() {
        return (<>
            {this.renderManageUser()}
            {this.renderConfirmAdminModal()}
        </>);
    }

    renderManageUser() {
        const { user, contributions } = this.props;
        const { editingRole, role } = this.state;

        return (
            <div className="manage-user">
                <div className="mb-2">
                    Name: {user.firstName} {user.lastName}
                </div>
                <div className="mb-2 d-flex align-items-center">
                    Role: {editingRole ?
                    <Form.Control as="select" className="min-width-select ml-2" value={role}
                                  onChange={event => this.setState({role: event.target.value})}>
                        <option value={Role.COLLABORATOR}>Collaborator</option>
                        <option value={Role.PARTNER}>Partner</option>
                        <option value={Role.RESEARCHER}>Researcher</option>
                        <option value={Role.ADMIN}>Admin</option>
                    </Form.Control>
                    : capitalize(user.role)
                }
                </div>
                <div className="mb-2">
                    Email Address: <a href={`mailto:${user.email}`}>{user.email}</a>
                </div>
                <div className="mb-2">
                    Name: {user.firstName} {user.lastName}
                </div>
                {(contributions && contributions.length > 0) ?
                    <div className="my-3">
                        <h5>Contributions</h5>
                        <ul>
                            {contributions.map(contribution => (
                                <li key={contribution.id}>
                                    <Link to={`/monuments/${contribution.monument.id}`}>
                                        {contribution.monument.title}
                                    </Link>
                                    <span> on {prettyPrintDate(contribution.date)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    : null}
                <div>
                    {!editingRole &&
                    <Button variant="light" onClick={() => this.setState({editingRole: true})}>
                        Change Role
                    </Button>
                    }
                    {editingRole &&
                    <Button variant="primary" onClick={() => this.handleChangeRole()} disabled={role === user.role}>
                        Save
                    </Button>
                    }
                </div>
            </div>
        )
    }

    renderConfirmAdminModal() {
        const { user } = this.props;
        const { confirmAdminModalOpen } = this.state;

        return (
            <div onClick={e => e.stopPropagation()}>
                <Modal show={confirmAdminModalOpen} onHide={() => this.setState({confirmAdminModalOpen: false})}>
                    <Modal.Header closeButton>
                        Confirm Role Change
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Are you sure you want to change {user.firstName} {user.lastName}'s role from <strong>{capitalize(user.role)}</strong> to <strong>Admin</strong>?
                        </p>
                        <p>
                            If you make this change, they will be able to <strong>change your role</strong>.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => this.setState({confirmAdminModalOpen: false})}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => this.handleChangeRole(true)}>
                            Yes, make them an Admin
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}