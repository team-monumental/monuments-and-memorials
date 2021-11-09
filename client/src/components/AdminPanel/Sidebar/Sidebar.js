import * as React from 'react';
import './Sidebar.scss';
import { Role } from '../../../utils/authentication-util';
import { NavLink } from 'react-router-dom';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class Sidebar extends React.Component {

    get links() {
        const { pendingSuggestionCount } = this.props;

        const manageSuggestionsExtraDisplay = (<>
            <OverlayTrigger placement="top"
                            overlay={props => (
                                <Tooltip {...props}>There are currently {pendingSuggestionCount} pending Suggestions</Tooltip>
                            )}>
                <Badge variant="primary" pill className="ml-4">{pendingSuggestionCount}</Badge>
            </OverlayTrigger>
        </>);

        return [
            {name: 'Home', icon: 'home', route: '/panel', exact: true},
            {name: 'Bulk Suggest', icon: 'cloud_upload', route: '/panel/bulk', roles: Role.PARTNER},
            {name: 'Bulk Create', icon: 'cloud_upload', route: '/panel/bulk', roles: Role.RESEARCHER_OR_ABOVE},
            {name: 'Bulk Export', icon: 'cloud_download', route: '/panel/bulk-export', roles: Role.RESEARCHER_OR_ABOVE},
            {name: 'Bulk Edit', icon: 'account_balance', route: '/panel/bulk-edit', roles: Role.RESEARCHER_OR_ABOVE},
            {name: 'Manage Suggestions', icon: 'description', route: '/panel/manage/suggestions', roles: Role.RESEARCHER_OR_ABOVE, extraDisplay: manageSuggestionsExtraDisplay},
            {name: 'Manage Monuments', icon: 'account_balance', route: '/panel/manage/monuments', roles: Role.RESEARCHER_OR_ABOVE},
            {name: 'Manage Users', icon: 'person', route: '/panel/manage/users', roles: Role.ADMIN}
        ]
    }

    render() {
        const { user } = this.props;
        return (
            <div className="sidebar">
                {this.links.filter(link => (!link.roles || link.roles.includes(user.role)) && (!link.role || link.role === user.role)).map(link => (
                    <NavLink to={link.route} exact={link.exact} className="nav-link d-flex align-items-center" activeClassName="active" key={link.name}>
                        <i className="material-icons-outlined mr-3">
                            {link.icon}
                        </i>
                        {link.name}
                        {link.extraDisplay}
                    </NavLink>
                ))}
            </div>
        );
    }
}