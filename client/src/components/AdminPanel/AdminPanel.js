import * as React from 'react';
import './AdminPanel.scss';
import Sidebar from './Sidebar/Sidebar';
import ProtectedRoute from '../../containers/ProtectedRoute/ProtectedRoute';
import MonumentBulkCreatePage from '../../pages/AdminPage/MonumentBulkCreatePage/MonumentBulkCreatePage';
import AdminPanelHome from './AdminPanelHome/AdminPanelHome';
import ManageMonumentsPage from '../../pages/AdminPage/ManageMonumentsPage/ManageMonumentsPage';
import ManageUsersPage from '../../pages/AdminPage/ManageUsersPage/ManageUsersPage';
import { Role } from '../../utils/authentication-util';

export default class AdminPanel extends React.Component {

    render() {
        const { user, role } = this.props;
        return (
            <div className="panel">
                <div className="left">
                    <Sidebar user={user}/>
                </div>
                <div className="viewport">
                    <ProtectedRoute exact path="/panel" component={AdminPanelHome} customProps={{role}}/>
                    <ProtectedRoute exact path="/panel/bulk" component={MonumentBulkCreatePage} customProps={{role}}/>
                    <ProtectedRoute exact path="/panel/manage/monuments" component={ManageMonumentsPage} oneOf={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/search" component={ManageMonumentsPage} customProps={{mode: 'search'}} oneOf={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/monument/:monumentId" component={ManageMonumentsPage} customProps={{mode: 'monument'}} oneOf={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/monument/update/:monumentId" component={ManageMonumentsPage} customProps={{mode: 'update'}} oneOf={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/users" component={ManageUsersPage} oneOf={[Role.ADMIN]}/>
                    <ProtectedRoute exact path="/panel/manage/users/search" component={ManageUsersPage} customProps={{mode: 'search'}} oneOf={[Role.ADMIN]}/>
                    <ProtectedRoute exact path="/panel/manage/users/user/:userId" component={ManageUsersPage} customProps={{mode: 'user'}} oneOf={[Role.ADMIN]}/>
                </div>
                <div className="right"/>
            </div>
        );
    }
}