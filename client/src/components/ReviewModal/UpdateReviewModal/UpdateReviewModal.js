import React from 'react';
import './UpdateReviewModal.scss';
import { Modal, Button } from 'react-bootstrap';
import MonumentUpdate from '../../Monument/Update/MonumentUpdate';

/**
 * Presentational component for the Modal shown before an UpdateMonumentSuggestion is created
 */
export default class UpdateReviewModal extends React.Component {

    buildUpdate() {
        const { newMonument } = this.props;

        if (!newMonument) {
            return {};
        }

        return {
            ...newMonument,
            date: {
                type: newMonument.dateSelectValue,
                newYear: newMonument.newYear,
                newMonth: newMonument.newMonth,
                newDate: newMonument.newDate
            }
        };
    }

    render() {
        const { showing, onCancel, onConfirm, oldMonument  } = this.props;

        return (
            <Modal
                show={showing}
                onHide={onCancel}
                dialogClassName="update-review-modal-dialog"
            >
                <Modal.Header className="update-review-modal">
                    <Modal.Title>
                        Review Update
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="update-review-modal">
                    <p>Please review the updates you have made for correctness and completeness!</p>
                    <div className="attributes-update-container">
                        <MonumentUpdate oldMonument={oldMonument} update={this.buildUpdate()}/>
                    </div>
                </Modal.Body>
                <Modal.Footer className="update-review-modal">
                    <Button
                        variant="danger"
                        onClick={onCancel}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}