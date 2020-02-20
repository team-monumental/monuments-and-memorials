import React from 'react';
import './AccountPage.scss';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import Account from '../../components/Account/Account';

class AboutPage extends React.Component {

    static mapStateToProps(state) {
        return {
            session: state.session
        };
    }

    render() {
        const { session } = this.props;
        return (
            <div className="account page">
                <Spinner show={session.pending}/>
                {session.user &&
                    <Account user={session.user}/>
                }
            </div>
        )
    }
}

export default connect(AboutPage.mapStateToProps)(AboutPage);