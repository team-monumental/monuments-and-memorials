import React from 'react';
import './NoImageModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

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
                <Modal.Header className="no-image-modal">
                    <Modal.Title>No Images Uploaded</Modal.Title>
                </Modal.Header>
                <hr className="no-image-modal"/>
                <Modal.Body className="no-image-modal">
                    <p>We try our best to provide the most informative data on all of our records.</p>
                    <p>As part of this effort, we would really appreciate if you could upload an image of the record you're suggesting!</p>
                    <p>If you are unable to do so, no worries! It is not required.</p>
                </Modal.Body>
                <Modal.Footer className="no-image-modal">
                    <Button
                        variant="primary"
                        onClick={onCancel}
                        className="no-image-modal"
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onContinue}
                        className="no-image-modal"
                    >
                        Continue Anyway
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}