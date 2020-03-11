import * as React from 'react';
import { connect } from 'react-redux';
import UpdateUser from '../../../../components/AdminPanel/ManageUsers/UpdateUser/UpdateUser';

class UpdateUserPage extends React.Component {

    render() {
        return (
            <UpdateUser/>
        )
    }
}

export default connect(UpdateUserPage);