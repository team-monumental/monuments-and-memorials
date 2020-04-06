import * as React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Spinner from '../../components/Spinner/Spinner';
import AdminPanel from '../../components/AdminPanel/AdminPanel';
import { capitalize } from '../../utils/string-util';
import { countPendingSuggestions } from '../../actions/search';

class AdminPage extends React.Component {

    static mapStateToProps(state) {
        return {
            session: state.session,
            pendingSuggestions: state.pendingSuggestions
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(countPendingSuggestions());
    }

    render() {
        const { session, pendingSuggestions } = this.props;

        return (
            <div className="admin h-100">
                <Helmet title="Advanced | Monuments and Memorials"/>
                <Spinner show={session.pending}/>
                {session.user &&
                    <AdminPanel user={session.user} role={capitalize(session.user.role)}
                                pendingSuggestionCount={pendingSuggestions && pendingSuggestions.count}/>
                }
            </div>
        );
    }
}

export default connect(AdminPage.mapStateToProps)(AdminPage);