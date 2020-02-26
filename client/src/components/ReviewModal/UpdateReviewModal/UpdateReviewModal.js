import React from 'react';
import './UpdateReviewModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { prettyPrintDate, prettyPrintMonth } from '../../../utils/string-util';
import { getS3ImageNameFromObjectUrl } from '../../../utils/api-util';
import Collapse from 'react-bootstrap/Collapse';

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
     * Done once in this method so we don't have to loop multiple times
     * Stores the changes in an object to return
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

    /**
     * Iterates through the oldMonument's References
     * as well as the newMonument's References to
     * determine the unchanged, added and removed References
     * Done once in this method so we don't have to loop multiple times
     * Stores the changes in an object to return
     */
    collectReferenceChanges() {
        const { oldMonument, newMonument } = this.props;

        let deletedReferences = [];
        let changedReferences = [];
        let unchangedReferences = [];
        let addedReferences = [];

        // Gather changed, unchanged and deleted References
        if (oldMonument.references && oldMonument.references.length) {
            for (const reference of oldMonument.references) {
                // Deleted
                if (newMonument.deletedReferenceIds.includes(reference.id)) {
                    deletedReferences.push(reference.url);
                }
                else {
                    const newReferenceValue = newMonument.updatedReferencesUrlsById[reference.id];

                    // Changed
                    if (reference.url !== newReferenceValue) {
                        changedReferences.push(
                            {
                                oldReferenceValue: reference.url,
                                newReferenceValue
                            }
                        );
                    }
                    // Unchanged
                    else {
                        unchangedReferences.push(reference.url);
                    }
                }
            }
        }

        // Gather added References
        if (newMonument.newReferenceUrls && newMonument.newReferenceUrls) {
            for (const newReferenceUrl of newMonument.newReferenceUrls) {
                if (newReferenceUrl !== '') {
                    addedReferences.push(newReferenceUrl);
                }
            }
        }

        return {
            deletedReferences,
            changedReferences,
            unchangedReferences,
            addedReferences
        };
    }

    handleShowUnchangedAttributesClick() {
        const { showingUnchangedAttributes } = this.state;
        this.setState({showingUnchangedAttributes: !showingUnchangedAttributes});
    }

    renderAttributeChange(attributeLabel, oldAttribute, newAttribute, didChange, isBoolean=false) {
        return (
            <div className="attribute-update">
                <span className="attribute-label">{attributeLabel}:&nbsp;</span>
                {
                    isBoolean ? <span className="old-attribute">{oldAttribute ? 'Yes' : 'No'}</span> :
                        oldAttribute.length ?
                            <span className="old-attribute">{oldAttribute}</span> :
                            <span className="old-attribute none">NONE</span>
                }

                <i className="material-icons">arrow_right_alt</i>
                {
                    isBoolean ? <span className="new-attribute">{newAttribute ? 'Yes' : 'No'}</span> :
                        newAttribute.length ?
                            <span className="new-attribute">{newAttribute}</span> :
                            <span className="new-attribute none">NONE</span>
                }
                {
                    didChange ?
                        <div/> :
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO CHANGES)</span>
                }
            </div>
        );
    }

    renderYearChange(oldYear, newYear, didChange) {
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
                {
                    didChange ?
                        <div/> :
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
                }
            </div>
        );
    }

    renderMonthYearChange(oldYear, oldMonth, newYear, newMonth, didChange) {
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
                {
                    didChange ?
                        <div/> :
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
                }
            </div>
        );
    }

    renderExactDateChange(oldDate, newDate, didChange) {
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
                {
                    didChange ?
                        <div/> :
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
                }
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

    renderUnchangedReferences(unchangedReferences) {
        let unchangedReferenceDisplays = [];

        for (const unchangedReference of unchangedReferences) {
            unchangedReferenceDisplays.push(this.renderReferenceChange(unchangedReference, unchangedReference, false));
        }

        return (
            <div className="changed-references">
                <span className="attribute-label">Unchanged References:&nbsp;</span>
                    <ul className="changed-references-list">{unchangedReferenceDisplays}</ul>
            </div>
        );
    }

    renderChangedReferences(changedReferences) {
        let changedReferenceDisplays = [];

        for (const changedReference of changedReferences) {
            changedReferenceDisplays.push(this.renderReferenceChange(changedReference.oldReferenceValue, changedReference.newReferenceValue, true));
        }

        return (
            <div className="changed-references">
                <span className="attribute-label">Changed References:&nbsp;</span>
                    <ul className="changed-references-list">{changedReferenceDisplays}</ul>
            </div>
        );
    }

    renderReferenceChange(oldReferenceValue, newReferenceValue, didChange) {
        return (
            <li key={newReferenceValue} className="reference-change">
                <span className="old-attribute">{oldReferenceValue}</span>
                <i className="material-icons">arrow_right_alt</i>
                <span className="new-attribute">{newReferenceValue}</span>
                {
                    didChange ?
                        <div/> :
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
                }
            </li>
        );
    }

    renderAddedReferences(addedReferences) {
        let addedReferenceDisplay = [];

        for (const addedReference of addedReferences) {
            addedReferenceDisplay.push(this.renderAddedReference(addedReference));
        }

        return (
            <div className="added-references">
                <span className="attribute-label">Added References:&nbsp;</span>
                {
                    addedReferenceDisplay.length ?
                        <ul className="added-references-list">{addedReferenceDisplay}</ul> :
                        <span className="font-weight-bold">NONE</span>
                }
            </div>
        );
    }

    renderAddedReference(addedReferenceUrl) {
        return (
            <li key={addedReferenceUrl} className="reference added">{addedReferenceUrl}</li>
        );
    }

    renderDeletedReferences(deletedReferences) {
        let deletedReferenceDisplays = [];

        for (const deletedReference of deletedReferences) {
            deletedReferenceDisplays.push(this.renderDeletedReference(deletedReference));
        }

        return (
            <div className="deleted-references">
                <span className="attribute-label">Deleted References:&nbsp;</span>
                {
                    deletedReferenceDisplays.length ?
                        <ul className="deleted-references-list">{deletedReferenceDisplays}</ul> :
                        <span className="font-weight-bold">NONE</span>
                }
            </div>
        );
    }

    renderDeletedReference(deletedReferenceUrl) {
        return (
            <li key={deletedReferenceUrl} className="reference removed">{deletedReferenceUrl}</li>
        );
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

    renderAttributeUpdates() {
        const { showingUnchangedAttributes } = this.state;
        const { oldMonument, newMonument, addedImages } = this.props;

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
                changedAttributes.push(this.renderAttributeChange('Title', oldTitle, newTitle, true)) :
                unchangedAttributes.push(this.renderAttributeChange('Title', oldTitle, newTitle, false));

            /* IsTemporary */
            let oldIsTemporary = oldMonument.isTemporary;
            let newIsTemporary = newMonument.newIsTemporary;
            (oldIsTemporary !== newIsTemporary) ?
                changedAttributes.push(this.renderAttributeChange('Is Temporary', oldIsTemporary, newIsTemporary, true, true)) :
                unchangedAttributes.push(this.renderAttributeChange('Is Temporary', oldIsTemporary, newIsTemporary, false, true));

            /* Artist */
            let oldArtist = oldMonument.artist ? oldMonument.artist : '';
            let newArtist = newMonument.newArtist ? newMonument.newArtist : '';
            (oldArtist !== newArtist) ?
                changedAttributes.push(this.renderAttributeChange('Artist', oldArtist, newArtist, true)) :
                unchangedAttributes.push(this.renderAttributeChange('Artist', oldArtist, newArtist, false));

            /* Date */
            let oldMonumentYear, oldMonumentMonth;

            if (oldMonument.date) {
                const oldMonumentDateArray = oldMonument.date.split('-');
                oldMonumentYear = oldMonumentDateArray[0];
                // Need to make the month 0-based
                oldMonumentMonth = (parseInt(oldMonumentDateArray[1]) - 1).toString()
            }

            switch(newMonument.dateSelectValue) {
                case 'year':
                    (oldMonumentYear !== newMonument.newYear) ?
                        changedAttributes.push(this.renderYearChange(oldMonumentYear, newMonument.newYear, true)) :
                        unchangedAttributes.push(this.renderYearChange(oldMonumentYear, newMonument.newYear, false));
                    break;
                case 'month-year':
                    if (oldMonumentYear !== newMonument.newYear &&
                        oldMonumentMonth !== newMonument.newMonth) {
                        changedAttributes.push(this.renderMonthYearChange(oldMonumentYear, oldMonumentMonth, newMonument.newYear, newMonument.newMonth, true));
                    }
                    else {
                        unchangedAttributes.push(this.renderMonthYearChange(oldMonumentYear, oldMonumentMonth, newMonument.newYear, newMonument.newMonth, false));
                    }
                    break;
                case 'exact-date':
                    (prettyPrintDate(oldMonument.date) !== prettyPrintDate(newMonument.newDate)) ?
                        changedAttributes.push(this.renderExactDateChange(oldMonument.date, newMonument.newDate, true)) :
                        unchangedAttributes.push(this.renderExactDateChange(oldMonument.date, newMonument.newDate, false));
                    break;
                default:
                    break;
            }

            /* Address */
            let oldAddress = oldMonument.address ? oldMonument.address : '';
            let newAddress = newMonument.newAddress ? newMonument.newAddress : '';
            (oldAddress !== newAddress) ?
                changedAttributes.push(this.renderAttributeChange('Address', oldAddress, newAddress, true)) :
                unchangedAttributes.push(this.renderAttributeChange('Address', oldAddress, newAddress, false));

            /* Latitude */
            let oldLatitude = oldMonument.lat ? oldMonument.lat.toString() : '';
            let newLatitude = newMonument.newLatitude ? newMonument.newLatitude : '';
            (oldLatitude !== newLatitude) ?
                changedAttributes.push(this.renderAttributeChange('Latitude', oldLatitude, newLatitude, true)) :
                unchangedAttributes.push(this.renderAttributeChange('Latitude', oldLatitude, newLatitude, false));

            /* Longitude */
            let oldLongitude = oldMonument.lon ? oldMonument.lon.toString() : '';
            let newLongitude = newMonument.newLongitude ? newMonument.newLongitude : '';
            (oldLongitude !== newLongitude) ?
                changedAttributes.push(this.renderAttributeChange('Longitude', oldLongitude, newLongitude, true)) :
                unchangedAttributes.push(this.renderAttributeChange('Longitude', oldLongitude, newLongitude, false));

            /* Description */
            let oldDescription = oldMonument.description ? oldMonument.description : '';
            let newDescription = newMonument.newDescription ? newMonument.newDescription : '';
            (oldDescription !== newDescription) ?
                changedAttributes.push(this.renderAttributeChange('Description', oldDescription, newDescription, true)) :
                unchangedAttributes.push(this.renderAttributeChange('Description', oldDescription, newDescription, false));

            /* Inscription */
            let oldInscription = oldMonument.inscription ? oldMonument.inscription : '';
            let newInscription = newMonument.newInscription ? newMonument.newInscription : '';
            (oldInscription !== newInscription) ?
                changedAttributes.push(this.renderAttributeChange('Inscription', oldInscription, newInscription, true)) :
                unchangedAttributes.push(this.renderAttributeChange('Inscription', oldInscription, newInscription, false));

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
            const referenceChanges = this.collectReferenceChanges();

            if (referenceChanges.unchangedReferences.length) {
                unchangedAttributes.push(this.renderUnchangedReferences(referenceChanges.unchangedReferences));
            }

            if (referenceChanges.changedReferences.length) {
                changedAttributes.push(this.renderChangedReferences(referenceChanges.changedReferences));
            }

            referenceChanges.addedReferences.length ?
                changedAttributes.push(this.renderAddedReferences(referenceChanges.addedReferences)) :
                unchangedAttributes.push(this.renderAddedReferences(referenceChanges.addedReferences));

            referenceChanges.deletedReferences.length ?
                changedAttributes.push(this.renderDeletedReferences(referenceChanges.deletedReferences)) :
                unchangedAttributes.push(this.renderDeletedReferences(referenceChanges.deletedReferences));

            /* Images */
            (addedImages && addedImages.length) ?
                changedAttributes.push(this.renderAddedImages()) :
                unchangedAttributes.push(this.renderAddedImages());

            (newMonument.deletedImageUrls && newMonument.deletedImageUrls.length) ?
                changedAttributes.push(this.renderDeletedImages()) :
                unchangedAttributes.push(this.renderDeletedImages());
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
                <div className="no-attributes-changed-message">
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