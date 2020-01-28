import React from 'react';
import './UpdateReviewModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { prettyPrintDate, prettyPrintMonth } from '../../../../utils/string-util';

/**
 * Presentational component for the Modal shown before a Monument Update is completed
 */
export default class UpdateReviewModal extends React.Component {

    renderAttributeUpdate(attributeLabel, oldAttribute, newAttribute) {
        return (
            <div className='attribute-update'>
                <span className='attribute-label'>{attributeLabel}:&nbsp;</span>
                {
                    oldAttribute.length ?
                        <span className='old-attribute'>{oldAttribute}</span> :
                        <span className='old-attribute none'>NONE</span>
                }
                <i className='material-icons'>arrow_right_alt</i>
                {
                    newAttribute.length ?
                        <span className='new-attribute'>{newAttribute}</span> :
                        <span className='new-attribute none'>NONE</span>
                }
                {
                    oldAttribute === newAttribute ?
                        <span className='no-attribute-change font-weight-bold'>&nbsp;(NO  CHANGES)</span> :
                        <div/>
                }
            </div>
        );
    }

    renderDateUpdate() {
        const { oldMonument, newMonument, dateSelectValue } = this.props;

        let oldDate = <span className='old-attribute none'>NONE</span>;
        let newDate = <span className='new-attribute none'>NONE</span>;
        let noAttributeChange = <div/>;

        let oldMonumentYear, oldMonumentMonth;

        if (oldMonument.date) {
            const oldMonumentDateArray = oldMonument.date.split('-');
            oldMonumentYear = oldMonumentDateArray[0];
            // Need to make the month 0-based
            oldMonumentMonth = (parseInt(oldMonumentDateArray[1]) - 1).toString()
        }

        switch (dateSelectValue) {
            case 'year':
                if (oldMonumentYear) {
                    oldDate = <span className='old-attribute'>{oldMonumentYear}</span>;
                }

                if (newMonument.newYear && newMonument.newYear.length) {
                    newDate = <span className='new-attribute'>{newMonument.newYear}</span>;
                }

                if (oldMonumentYear === newMonument.newYear) {
                    noAttributeChange = (
                        <span className='no-attribute-change font-weight-bold'>&nbsp;(NO  CHANGES)</span>
                    );
                }
                break;
            case 'month-year':
                if (oldMonumentMonth) {
                    oldDate = <span className='old-attribute'>{`${prettyPrintMonth(oldMonumentMonth)}, ${oldMonumentYear}`}</span>;
                }

                if (newMonument.newMonth && newMonument.newYear && newMonument.newYear.length) {
                    newDate = <span className='new-attribute'>{`${prettyPrintMonth(newMonument.newMonth)}, ${newMonument.newYear}`}</span>
                }

                if (oldMonumentYear === newMonument.newYear && oldMonumentMonth === newMonument.newMonth) {
                    noAttributeChange = (
                        <span className='no-attribute-change font-weight-bold'>&nbsp;(NO  CHANGES)</span>
                    );
                }
                break;
            case 'exact-date':
                if (oldMonument.date) {
                    oldDate = <span className='old-attribute'>{prettyPrintDate(oldMonument.date)}</span>;
                }

                if (newMonument.newDate) {
                    newDate = <span className='old-attribute'>{prettyPrintDate(newMonument.newDate)}</span>;
                }

                if (prettyPrintDate(oldMonument.date) === prettyPrintDate(newMonument.newDate)) {
                    noAttributeChange = (
                        <span className='no-attribute-change font-weight-bold'>&nbsp;(NO  CHANGES)</span>
                    );
                }
                break;
            default:
                break;
        }

        return (
            <div className='attribute-update'>
                <span className='attribute-label'>Date:&nbsp;</span>
                {oldDate}
                <i className='material-icons'>arrow_right_alt</i>
                {newDate}
                {noAttributeChange}
            </div>
        );
    }

    renderTagUpdates() {
        const { oldMonument, newMonument } = this.props;

        if (oldMonument && oldMonument.monumentTags && newMonument) {
            const oldMonumentMaterialNames = [];
            const oldMonumentTagNames = [];

            for (const monumentTag of oldMonument.monumentTags) {
                if (monumentTag.tag) {
                    if (monumentTag.tag.isMaterial) {
                        oldMonumentMaterialNames.push(monumentTag.tag.name);
                    }
                    else {
                        oldMonumentTagNames.push(monumentTag.tag.name);
                    }
                }
            }

            if (newMonument.newMaterials && newMonument.newMaterials.length) {
                const addedMaterials = [];
                const removedMaterials = [];
                const unchangedMaterials = [];

                // Find added and unchanged Materials
                for (const newMaterialName of newMonument.newMaterials) {
                    if (!oldMonumentMaterialNames.includes(newMaterialName)) {
                        addedMaterials.push(newMaterialName);
                    }
                    else {
                        unchangedMaterials.push(newMaterialName);
                    }
                }

                // Find removed Materials
                for (const oldMaterialName of oldMonumentMaterialNames) {
                    if (!newMonument.newMaterials.includes(oldMaterialName)) {
                        removedMaterials.push(oldMaterialName);
                    }
                }
            }
        }
    }

    renderAttributeUpdates() {
        const { oldMonument, newMonument } = this.props;

        let attributeUpdates = [];

        if (oldMonument && newMonument) {
            /* Title */
            let oldTitle = oldMonument.title ? oldMonument.title : '';
            let newTitle = newMonument.newTitle ? newMonument.newTitle : '';
            attributeUpdates.push(this.renderAttributeUpdate('Title', oldTitle, newTitle));

            /* Artist */
            let oldArtist = oldMonument.artist ? oldMonument.artist : '';
            let newArtist = newMonument.newArtist ? newMonument.newArtist : '';
            attributeUpdates.push(this.renderAttributeUpdate('Artist', oldArtist, newArtist));

            /* Date */
            attributeUpdates.push(this.renderDateUpdate());

            /* Address */
            let oldAddress = oldMonument.address ? oldMonument.address : '';
            let newAddress = newMonument.newAddress ? newMonument.newAddress : '';
            attributeUpdates.push(this.renderAttributeUpdate('Address', oldAddress, newAddress));

            /* Latitude */
            let oldLatitude = oldMonument.lat ? oldMonument.lat.toString() : '';
            let newLatitude = newMonument.newLatitude ? newMonument.newLatitude : '';
            attributeUpdates.push(this.renderAttributeUpdate('Latitude', oldLatitude, newLatitude));

            /* Longitude */
            let oldLongitude = oldMonument.lon ? oldMonument.lon.toString() : '';
            let newLongitude = newMonument.newLongitude ? newMonument.newLongitude : '';
            attributeUpdates.push(this.renderAttributeUpdate('Longitude', oldLongitude, newLongitude));

            /* Description */
            let oldDescription = oldMonument.description ? oldMonument.description : '';
            let newDescription = newMonument.newDescription ? newMonument.newDescription : '';
            attributeUpdates.push(this.renderAttributeUpdate('Description', oldDescription, newDescription));

            /* Inscription */
            let oldInscription = oldMonument.inscription ? oldMonument.inscription : '';
            let newInscription = newMonument.newInscription ? newMonument.newInscription : '';
            attributeUpdates.push(this.renderAttributeUpdate('Inscription', oldInscription, newInscription));

            /* Materials and Tags */
            attributeUpdates.push(this.renderTagUpdates())
        }

        return attributeUpdates;
    }

    render() {
        const { showing, onCancel, onConfirm } = this.props;

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
                        {this.renderAttributeUpdates()}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='danger'
                        onClick={onCancel}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant='primary'
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}