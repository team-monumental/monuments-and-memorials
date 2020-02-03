import React from 'react';
import './UpdateReviewModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { prettyPrintDate, prettyPrintMonth } from '../../../../utils/string-util';
import { getS3ImageNameFromObjectUrl } from '../../../../utils/api-util';
import Collapse from "react-bootstrap/Collapse";

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
     * Compares oldAttribute to the newAttribute
     * Returns True if the attribute changed, False otherwise
     * @param oldAttribute - Old attribute value to compare
     * @param newAttribute - New attribute value to compare
     */
    didAttributeChange(oldAttribute, newAttribute) {
        return oldAttribute !== newAttribute
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

    renderDateUpdate() {
        const { oldMonument, newMonument, dateSelectValue } = this.props;

        let oldDate = <span className="old-attribute none">NONE</span>;
        let newDate = <span className="new-attribute none">NONE</span>;
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
                    oldDate = <span className="old-attribute">{oldMonumentYear}</span>;
                }

                if (newMonument.newYear && newMonument.newYear.length) {
                    newDate = <span className="new-attribute">{newMonument.newYear}</span>;
                }

                if (oldMonumentYear === newMonument.newYear) {
                    noAttributeChange = (
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
                    );
                }
                break;
            case 'month-year':
                if (oldMonumentMonth) {
                    oldDate = <span className="old-attribute">{`${prettyPrintMonth(oldMonumentMonth)}, ${oldMonumentYear}`}</span>;
                }

                if (newMonument.newMonth && newMonument.newYear && newMonument.newYear.length) {
                    newDate = <span className="new-attribute">{`${prettyPrintMonth(newMonument.newMonth)}, ${newMonument.newYear}`}</span>
                }

                if (oldMonumentYear === newMonument.newYear && oldMonumentMonth === newMonument.newMonth) {
                    noAttributeChange = (
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
                    );
                }
                break;
            case 'exact-date':
                if (oldMonument.date) {
                    oldDate = <span className="old-attribute">{prettyPrintDate(oldMonument.date)}</span>;
                }

                if (newMonument.newDate) {
                    newDate = <span className="old-attribute">{prettyPrintDate(newMonument.newDate)}</span>;
                }

                if (prettyPrintDate(oldMonument.date) === prettyPrintDate(newMonument.newDate)) {
                    noAttributeChange = (
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO  CHANGES)</span>
                    );
                }
                break;
            default:
                break;
        }

        return (
            <div className="attribute-update">
                <span className="attribute-label">Date:&nbsp;</span>
                {oldDate}
                <i className="material-icons">arrow_right_alt</i>
                {newDate}
                {noAttributeChange}
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

    renderTagUpdates() {
        const { oldMonument, newMonument } = this.props;

        let tagUpdates = [];

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

                tagUpdates.push(this.renderUnchangedTags(unchangedMaterials, true));
                tagUpdates.push(this.renderAddedTags(addedMaterials, true));
                tagUpdates.push(this.renderRemovedTags(removedMaterials, true));
            }

            if (newMonument.newTags && newMonument.newTags.length) {
                const addedTags = [];
                const removedTags = [];
                const unchangedTags = [];

                // Find added and unchanged Tags
                for (const newTagName of newMonument.newTags) {
                    if (!oldMonumentTagNames.includes(newTagName)) {
                        addedTags.push(newTagName);
                    }
                    else {
                        unchangedTags.push(newTagName);
                    }
                }

                // Find removed Tags
                for (const oldTagName of oldMonumentTagNames) {
                    if (!newMonument.newTags.includes(oldTagName)) {
                        removedTags.push(oldTagName);
                    }
                }

                tagUpdates.push(this.renderUnchangedTags(unchangedTags, false));
                tagUpdates.push(this.renderAddedTags(addedTags, false));
                tagUpdates.push(this.renderRemovedTags(removedTags, false));
            }
        }

        return tagUpdates;
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
        const { oldMonument, newMonument } = this.props;

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
            this.didAttributeChange(oldTitle, newTitle) ?
                changedAttributes.push(this.renderAttributeChange('Title', oldTitle, newTitle)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Title', oldTitle, newTitle));

            /* Artist */
            let oldArtist = oldMonument.artist ? oldMonument.artist : '';
            let newArtist = newMonument.newArtist ? newMonument.newArtist : '';
            this.didAttributeChange(oldArtist, newArtist) ?
                changedAttributes.push(this.renderAttributeChange('Artist', oldArtist, newArtist)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Artist', oldArtist, newArtist));

            /* Date */
            //attributeUpdates.push(this.renderDateUpdate());

            /* Address */
            let oldAddress = oldMonument.address ? oldMonument.address : '';
            let newAddress = newMonument.newAddress ? newMonument.newAddress : '';
            this.didAttributeChange(oldAddress, newAddress) ?
                changedAttributes.push(this.renderAttributeChange('Address', oldAddress, newAddress)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Address', oldAddress, newAddress));

            /* Latitude */
            let oldLatitude = oldMonument.lat ? oldMonument.lat.toString() : '';
            let newLatitude = newMonument.newLatitude ? newMonument.newLatitude : '';
            this.didAttributeChange(oldLatitude, newLatitude) ?
                changedAttributes.push(this.renderAttributeChange('Latitude', oldLatitude, newLatitude)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Latitude', oldLatitude, newLatitude));

            /* Longitude */
            let oldLongitude = oldMonument.lon ? oldMonument.lon.toString() : '';
            let newLongitude = newMonument.newLongitude ? newMonument.newLongitude : '';
            this.didAttributeChange(oldLongitude, newLongitude) ?
                changedAttributes.push(this.renderAttributeChange('Longitude', oldLongitude, newLongitude)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Longitude', oldLongitude, newLongitude));

            /* Description */
            let oldDescription = oldMonument.description ? oldMonument.description : '';
            let newDescription = newMonument.newDescription ? newMonument.newDescription : '';
            this.didAttributeChange(oldDescription, newDescription) ?
                changedAttributes.push(this.renderAttributeChange('Description', oldDescription, newDescription)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Description', oldDescription, newDescription));

            /* Inscription */
            let oldInscription = oldMonument.inscription ? oldMonument.inscription : '';
            let newInscription = newMonument.newInscription ? newMonument.newInscription : '';
            this.didAttributeChange(oldInscription, newInscription) ?
                changedAttributes.push(this.renderAttributeChange('Inscription', oldInscription, newInscription)) :
                unchangedAttributes.push(this.renderUnchangedAttribute('Inscription', oldInscription, newInscription));

            /* Materials and Tags */
            //attributeUpdates.push(this.renderTagUpdates());

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