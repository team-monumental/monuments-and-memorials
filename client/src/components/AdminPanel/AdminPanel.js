import * as React from 'react';
import './AdminPanel.scss';
import Sidebar from './Sidebar/Sidebar';
import ProtectedRoute from '../../containers/ProtectedRoute/ProtectedRoute';
import MonumentBulkCreatePage from '../../pages/AdminPage/MonumentBulkCreatePage/MonumentBulkCreatePage';
import AdminPanelHome from './AdminPanelHome/AdminPanelHome';
import ManageMonumentsPage from '../../pages/AdminPage/ManageMonumentsPage/ManageMonumentsPage';
import ManageUsersPage from '../../pages/AdminPage/ManageUsersPage/ManageUsersPage';

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
                    <ProtectedRoute exact path="/panel/manage/monuments" component={ManageMonumentsPage}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/search" component={ManageMonumentsPage} customProps={{mode: 'search'}}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/monument/:monumentId" component={ManageMonumentsPage} customProps={{mode: 'monument'}}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/monument/update/:monumentId" component={ManageMonumentsPage} customProps={{mode: 'update'}}/>
                    <ProtectedRoute exact path="/panel/manage/users" component={ManageUsersPage}/>
                    <ProtectedRoute exact path="/panel/manage/users/search" component={ManageUsersPage} customProps={{mode: 'search'}}/>
                    <ProtectedRoute exact path="/panel/manage/users/user/:userId" component={ManageUsersPage} customProps={{mode: 'user'}}/>
                </div>
                <div className="right"/>
            </div>
        );
    }
}