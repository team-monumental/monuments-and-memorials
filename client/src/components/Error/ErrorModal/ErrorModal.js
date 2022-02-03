import React from 'react';
import './ErrorModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

/**
 * Presentational component for a Modal to nicely display errors to the user in a consistent format
 */
export default class ErrorModal extends React.Component {

    handleClose() {
        const {onClose} = this.props;
        onClose();
    }

    render() {
        const {showing, errorMessage} = this.props;

        let errorMessageDisplay = (
            <div/>
        );

        if (errorMessage) {
            errorMessageDisplay = (
                <p className="font-weight-bold">{errorMessage}</p>
            );
        }

        return (
            <Modal
                show={showing}
                onHide={() => this.handleClose()}
            >
                <Modal.Header
                    closeButton
                    className="error-modal"
                >
                    <Modal.Title>
                        Oops! An error occurred...
                    </Modal.Title>
                </Modal.Header>
                <hr className="error-modal"/>
                <Modal.Body className="error-modal">
                    <p>An error occurred while processing your request.</p>
                    <p>Any additional information we have will be displayed below:</p>
                    {errorMessageDisplay}
                </Modal.Body>
                <Modal.Footer className="error-modal">
                    <Button
                        variant="danger"
                        onClick={() => this.handleClose()}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}