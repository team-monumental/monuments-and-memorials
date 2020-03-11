import * as React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Spinner from '../../components/Spinner/Spinner';
import AdminPanel from '../../components/AdminPanel/AdminPanel';

class AdminPage extends React.Component {

    static mapStateToProps(state) {
        return {
            session: state.session
        };
    }

    render() {
        const { session } = this.props;

        return (
            <div className="admin h-100">
                <Helmet title="Advanced | Monuments and Memorials"/>
                <Spinner show={session.pending}/>
                {session.user &&
                    <AdminPanel user={session.user} role={session.user.role.substring(0, 1).toUpperCase() + session.user.role.substring(1).toLowerCase()}/>
                }
            </div>
        );
    }
}

export default connect(AdminPage.mapStateToProps)(AdminPage);