import * as React from 'react';
import {capitalize, getUserFullName, prettyPrintDate} from '../../../../utils/string-util';
import {Link} from 'react-router-dom';
import {Alert, Button, Form, Modal} from 'react-bootstrap';
import {Role} from '../../../../utils/authentication-util';
import {Helmet} from 'react-helmet';
import {getMonumentSlug} from "../../../../utils/regex-util";
import {ExportToCsvButton} from '../../../Export/ExportToCsvButton/ExportToCsvButton';
import {buildBulkExportData, csvExportFields} from "../../../../utils/export-util";
import moment from "moment";

export default class ManageUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editingRole: false,
            role: props.user.role,
            confirmAdminModalOpen: false,
            dismissAlert: false,
            userMonumentExportData: []
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.changeRoleSuccess && this.props.changeRoleSuccess !== prevProps.changeRoleSuccess) {
            this.setState({editingRole: false});
        }
    }

    componentDidMount() {
        this.fetchUsersMonuments().then(result => this.setState({
            userMonumentExportData: buildBulkExportData(result, csvExportFields, true)
        }))
    }

    handleChangeRole(confirm = false) {
        const {onChangeRole} = this.props;
        const {role} = this.state;

        if (role === Role.ADMIN && !confirm) {
            this.setState({confirmAdminModalOpen: true});
        } else {
            if (confirm) {
                this.setState({confirmAdminModalOpen: false});
            }
            onChangeRole(role);
        }
    }

    async fetchUsersMonuments() {
        //TODO: This function NEEDS a way to only be called when the buttons are clicked to prevent unneeded data fetching
        let endpoint = `${window.location.origin}/api/search/user/monumentsById/?id=${this.props.user.id}`
        const response = await fetch(endpoint)
        return response.json()

    }

    render() {
        return (<>
            {this.renderManageUser()}
            {this.renderConfirmAdminModal()}
        </>);
    }

    renderManageUser() {
        const {user, contributions, session} = this.props;
        const {editingRole, role, dismissAlert, userMonumentExportData} = this.state;

        const isEditingSelf = user.id === session.user.id;

        return (
            <div className="manage-user">
                <Helmet title={`Manage ${getUserFullName(user)} | Monuments and Memorials`}/>
                {isEditingSelf && !dismissAlert &&
                    <Alert variant="info"
                           onClose={() => this.setState({dismissAlert: true})}
                           dismissible
                           className="d-flex align-items-center">
                        <i className="material-icons mr-3">info</i>
                        <span>You are viewing your own User record. For security purposes, you are not able to change your own role.</span>
                    </Alert>
                }
                <div className="mb-2">
                    Name: {getUserFullName(user)}
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
                    Name: {getUserFullName(user)}
                </div>
                {(contributions && contributions.length > 0) ?
                    <div className="my-3">
                        <h5>Contributions</h5>
                        <ul>
                            {contributions.map(({contribution, monument}) => (
                                <li key={contribution.id}>
                                    <Link to={`/monuments/${monument.id}/${getMonumentSlug(monument)}`}>
                                        {monument.title}
                                    </Link>
                                    <span> on {prettyPrintDate(contribution.date)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    : null}
                <div>
                    {!editingRole && !isEditingSelf &&
                        <div>
                            <Button variant="light" onClick={() => this.setState({editingRole: true})}>
                                Change Role
                            </Button>
                            <ExportToCsvButton className="mr-2"
                                               fields={csvExportFields}
                                               data={userMonumentExportData}
                                               exportTitle={`Monuments created by: ${getUserFullName(user)} ${moment().format('YYYY-MM-DD hh:mm')}`}
                            />
                        </div>
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
        const {user} = this.props;
        const {confirmAdminModalOpen} = this.state;

        return (
            <div onClick={e => e.stopPropagation()}>
                <Modal show={confirmAdminModalOpen} onHide={() => this.setState({confirmAdminModalOpen: false})}>
                    <Modal.Header closeButton>
                        Confirm Role Change
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Are you sure you want to change {getUserFullName(user)}'s role
                            from <strong>{capitalize(user.role)}</strong> to <strong>Admin</strong>?
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