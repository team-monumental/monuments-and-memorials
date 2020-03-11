import * as React from 'react';
import './AdminPanel.scss';
import Sidebar from './Sidebar/Sidebar';
import ProtectedRoute from '../../containers/ProtectedRoute/ProtectedRoute';
import MonumentBulkCreatePage from '../../pages/AdminPage/MonumentBulkCreatePage/MonumentBulkCreatePage';
import AdminPanelHome from './AdminPanelHome/AdminPanelHome';
import ManageMonumentsPage from '../../pages/AdminPage/ManageMonumentsPage/ManageMonumentsPage';

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
                    <ProtectedRoute exact path="/panel/bulk" component={MonumentBulkCreatePage}/>
                    <ProtectedRoute exact path="/panel/manage/monuments" component={ManageMonumentsPage}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/search" component={ManageMonumentsPage} customProps={{mode: 'search'}}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/monument/:monumentId" component={ManageMonumentsPage} customProps={{mode: 'monument'}}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/monument/update/:monumentId" component={ManageMonumentsPage} customProps={{mode: 'update'}}/>
                </div>
                <div className="right"/>
            </div>
        );
    }
}