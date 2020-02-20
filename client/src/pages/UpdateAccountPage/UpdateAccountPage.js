import React from 'react';
import './UpdateAccountPage.scss';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import UpdateAccount from '../UpdateAccount/UpdateAccount';

class UpdateAboutPage extends React.Component {

    static mapStateToProps(state) {
        return {
            session: state.session
        };
    }

    updateAccount(data) {
        const { dispatch } = this.props;
    }

    render() {
        const { session } = this.props;
        return (
            <div className="account page">
                <Spinner show={session.pending}/>
                {session.user &&
                    <UpdateAccount user={session.user} onSubmit={data => this.updateAccount(data)}/>
                }
            </div>
        )
    }
}

export default connect(UpdateAboutPage.mapStateToProps)(UpdateAboutPage);