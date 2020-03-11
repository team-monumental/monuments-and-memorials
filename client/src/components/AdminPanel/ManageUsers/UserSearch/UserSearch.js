import * as React from 'react';
import UserSearchBar from './UserSearchBar/UserSearchBar';
import UserSearchResults from './UserSearchResults/UserSearchResults';
import Pagination from '../../../Pagination/Pagination';
import SearchInfo from '../../../Search/SearchInfo/SearchInfo';

export default class UserSearch extends React.Component {

    render() {
        const { showSearchResults, onLimitChange, onPageChange, limit, page, count, users } = this.props;

        const pageCount = Math.ceil(count / limit);

        return (
            <div className="user-search">
                <div className="sticky-top">
                    <UserSearchBar/>
                    {showSearchResults &&
                        <div className="mt-2">
                            <SearchInfo onLimitChange={onLimitChange} limit={limit} page={page} count={count} hideSortBy/>
                        </div>
                    }
                </div>
                {showSearchResults && <>
                    <UserSearchResults limit={limit} page={page} users={users}/>
                    <div className="pagination-container">
                        <Pagination count={pageCount}
                                    page={page - 1}
                                    onPage={page => onPageChange(page + 1)}/>
                    </div>
                </>}
            </div>
        );
    }
}