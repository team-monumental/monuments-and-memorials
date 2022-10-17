import * as React from 'react';
import UserSearchResult from './UserSearchResult/UserSearchResult';

export default class UserSearchResults extends React.Component {

    render() {
        const { limit, page, users } = this.props;
        if (users && users.length > 0) {
            return (
                <div className="user-search-results">
                    {
                        users.map((user, index) => (
                            <UserSearchResult key={user.id} user={user} index={index + ((page - 1) * limit)}/>
                        ))
                    }
                </div>
            );
        } else {
            return (
                <div className="mt-4 text-center">No search results were found. Try broadening your search.</div>
            );
        }
    }
}