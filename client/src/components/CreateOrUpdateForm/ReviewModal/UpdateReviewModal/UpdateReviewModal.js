import React from 'react';
import './UpdateReviewModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { prettyPrintDate, prettyPrintMonth } from '../../../../utils/string-util';
import { getS3ImageNameFromObjectUrl } from '../../../../utils/api-util';
import Collapse from "react-bootstrap/Collapse";
import {isEmptyObject} from "../../../../utils/object-util";

/**
 * Presentational component for the Modal shown before a Monument Update is completed
 */
export default class UpdateReviewModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingUnchangedAttributes: false
        }
    }

    /**
     * Iterates through the oldMonument's Materials and Tags
     * as well as the newMonument's Materials and Tags to
     * determine the unchanged, added and removed Materials and Tags
     * Done once in this method then stored in the state so we don't
     * loop multiple times
     */
    collectTagChanges() {
        const { oldMonument, newMonument } = this.props;

        const unchangedMaterials = [];
        const addedMaterials = [];
        const removedMaterials = [];
        const unchangedTags = [];
        const addedTags = [];
        const removedTags = [];

        if (oldMonument && oldMonument.monumentTags && newMonument) {
            const oldMonumentMaterialNames = [];
            const oldMonumentTagNames = [];

            // Gather the names of the oldMonument's Materials and Tags
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

            // Find the added and unchanged Materials
            if (newMonument.newMaterials && newMonument.newMaterials.length) {
                for (const newMaterialName of newMonument.newMaterials) {
                    if (!oldMonumentMaterialNames.includes(newMaterialName)) {
                        addedMaterials.push(newMaterialName);
                    }
                    else {
                        unchangedMaterials.push(newMaterialName);
                    }
                }

                // Find the removed Materials
                for (const oldMaterialName of oldMonumentMaterialNames) {
                    if (!newMonument.newMaterials.includes(oldMaterialName)) {
                        removedMaterials.push(oldMaterialName);
                    }
                }
            }

            // Find the added and unchanged Tags
            if (newMonument.newTags && newMonument.newTags.length) {
                for (const newTagName of newMonument.newTags) {
                    if (!oldMonumentTagNames.includes(newTagName)) {
                        addedTags.push(newTagName);
                    }
                    else {
                        unchangedTags.push(newTagName);
                    }
                }

                // Find the removed Tags
                for (const oldTagName of oldMonumentTagNames) {
                    if (!newMonument.newTags.includes(oldTagName)) {
                        removedTags.push(oldTagName);
                    }
                }
            }
        }

        return {
            unchangedMaterials,
            addedMaterials,
            removedMaterials,
            unchangedTags,
            addedTags,
            removedTags
        };
    }

    handleShowUnchangedAttributesClick() {
        const { showingUnchangedAttributes } = this.state;
        this.setState({showingUnchangedAttributes: !showingUnchangedAttributes});
    }

    renderAttributeChange(attributeLabel, oldAttribute, newAttribute) {
        return (
            <div className="attribute-update">
                <span className="attribute-label">{attributeLabel}:&nbsp;</span>
                {
                    oldAttribute.length ?
                        <span className="old-attribute">{oldAttribute}</span> :
                        <span className="old-attribute none">NONE</span>
                }
                <i className="material-icons">arrow_right_alt</i>
                {
                    newAttribute.length ?
                        <span className="new-attribute">{newAttribute}</span> :
                        <span className="new-attribute none">NONE</span>
                }
            </div>
        );
    }

    renderUnchangedAttribute(attributeLabel, oldAttribute, newAttribute) {
        return (
            <div className="attribute-update">
                <span className="attribute-label">{attributeLabel}:&nbsp;</span>
                {
                    oldAttribute.length ?
                        <span className="old-attribute">{oldAttribute}</span> :
                        <span className="old-attribute none">NONE</span>
                }
                <i className="material-icons">arrow_right_alt</i>
                {
                    newAttribute.length ?
                        <span className="new-attribute">{newAttribute}</span> :
                        <span className="new-attribute none">NONE</span>
                }
                <span className="no-attribute-change font-weight-bold">&nbsp;(NO CHANGES)</span>
            </div>
        );
    }

    renderYearChange(oldYear, newYear) {
        let oldYearDisplay = <span className="old-attribute none">NONE</span>;
        let newYearDisplay = <span className="new-attribute none">NONE</span>;

        if (oldYear) {
            oldYearDisplay = <span className="old-attribute">{oldYear}</span>;
        }

        if (newYear && newYear.length) {
            newYearDisplay = <span className="new-attribute">{newYear}</span>;
        }

        return (
            <div className="attribute-update">
                <span className="attribute-label">Date:&nbsp;</span>
                {oldYearDisplay}
                <i className="material-icons">arrow_right_alt</i>
                {newYearDisplay}
            </div>
        );
    }

    renderUnchangedYear(oldYear, newYear) {
        let oldYearDisplay = <span className="old-attribute none">NONE</span>;
        let newYearDisplay = <span className="new-attribute none">NONE</span>;

        if (oldYear) {
            oldYearDisplay = <span className="old-attribute">{oldYear}</span>;
        }

        if (newYear && newYear.length) {
            newYearDisplay = <span className="new-attribute">{newYear}</span>;
        }

        return (
            <div className="attribute-update">
                <span className="attribute-label">Date:&nbsp;</span>
                {oldYearDisplay}
                <i className="material-icons">arrow_right_alt</i>
                {newYearDisplay}
                <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
            </div>
        );
    }

    renderMonthYearChange(oldYear, oldMonth, newYear, newMonth) {
        let oldMonthYearDisplay = <span className="old-attribute none">NONE</span>;
        let newMonthYearDisplay = <span className="new-attribute none">NONE</span>;

        if (oldMonth) {
            oldMonthYearDisplay = <span className="old-attribute">{`${prettyPrintMonth(oldMonth)}, ${oldYear}`}</span>;
        }

        if (newMonth && newYear && newYear.length) {
            newMonthYearDisplay = <span className="new-attribute">{`${prettyPrintMonth(newMonth)}, ${newYear}`}</span>
        }

        return (
            <div className="attribute-update">
                <span className="attribute-label">Date:&nbsp;</span>
                {oldMonthYearDisplay}
                <i className="material-icons">arrow_right_alt</i>
                {newMonthYearDisplay}
            </div>
        );
    }

    renderUnchangedMonthYear(oldYear, oldMonth, newYear, newMonth) {
        let oldMonthYearDisplay = <span className="old-attribute none">NONE</span>;
        let newMonthYearDisplay = <span className="new-attribute none">NONE</span>;

        if (oldMonth) {
            oldMonthYearDisplay = <span className="old-attribute">{`${prettyPrintMonth(oldMonth)}, ${oldYear}`}</span>;
        }

        if (newMonth && newYear && newYear.length) {
            newMonthYearDisplay = <span className="new-attribute">{`${prettyPrintMonth(newMonth)}, ${newYear}`}</span>
        }

        return (
            <div className="attribute-update">
                <span className="attribute-label">Date:&nbsp;</span>
                {oldMonthYearDisplay}
                <i className="material-icons">arrow_right_alt</i>
                {newMonthYearDisplay}
                <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
            </div>
        );
    }

    renderExactDateChange(oldDate, newDate) {
        let oldDateDisplay = <span className="old-attribute none">NONE</span>;
        let newDateDisplay = <span className="new-attribute none">NONE</span>;

        if (oldDate) {
            oldDateDisplay = <span className="old-attribute">{prettyPrintDate(oldDate)}</span>;
        }

        if (newDate) {
            newDateDisplay = <span className="old-attribute">{prettyPrintDate(newDate)}</span>;
        }

        return (
            <div className="attribute-update">
                <span className="attribute-label">Date:&nbsp;</span>
                {oldDateDisplay}
                <i className="material-icons">arrow_right_alt</i>
                {newDateDisplay}
            </div>
        );
    }

    renderUnchangedExactDate(oldDate, newDate) {
        let oldDateDisplay = <span className="old-attribute none">NONE</span>;
        let newDateDisplay = <span className="new-attribute none">NONE</span>;

        if (oldDate) {
            oldDateDisplay = <span className="old-attribute">{prettyPrintDate(oldDate)}</span>;
        }

        if (newDate) {
            newDateDisplay = <span className="old-attribute">{prettyPrintDate(newDate)}</span>;
        }

        return (
            <div className="attribute-update">
                <span className="attribute-label">Date:&nbsp;</span>
                {oldDateDisplay}
                <i className="material-icons">arrow_right_alt</i>
                {newDateDisplay}
                <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
            </div>
        );
    }

    renderUnchangedTags(unchangedTags, areMaterials) {
        let unchangedTagsDisplay = <span className="font-weight-bold">NONE</span>;

        if (unchangedTags && unchangedTags.length) {
            unchangedTagsDisplay = (
                <ul className={areMaterials ? 'unchanged-materials-list' : 'unchanged-tags-list'}>
                    {unchangedTags.map(unchangedTag => <li key={unchangedTag}>{unchangedTag}</li>)}
                </ul>
            );
        }

        return (
            <div className={areMaterials ? 'unchanged-materials' : 'unchanged-tags'}>
                <span className="attribute-label">{areMaterials ? 'Unchanged Materials:' : 'Unchanged Tags:'}&nbsp;</span>
                {unchangedTagsDisplay}
            </div>
        );
    }

    renderAddedTags(addedTags, areMaterials) {
        let addedTagsDisplay = <span className="font-weight-bold">NONE</span>;

        if (addedTags && addedTags.length) {
            addedTagsDisplay = (
                <ul className={areMaterials ? 'added-materials-list' : 'added-tags-list'}>
                    {addedTags.map(addedTag => <li className="added" key={addedTag}>{addedTag}</li>)}
                </ul>
            );
        }

        return (
            <div className={areMaterials ? 'added-materials' : 'added-tags'}>
                <span className="attribute-label">{areMaterials ? 'Added Materials:' : 'Added Tags:'}&nbsp;</span>
                {addedTagsDisplay}
            </div>
        );
    }

    renderRemovedTags(removedTags, areMaterials) {
        let removedTagsDisplay = <span className="font-weight-bold">NONE</span>;

        if (removedTags && removedTags.length) {
            removedTagsDisplay = (
                <ul className={areMaterials ? 'removed-materials-list' : 'removed-tags-list'}>
                    {removedTags.map(removedTag => <li className="removed" key={removedTag}>{removedTag}</li>)}
                </ul>
            );
        }

        return (
            <div className={areMaterials ? 'removed-materials' : 'removed-tags'}>
                <span className="attribute-label">{areMaterials ? 'Removed Materials:' : 'Removed Tags:'}&nbsp;</span>
                {removedTagsDisplay}
            </div>
        );
    }

    renderReferenceUpdate(oldReferenceValue, newReferenceValue) {
        return (
            <li key={newReferenceValue} className="reference-update">
                <span className="old-attribute">{oldReferenceValue}</span>
                <i className="material-icons">arrow_right_alt</i>
                <span className="new-attribute">{newReferenceValue}</span>
                {
                    oldReferenceValue === newReferenceValue ?
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span> :
                        <div/>
                }
            </li>
        );
    }

    renderAddedReference(addedReferenceUrl) {
        return (
            <li key={addedReferenceUrl} className="reference added">{addedReferenceUrl}</li>
        );
    }

    renderDeletedReference(deletedReferenceUrl) {
        return (
            <li key={deletedReferenceUrl} className="reference removed">{deletedReferenceUrl}</li>
        );
    }

    renderReferenceUpdates() {
        const { oldMonument, newMonument } = this.props;

        let referenceUpdates = [];
        let deletedReferenceValues = [];

        // Changed Reference URLs
        if (oldMonument.references && oldMonument.references.length) {
            const changedReferences = [];

            // While we're looping, gather the deleted Reference values as well
            for (const reference of oldMonument.references) {
                if (newMonument.deletedReferenceIds.includes(reference.id)) {
                    deletedReferenceValues.push(reference.url);
                }
                else {
                    const newReferenceValue = newMonument.updatedReferencesUrlsById[reference.id];

                    if (reference.url !== newReferenceValue) {
                        changedReferences.push(this.renderReferenceUpdate(reference.url, newReferenceValue));
                    }
                }
            }

            let changedReferencesDisplay = (
                <div className="updated-references">
                    <span className="attribute-label">Updated References:&nbsp;</span>
                    {
                        changedReferences.length ?
                            <ul className="reference-update-list">{changedReferences}</ul> :
                            <span className="font-weight-bold">NONE</span>
                    }
                </div>
            );

            referenceUpdates.push(changedReferencesDisplay);
        }

        // Added References
        if (newMonument.newReferenceUrls && newMonument.newReferenceUrls) {
            const addedReferences = [];

            for (const newReferenceUrl of newMonument.newReferenceUrls) {
                addedReferences.push(this.renderAddedReference(newReferenceUrl));
            }

            let addedReferencesDisplay = (
                <div className="added-references">
                    <span className="attribute-label">Added References:&nbsp;</span>
                    {
                        addedReferences.length ?
                            <ul className="added-references-list">{addedReferences}</ul> :
                            <span className="font-weight-bold">NONE</span>
                    }
                </div>
            );

            referenceUpdates.push(addedReferencesDisplay);
        }

        // Deleted References
        let deletedReferencesDisplay = <span className="font-weight-bold">NONE</span>;

        if (deletedReferenceValues.length) {
            let deletedReferences = [];

            for (const deletedReferenceValue of deletedReferenceValues) {
                deletedReferences.push(this.renderDeletedReference(deletedReferenceValue));
            }

            deletedReferencesDisplay = (
                <ul className="deleted-references-list">{deletedReferences}</ul>
            );
        }

        referenceUpdates.push(
            <div className="deleted-references">
                <span className="attribute-label">Deleted References:&nbsp;</span>
                {deletedReferencesDisplay}
            </div>
        );

        return referenceUpdates;
    }

    renderAddedImages() {
        const { addedImages } = this.props;

        let addedImagesDisplay = <span className="font-weight-bold">NONE</span>;

        if (addedImages && addedImages.length) {
            let addedImagesList = [];

            for (const addedImage of addedImages) {
                addedImagesList.push(<li className="added" key={addedImage.name}>{addedImage.name}</li>);
            }

            addedImagesDisplay = <ul className="added-images-list">{addedImagesList}</ul>;
        }

        return (
            <div className="added-images">
                <span className="attribute-label">Added Images:&nbsp;</span>
                {addedImagesDisplay}
            </div>
        );
    }

    renderDeletedImages() {
        const { newMonument } = this.props;

        let deletedImagesDisplay = <span className="font-weight-bold">NONE</span>;

        if (newMonument.deletedImageUrls && newMonument.deletedImageUrls.length) {
            let deletedImagesList = [];

            for (const deletedImageUrl of newMonument.deletedImageUrls) {
                deletedImagesList.push(
                    <li className="removed" key={deletedImageUrl}>{getS3ImageNameFromObjectUrl(deletedImageUrl)}</li>
                );
            }

            deletedImagesDisplay = <ul className="deleted-images-list">{deletedImagesList}</ul>;
        }

        return (
            <div className="deleted-images">
                <span className="attribute-label">Deleted Images:&nbsp;</span>
                {deletedImagesDisplay}
            </div>
        );
    }

    renderImageUpdates() {
        let imageUpdates = [];

        imageUpdates.push(this.renderAddedImages());
        imageUpdates.push(this.renderDeletedImages());

        return imageUpdates;
    }

    renderAttributeUpdates() {
        const { showingUnchangedAttributes } = this.state;
        const { oldMonument, newMonument, dateSelectValue } = this.props;

        const showUnchangedAttributesLink = (
            <div className="show-unchanged-changes-link"
                 onClick={() => this.handleShowUnchangedAttributesClick()}>
                Show Unchanged Attributes
            </div>
        );

        const hideUnchangedAttributesLink = (
            <div className="show-unchanged-changes-link"
                 onClick={() => this.handleShowUnchangedAttributesClick()}>
                Hide Unchanged Attributes
            </div>
        );

        let changedAttributes = [];
        let unchangedAttributes = [];

        if (oldMonument && newMonument) {
            /* Title */
            let oldTitle = oldMonument.title ? oldMonument.title : '';
            let newTitle = newMonument.newTitle ? newMonument.newTitle : '';
            (oldTitle !== newTitle) ?
                changedAttributes.push(this.renderAttributeChange('Title', oldTitle, newTitle)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Title', oldTitle, newTitle));

            /* Artist */
            let oldArtist = oldMonument.artist ? oldMonument.artist : '';
            let newArtist = newMonument.newArtist ? newMonument.newArtist : '';
            (oldArtist !== newArtist) ?
                changedAttributes.push(this.renderAttributeChange('Artist', oldArtist, newArtist)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Artist', oldArtist, newArtist));

            /* Date */
            let oldMonumentYear, oldMonumentMonth;

            if (oldMonument.date) {
                const oldMonumentDateArray = oldMonument.date.split('-');
                oldMonumentYear = oldMonumentDateArray[0];
                // Need to make the month 0-based
                oldMonumentMonth = (parseInt(oldMonumentDateArray[1]) - 1).toString()
            }

            switch(dateSelectValue) {
                case 'year':
                    (oldMonumentYear !== newMonument.newYear) ?
                        changedAttributes.push(this.renderYearChange(oldMonumentYear, newMonument.newYear)) :
                        unchangedAttributes.push(this.renderUnchangedYear(oldMonumentYear, newMonument.newYear));
                    break;
                case 'month-year':
                    if (oldMonumentYear !== newMonument.newYear &&
                        oldMonumentMonth !== newMonument.newMonth) {
                        changedAttributes.push(this.renderMonthYearChange(oldMonumentYear, oldMonumentMonth, newMonument.newYear, newMonument.newMonth));
                    }
                    else {
                        unchangedAttributes.push(this.renderUnchangedMonthYear(oldMonumentYear, oldMonumentMonth, newMonument.newYear, newMonument.newMonth));
                    }
                    break;
                case 'exact-date':
                    (prettyPrintDate(oldMonument.date) !== prettyPrintDate(newMonument.newDate)) ?
                        changedAttributes.push(this.renderExactDateChange(oldMonument.date, newMonument.newDate)) :
                        unchangedAttributes.push(this.renderUnchangedExactDate(oldMonument.date, newMonument.newDate));
                    break;
                default:
                    break;
            }

            /* Address */
            let oldAddress = oldMonument.address ? oldMonument.address : '';
            let newAddress = newMonument.newAddress ? newMonument.newAddress : '';
            (oldAddress !== newAddress) ?
                changedAttributes.push(this.renderAttributeChange('Address', oldAddress, newAddress)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Address', oldAddress, newAddress));

            /* Latitude */
            let oldLatitude = oldMonument.lat ? oldMonument.lat.toString() : '';
            let newLatitude = newMonument.newLatitude ? newMonument.newLatitude : '';
            (oldLatitude !== newLatitude) ?
                changedAttributes.push(this.renderAttributeChange('Latitude', oldLatitude, newLatitude)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Latitude', oldLatitude, newLatitude));

            /* Longitude */
            let oldLongitude = oldMonument.lon ? oldMonument.lon.toString() : '';
            let newLongitude = newMonument.newLongitude ? newMonument.newLongitude : '';
            (oldLongitude !== newLongitude) ?
                changedAttributes.push(this.renderAttributeChange('Longitude', oldLongitude, newLongitude)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Longitude', oldLongitude, newLongitude));

            /* Description */
            let oldDescription = oldMonument.description ? oldMonument.description : '';
            let newDescription = newMonument.newDescription ? newMonument.newDescription : '';
            (oldDescription !== newDescription) ?
                changedAttributes.push(this.renderAttributeChange('Description', oldDescription, newDescription)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Description', oldDescription, newDescription));

            /* Inscription */
            let oldInscription = oldMonument.inscription ? oldMonument.inscription : '';
            let newInscription = newMonument.newInscription ? newMonument.newInscription : '';
            (oldInscription !== newInscription) ?
                changedAttributes.push(this.renderAttributeChange('Inscription', oldInscription, newInscription)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Inscription', oldInscription, newInscription));

            /* Materials and Tags */
            const tagChanges = this.collectTagChanges();

            unchangedAttributes.push(this.renderUnchangedTags(tagChanges.unchangedMaterials, true));

            tagChanges.addedMaterials.length ?
                changedAttributes.push(this.renderAddedTags(tagChanges.addedMaterials, true)) :
                unchangedAttributes.push(this.renderAddedTags(tagChanges.addedMaterials, true));

            tagChanges.removedMaterials.length ?
                changedAttributes.push(this.renderRemovedTags(tagChanges.removedMaterials, true)) :
                unchangedAttributes.push(this.renderRemovedTags(tagChanges.removedMaterials, true));

            unchangedAttributes.push(this.renderUnchangedTags(tagChanges.unchangedTags, false));

            tagChanges.addedTags.length ?
                changedAttributes.push(this.renderAddedTags(tagChanges.addedTags, false)) :
                unchangedAttributes.push(this.renderAddedTags(tagChanges.addedTags, false));

            tagChanges.removedTags.length ?
                changedAttributes.push(this.renderRemovedTags(tagChanges.removedTags, false)) :
                unchangedAttributes.push(this.renderRemovedTags(tagChanges.removedTags, false));

            /* References */
            //attributeUpdates.push(this.renderReferenceUpdates());

            /* Images */
            //attributeUpdates.push(this.renderImageUpdates());
        }

        if (!changedAttributes.length) {
            changedAttributes = (
                <div className="no-attributes-changed-message">
                    No attributes changed!
                </div>
            );
        }

        if (!unchangedAttributes.length) {
            unchangedAttributes = (
                <div className='no-attributes-changed-message'>
                    No unchanged attributes!
                </div>
            );
        }

        return (
            <div className="attributes-updates">
                <div className="changed-attributes">
                    {changedAttributes}
                </div>
                <Collapse in={showingUnchangedAttributes}>
                    <div className="unchanged-attributes">
                        <hr className="unchanged-attributes-divider"/>
                        {unchangedAttributes}
                    </div>
                </Collapse>

                {!showingUnchangedAttributes && showUnchangedAttributesLink}
                {showingUnchangedAttributes && hideUnchangedAttributesLink}
            </div>
        );
    }

    render() {
        const { showing, onCancel, onConfirm } = this.props;

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
                <hr className="update-review-modal"/>
                <Modal.Body className="update-review-modal">
                    <p>Please review the updates you have made for correctness and completeness!</p>
                    <div className="attributes-update-container">
                        {this.renderAttributeUpdates()}
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