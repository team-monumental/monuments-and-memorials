import React from 'react';
import './UserPage.scss';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import User from '../../components/User/User';
import { fetchFavorites } from '../../actions/user';

class UserPage extends React.Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchFavorites());
    }

    static mapStateToProps(state) {
        return {
            session: state.session,
            favorites: state.fetchFavorites
        };
    }

    render() {
        const { session, favorites } = this.props;
        return (
            <div className="account page">
                <Spinner show={session.pending}/>
                {session.user &&
                    <User user={session.user} favorites={favorites}/>
                }
            </div>
        )
    }
}

export default connect(UserPage.mapStateToProps)(UserPage);