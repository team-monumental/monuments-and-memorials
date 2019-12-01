import React from 'react';
import './NoImageModal.scss';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/**
 * Presentational component for the Modal shown when no Images are uploaded
 */
export default class NoImageModal extends React.Component {

    render() {
        const { showing, onClose, onCancel, onContinue } = this.props;

        return (
            <Modal
                show={showing}
                onHide={onClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>No Images Uploaded</Modal.Title>
                </Modal.Header>
                <hr/>
                <Modal.Body>
                    <p>We try our best to provide the most informative data on all of our records.</p>
                    <p>As part of this effort, we would really appreciate if you could upload an image of the record you're creating!</p>
                    <p>If you are unable to do so, no worries! It is not required.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='danger'
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='primary'
                        onClick={onContinue}
                    >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}