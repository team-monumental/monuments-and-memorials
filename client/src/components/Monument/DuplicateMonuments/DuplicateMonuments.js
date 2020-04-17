import React from 'react';
import './DuplicateMonuments.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import SearchResults from '../../Search/SearchResults/SearchResults';

/**
 * Presentational component for the Modal that display any potential duplicate Monuments
 */
export default class DuplicateMonuments extends React.Component {

    render() {
        const { duplicates, onCancel, onConfirm, showing } = this.props;

        console.log(duplicates);

        return (
            <Modal show={showing} onHide={onCancel}>
                <Modal.Header className="duplicate-monuments">
                    <Modal.Title>
                        Potential Duplicate Records Detected!
                    </Modal.Title>
                </Modal.Header>
                <hr className="duplicate-monuments"/>
                <Modal.Body className="duplicate-monuments">
                    <p>
                        We pride ourselves on providing clear and concise data.<br/>
                        As part of this effort, we want to minimize the number of duplicate monument or memorial records
                        we have in our database.<br/><br/>
                        We've detected at least one already existing record that was very similar to the one you're
                        trying to suggest!<br/><br/>
                        Please take a moment to look at these records and determine if they are duplicates. If they are,
                        feel free to update those records instead.<br/><br/>
                        If you feel that these are <span className="font-weight-bold">not</span> duplicates, then you
                        can continue with your suggestion.
                    </p>
                    <div className="duplicates-container">
                        <SearchResults monuments={duplicates} limit={25} page={1} monumentUri={'/monuments'}/>
                    </div>
                </Modal.Body>
                <Modal.Footer className="duplicate-monuments">
                    <Button variant="danger" onClick={onConfirm}>
                        Continue with Suggestion
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}