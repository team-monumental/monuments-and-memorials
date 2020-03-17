import * as React from 'react';
import { connect } from 'react-redux';
import ManageUsers from '../../../components/AdminPanel/ManageUsers/ManageUsers';
import { fetchUser, updateUser } from '../../../actions/user';
import Spinner from '../../../components/Spinner/Spinner';
import { addToast } from '../../../actions/toasts';
import { getUserFullName } from '../../../utils/string-util';

class ManageUsersPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            changeRoleSuccess: false
        };
    }


    static mapStateToProps(state) {
        return {
            fetchUser: state.fetchUser,
            updateUser: state.updateUser
        };
    }

    componentDidMount() {
        this.fetchUserIfIdExists();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dispatch, fetchUser } = this.props;
        if (this.props.updateUser.success && !this.props.updateUser.pending && prevProps.updateUser.pending) {
            const user = fetchUser.result.user;
            dispatch(addToast({
                title: 'Success!',
                message: `You have successfully changed ${getUserFullName(user)}'s role`,
                variant: 'success'
            }));
            this.setState({changeRoleSuccess: true});
        }
        if (this.state.changeRoleSuccess && !prevState.changeRoleSuccess) {
            this.setState({changeRoleSuccess: false});
        }
    }

    fetchUserIfIdExists() {
        const { dispatch, match: { params: { userId } } } = this.props;
        if (userId) {
            try {
                if (!isNaN(parseInt(userId))) {
                    dispatch(fetchUser(userId, false));
                }
            } catch (err) {}
        }
    }

    handleChangeRole(role) {
        const { dispatch, fetchUser: { result: { user } } } = this.props;
        user.role = role;
        dispatch(updateUser(user));
    }

    render() {
        const { mode, fetchUser, updateUser } = this.props;
        const { changeRoleSuccess } = this.state;

        return (<>
            <Spinner show={fetchUser.pending || updateUser.pending}/>
            <ManageUsers mode={mode} user={fetchUser.result && fetchUser.result.user}
                         contributions={fetchUser.result && fetchUser.result.contributions}
                         onChangeRole={role => this.handleChangeRole(role)}
                         changeRoleSuccess={changeRoleSuccess}/>
        </>);
    }
}

export default connect(ManageUsersPage.mapStateToProps)(ManageUsersPage);