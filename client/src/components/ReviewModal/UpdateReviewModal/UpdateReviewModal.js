import React from 'react';
import './UpdateReviewModal.scss';
import {Button, Modal} from 'react-bootstrap';
import MonumentUpdate from '../../Monument/Update/MonumentUpdate';

/**
 * Presentational component for the Modal shown before an UpdateMonumentSuggestion is created
 */
export default class UpdateReviewModal extends React.Component {

    buildUpdate() {
        const {newMonument} = this.props;

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
            },
            deactivatedDate: {
                type: newMonument.deactivatedDateSelectValue,
                newDeactivatedYear: newMonument.newDeactivatedYear,
                newDeactivatedMonth: newMonument.newDeactivatedMonth,
                newDeactivatedDate: newMonument.newDeactivatedDate
            },
            displayDeletedImageNames: true
        };
    }

    render() {
        const {showing, onCancel, onConfirm, oldMonument} = this.props;

        return (
            <Modal
                show={showing}
                onHide={onCancel}
                dialogClassName="update-review-modal-dialog"
            >
                <Modal.Header>
                    <Modal.Title>
                        Review Update
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please review the updates you have made for correctness and completeness!</p>
                    <p>Note: Image fields (Reference URL, Caption, Primary Image) do not show here.</p>
                    <div className="attributes-update-container">
                        <MonumentUpdate oldMonument={oldMonument} update={this.buildUpdate()}/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
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