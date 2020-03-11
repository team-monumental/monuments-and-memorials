import * as React from 'react';
import { connect } from 'react-redux';
import ManageUsers from '../../../components/AdminPanel/ManageUsers/ManageUsers';

class ManageUsersPage extends React.Component {

    render() {
        const { mode } = this.props;

        return (
            <ManageUsers mode={mode}/>
        );
    }
}

export default connect()(ManageUsersPage);