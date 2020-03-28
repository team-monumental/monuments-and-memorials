import React from 'react';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import User from '../../components/User/User';
import { fetchFavorites } from '../../actions/user';
import { Helmet } from 'react-helmet';
import { fetchBulkCreateSuggestions, fetchCreateSuggestions, fetchUpdateSuggestions } from '../../actions/suggestions';
import { Role } from '../../utils/authentication-util';

class UserPage extends React.Component {

    componentDidMount() {
        const { dispatch, session } = this.props;
        dispatch(fetchFavorites());
        dispatch(fetchCreateSuggestions());
        dispatch(fetchUpdateSuggestions());

        if (session && session.user && session.user.role.toUpperCase() === Role.PARTNER) {
            dispatch(fetchBulkCreateSuggestions());
        }
    }

    static mapStateToProps(state) {
        return {
            session: state.session,
            favorites: state.fetchFavorites,
            createSuggestions: state.fetchCreateSuggestions,
            updateSuggestions: state.fetchUpdateSuggestions,
            bulkCreateSuggestions: state.fetchBulkCreateSuggestions
        };
    }

    render() {
        const { session, favorites, createSuggestions, updateSuggestions, bulkCreateSuggestions } = this.props;

        const suggestions = {
            createSuggestions: createSuggestions ? createSuggestions.result : undefined,
            updateSuggestions: updateSuggestions ? updateSuggestions.result : undefined,
            bulkCreateSuggestions: bulkCreateSuggestions ? bulkCreateSuggestions.result : undefined
        };

        return (
            <div className="account page">
                <Helmet title="Account | Monuments and Memorials"/>
                <Spinner show={session.pending}/>
                {session.user &&
                    <User user={session.user} favorites={favorites} suggestions={suggestions} role={session.user.role}/>
                }
            </div>
        )
    }
}

export default connect(UserPage.mapStateToProps)(UserPage);