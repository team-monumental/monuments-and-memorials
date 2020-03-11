import * as React from 'react';
import UserSearchBar from './UserSearchBar/UserSearchBar';
import UserSearchResults from './UserSearchResults/UserSearchResults';

export default class UserSearch extends React.Component {

    render() {
        const { showSearchResults, onLimitChange, limit, page, count, users } = this.props;

        return (
            <div className="user-search">
                <UserSearchBar/>
                {showSearchResults &&
                    <UserSearchResults onLimitChange={onLimitChange} limit={limit} page={page} count={count} users={users}/>
                }
            </div>
        );
    }
}