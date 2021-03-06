import React from 'react';
import './UpdateUserPage.scss';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import UpdateUser from '../../components/UpdateUser/UpdateUser';
import { updateUser, clearUpdateUser } from '../../actions/user';
import { Helmet } from 'react-helmet';
import Footer from '../../components/Footer/Footer';

class UpdateUserPage extends React.Component {

    static mapStateToProps(state) {
        return {
            session: state.session,
            ...state.updateUser
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(clearUpdateUser());
    }

    updateUser(user) {
        const { dispatch, session } = this.props;
        dispatch(updateUser({
            ...session.user,
            ...user
        }));
    }

    render() {
        const { pending, success, error, needsConfirmation, session } = this.props;
        return (
            <div className="page-container">
                <div className="update-user page">
                    <Helmet title="Update Your Information | Monuments and Memorials"/>
                    <Spinner show={session.pending || pending}/>
                    {session.user &&
                        <UpdateUser user={session.user} success={success} error={error}
                                    needsConfirmation={needsConfirmation}
                                    onSubmit={user => this.updateUser(user)}/>
                    }
                </div>
                <Footer/>
            </div>
        )
    }
}

export default connect(UpdateUserPage.mapStateToProps)(UpdateUserPage);