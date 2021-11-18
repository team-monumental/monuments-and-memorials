import React from 'react';

const SearchResultBtns = ({edit, del, open}) => {
    return (
        <div className="result-opts">
            <span><i className="material-icons" onClick={() => edit()}>edit</i></span>
            <span><i className="material-icons" onClick={() => del()}>delete</i></span>
            <span><i className="material-icons" onClick={() => open()}>open_in_new</i></span>
        </div>
    )
}

export default SearchResultBtns
