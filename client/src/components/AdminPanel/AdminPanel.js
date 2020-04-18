import * as React from 'react';
import './AdminPanel.scss';
import Sidebar from './Sidebar/Sidebar';
import ProtectedRoute from '../../containers/ProtectedRoute/ProtectedRoute';
import MonumentBulkCreatePage from '../../pages/AdminPage/MonumentBulkCreatePage/MonumentBulkCreatePage';
import AdminPanelHome from './AdminPanelHome/AdminPanelHome';
import ManageMonumentsPage from '../../pages/AdminPage/ManageMonumentsPage/ManageMonumentsPage';
import ManageUsersPage from '../../pages/AdminPage/ManageUsersPage/ManageUsersPage';
import { Role } from '../../utils/authentication-util';
import ManageSuggestionsPage from '../../pages/AdminPage/ManageSuggestionsPage/ManageSuggestionsPage';
import SuggestionCreatedPage from '../../pages/SuggestionCreatedPage/SuggestionCreatedPage';

export default class AdminPanel extends React.Component {

    render() {
        const { user, role, pendingSuggestionCount } = this.props;
        return (
            <div className="panel">
                <div className="left">
                    <Sidebar user={user} pendingSuggestionCount={pendingSuggestionCount}/>
                </div>
                <div className="viewport">
                    <ProtectedRoute exact path="/panel" component={AdminPanelHome} customProps={{role}}/>
                    <ProtectedRoute exact path="/panel/bulk" component={MonumentBulkCreatePage} customProps={{role}}/>
                    <ProtectedRoute exact path="/panel/suggestion-created" component={SuggestionCreatedPage}/>
                    <ProtectedRoute exact path="/panel/manage/monuments" component={ManageMonumentsPage} roles={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/search" component={ManageMonumentsPage} customProps={{mode: 'search'}} roles={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/monument/:monumentId" component={ManageMonumentsPage} customProps={{mode: 'monument'}} roles={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/monuments/monument/update/:monumentId" component={ManageMonumentsPage} customProps={{mode: 'update'}} roles={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/users" component={ManageUsersPage} roles={[Role.ADMIN]}/>
                    <ProtectedRoute exact path="/panel/manage/users/search" component={ManageUsersPage} customProps={{mode: 'search'}} roles={[Role.ADMIN]}/>
                    <ProtectedRoute exact path="/panel/manage/users/user/:userId" component={ManageUsersPage} customProps={{mode: 'user'}} roles={[Role.ADMIN]}/>
                    <ProtectedRoute exact path="/panel/manage/suggestions" component={ManageSuggestionsPage} roles={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/suggestions/search" component={ManageSuggestionsPage} customProps={{mode: 'search'}} roles={Role.RESEARCHER_OR_ABOVE}/>
                    <ProtectedRoute exact path="/panel/manage/suggestions/suggestion/:suggestionId" component={ManageSuggestionsPage} customProps={{mode: 'suggestion'}} roles={Role.RESEARCHER_OR_ABOVE}/>
                </div>
                <div className="right"/>
            </div>
        );
    }
}