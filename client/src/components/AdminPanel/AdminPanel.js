import * as React from 'react';
import './AdminPanel.scss';
import Sidebar from './Sidebar/Sidebar';
import ProtectedRoute from '../../containers/ProtectedRoute/ProtectedRoute';
import MonumentBulkCreatePage from '../../pages/AdminPage/MonumentBulkCreatePage/MonumentBulkCreatePage';
import AdminPanelHome from './AdminPanelHome/AdminPanelHome';

export default class AdminPanel extends React.Component {

    render() {
        const { user, role } = this.props;
        return (
            <div className="panel">
                <div className="left">
                    <Sidebar user={user}/>
                </div>
                <div className="viewport">
                    <ProtectedRoute exact path="/panel/bulk" component={MonumentBulkCreatePage}/>
                    <ProtectedRoute exact path="/panel" component={AdminPanelHome} customProps={{role}}/>
                </div>
                <div className="right"/>
            </div>
        );
    }
}