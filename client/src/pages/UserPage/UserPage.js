import React from 'react';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import User from '../../components/User/User';
import { fetchFavorites } from '../../actions/user';
import { Helmet } from 'react-helmet';
import { fetchBulkCreateSuggestions, fetchCreateSuggestions, fetchUpdateSuggestions } from '../../actions/suggestions';
import { Role } from '../../utils/authentication-util';
import { Alert } from 'react-bootstrap';

class UserPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dismissAlert: false
        };
    }

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
        const { createSuggestions, updateSuggestions, bulkCreateSuggestions, session, favorites } = this.props;
        const { dismissAlert } = this.state;

        const alert = this.props.location.state ? this.props.location.state.alert : undefined;

        const suggestions = {
            createSuggestions: createSuggestions.result,
            updateSuggestions: updateSuggestions.result,
            bulkCreateSuggestions: bulkCreateSuggestions.result
        };

        return (<>
            <Helmet title="Account | Monuments and Memorials"/>
            {alert && !dismissAlert &&
                <Alert variant="danger"
                       onClose={() => this.setState({dismissAlert: true})}
                       dismissible
                       className="mx-4">
                    {alert}
                </Alert>
            }
            <div className="account page">
                <Spinner show={session.pending}/>
                {session.user &&
                    <User user={session.user} favorites={favorites} suggestions={suggestions} role={session.user.role}/>
                }
            </div>
        </>)
    }
}

export default connect(UserPage.mapStateToProps)(UserPage);