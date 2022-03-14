import React, {useContext, useState} from 'react';
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {Button, Modal} from "react-bootstrap";

import {deleteMonument} from "../../../../actions/update-monument";
import SearchResultContext from "../../../../utils/search-util";

const SearchResultBtns = ({monumentId}) => {
    const [show, setShow] = useState(false)
    const del = useContext(SearchResultContext)
    const dispatch = useDispatch()

    const confirmDelete = () => {
        dispatch(deleteMonument(monumentId));
        del(monumentId);

        setShow(false);
    }

    return (
        <div className="result-opts">
            <span><i><Link to={`/panel/manage/monuments/monument/update/${monumentId}`} target="_blank"
                           className="material-icons">edit</Link></i></span>
            <span><i className="material-icons" style={{color: "#da6060"}}
                     onClick={() => setShow(true)}>delete</i></span>
            <span><i><Link to={`/monuments/${monumentId}`} style={{color: "#17a2b8"}} target="_blank"
                           className="material-icons">open_in_new</Link></i></span>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Delete Monument?
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Are you sure you want to <strong>permanently</strong> delete this monument or memorial? If you
                        would like to hide it from the public, you may de-activate it instead.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )

}

export default SearchResultBtns