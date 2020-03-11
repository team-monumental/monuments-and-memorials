import * as React from 'react';
import SearchInfo from '../../../../Search/SearchInfo/SearchInfo';
import UserSearchResult from './UserSearchResult/UserSearchResult';

export default class UserSearchResults extends React.Component {

    render() {
        const { onLimitChange, limit, page, count, users } = this.props;
        if (users && users.length > 0) {
            return (
                <div className="user-search-results">
                    <SearchInfo onLimitChange={onLimitChange} limit={limit} page={page} count={count} hideSortBy/>
                    {
                        users.map((user, index) => (
                            <UserSearchResult key={user.id} user={user} index={index}/>
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