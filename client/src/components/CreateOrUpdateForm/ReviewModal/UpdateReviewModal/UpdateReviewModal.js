import React from 'react';
import './UpdateReviewModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { prettyPrintDate } from '../../../../utils/string-util';

/**
 * Presentational component for the Modal shown before a Monument Update is completed
 */
export default class UpdateReviewModal extends React.Component {

    render() {
        const { showing, onCancel, onConfirm, oldMonument, newMonument } = this.props;

        return (
            <Modal
                show={showing}
                onHide={onCancel}
            >
                <Modal.Header className='update-review-modal'>
                    <Modal.Title>
                        Review Update
                    </Modal.Title>
                </Modal.Header>
                <hr className='update-review-modal'/>
                <Modal.Body className='update-review-modal'>
                    <p>Please review the updates you have made for correctness and completeness!</p>
                    <div className='attributes-update-container'>
                        <div className='attribute-update'>
                            <span className='attribute-label'>Title:&nbsp;</span>
                            <span className='old-attribute'>
                                {oldMonument ? oldMonument.title : ''}
                            </span>
                            <i className='material-icons'>arrow_right_alt</i>
                            <span className='new-attribute'>
                                {newMonument ? newMonument.newTitle : ''}
                            </span>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}