import React from 'react';
import './UserPage.scss';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import User from '../../components/User/User';

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
                    <User user={session.user}/>
                }
            </div>
        )
    }
}

export default connect(AboutPage.mapStateToProps)(AboutPage);