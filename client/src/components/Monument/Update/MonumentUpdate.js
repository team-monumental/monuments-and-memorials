import * as React from 'react';
import './MonumentUpdate.scss';
import AttributeChange from './AttributeChange/AttributeChange';
import {DateFormat, prettyPrintDate} from '../../../utils/string-util';
import UnchangedTags from './TagChanges/UnchangedTags/UnchangedTags';
import AddedTags from './TagChanges/AddedTags/AddedTags';
import RemovedTags from './TagChanges/RemovedTags/RemovedTags';
import ReferenceChanges from './References/ReferenceChanges/ReferenceChanges';
import AddedReferences from './References/AddedReferences/AddedReferences';
import DeletedReferences from './References/DeletedReferences/DeletedReferences';
import AddedImages from './Images/AddedImages/AddedImages';
import DeletedImages from './Images/DeletedImages/DeletedImages';
import AddedPhotoSphereImages from './Images/AddedPhotoSphereImages/AddedPhotoSphereImages';
import DeletedPhotoSphereImages from './Images/DeletedPhotoSphereImages/DeletedPhotoSphereImages';
import { Collapse } from 'react-bootstrap';

/**
 * Presentational component for displaying changes to a Monument
 */
export default class MonumentUpdate extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingAllChangedAttributes: props.expandedByDefault || false,
            showingUnchangedAttributes: false
        };
    }

    /**
     * Determine if the specified oldAttribute is different from the specified newAttribute
     * @param oldAttribute - String for the old attribute to compare
     * @param newAttribute - String for the new attribute to compare
     * @returns {boolean} - True if the oldAttribute is different from the newAttribute, False otherwise
     */
    didAttributeChange(oldAttribute, newAttribute) {
        oldAttribute = oldAttribute ? oldAttribute : '';
        newAttribute = newAttribute ? newAttribute : '';

        return oldAttribute !== newAttribute;
    }

    /**
     * Determine if the specified oldValue is different from the specified newValue
     * @param oldValue - Old boolean value to compare
     * @param newValue - New boolean value to compare
     * @returns {boolean} - True if the oldValue is different from the newValue, False otherwise
     */
    didBooleanChange(oldValue, newValue) {
        return !!oldValue !== !!newValue;
    }

    determineNewDate() {
        const { update } = this.props;

        switch (update.date.type) {
            case DateFormat.YEAR:
                if (update.date.newYear) {
                    return prettyPrintDate(`${update.date.newYear}`, update.date.type);
                }
                return undefined;
            case DateFormat.MONTH_YEAR:
                if (update.date.newYear) {
                    const month = (parseInt(update.date.newMonth) + 1).toString();
                    return prettyPrintDate(`${update.date.newYear}-${month}`, update.date.type);
                }
                return undefined;
            case DateFormat.EXACT_DATE:
                return prettyPrintDate(update.date.newDate, update.date.type);
            default:
                return undefined;
        }
    }

    determineNewDeactivatedDate() {
        const { update } = this.props;

        switch (update.deactivatedDate.type) {
            case DateFormat.YEAR:
                if (update.deactivatedDate.newDeactivatedYear) {
                    return prettyPrintDate(`${update.deactivatedDate.newDeactivatedYear}`, update.deactivatedDate.type);
                }
                return undefined;
            case DateFormat.MONTH_YEAR:
                if (update.deactivatedDate.newDeactivatedYear) {
                    const month = (parseInt(update.deactivatedDate.newDeactivatedMonth) + 1).toString();
                    return prettyPrintDate(`${update.deactivatedDate.newDeactivatedYear}-${month}`, update.deactivatedDate.type);
                }
                return undefined;
            case DateFormat.EXACT_DATE:
                return prettyPrintDate(update.deactivatedDate.newDeactivatedDate, update.deactivatedDate.type);
            default:
                return undefined;
        }
    }

    /**
     * Iterates through the oldMonument's Materials and Tags
     * as well as the update's Materials and Tags to
     * determine the unchanged, added and removed Materials and Tags
     * Done once in this method so we don't have to loop multiple times
     * Stores the changes in an object to return
     */
    collectTagChanges() {
        const { oldMonument, update } = this.props;

        const unchangedMaterials = [];
        const addedMaterials = [];
        const removedMaterials = [];
        const unchangedTags = [];
        const addedTags = [];
        const removedTags = [];

        if (oldMonument && oldMonument.monumentTags && update) {
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
            if (update.newMaterials && update.newMaterials.length) {
                for (const newMaterialName of update.newMaterials) {
                    if (!oldMonumentMaterialNames.includes(newMaterialName)) {
                        addedMaterials.push(newMaterialName);
                    }
                    else {
                        unchangedMaterials.push(newMaterialName);
                    }
                }

                // Find the removed Materials
                for (const oldMaterialName of oldMonumentMaterialNames) {
                    if (!update.newMaterials.includes(oldMaterialName)) {
                        removedMaterials.push(oldMaterialName);
                    }
                }
            }

            // Find the added and unchanged Tags
            if (update.newTags && update.newTags.length) {
                for (const newTagName of update.newTags) {
                    if (!oldMonumentTagNames.includes(newTagName)) {
                        addedTags.push(newTagName);
                    }
                    else {
                        unchangedTags.push(newTagName);
                    }
                }

                // Find the removed Tags
                for (const oldTagName of oldMonumentTagNames) {
                    if (!update.newTags.includes(oldTagName)) {
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
     * as well as the update's References to
     * determine the unchanged, added and removed References
     * Done once in this method so we don't have to loop multiple times
     * Stores the changes in an object to return
     */
    collectReferenceChanges() {
        const { oldMonument, update } = this.props;

        let deletedReferences = [];
        let changedReferences = [];
        let unchangedReferences = [];
        let addedReferences = [];

        // Gather changed, unchanged and deleted References
        if (oldMonument.references && oldMonument.references.length) {
            for (const reference of oldMonument.references) {
                // Deleted
                if (update.deletedReferenceIds.includes(reference.id)) {
                    deletedReferences.push(reference.url);
                }
                else {
                    const newReferenceValue = update.updatedReferenceUrlsById[reference.id];

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
        if (update.newReferenceUrls && update.newReferenceUrls.length) {
            for (const newReferenceUrl of update.newReferenceUrls) {
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

    handleShowUnchangedAttributesLinkClick() {
        const { showingUnchangedAttributes } = this.state;
        this.setState({showingUnchangedAttributes: !showingUnchangedAttributes});
    }

    handleShowAllChangedAttributesLinkClick() {
        const { showingAllChangedAttributes } = this.state;
        this.setState({showingAllChangedAttributes: !showingAllChangedAttributes});
    }

    renderShowUnchangedAttributesLink() {
        return (
            <div className="collapse-link" onClick={() => this.handleShowUnchangedAttributesLinkClick()}>
                Show Unchanged Attributes
            </div>
        );
    }

    renderHideUnchangedAttributesLink() {
        return (
            <div className="collapse-link" onClick={() => this.handleShowUnchangedAttributesLinkClick()}>
                Hide Unchanged Attributes
            </div>
        );
    }

    renderShowAllChangedAttributesLink() {
        return (
            <div className="collapse-link" onClick={() => this.handleShowAllChangedAttributesLinkClick()}>
                Show More
            </div>
        );
    }

    renderHideAllChangedAttributesLink() {
        return (
            <div className="collapse-link" onClick={() => this.handleShowAllChangedAttributesLinkClick()}>
                Show Less
            </div>
        );
    }

    render() {
        const { showingAllChangedAttributes, showingUnchangedAttributes } = this.state;
        const { oldMonument, update, showUnchangedAttributes=true, showAllChangedAttributes=true,
            showCollapseLinks=true } = this.props;

        let changedAttributes = [];
        let unchangedAttributes = [];

        if (oldMonument && update) {
            /* Title */
            (this.didAttributeChange(oldMonument.title, update.newTitle)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Title" oldAttribute={oldMonument.title} newAttribute={update.newTitle} key="title"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Title" oldAttribute={oldMonument.title} newAttribute={update.newTitle} didChange={false} key="title"/>);

            /* IsTemporary */
            (this.didBooleanChange(oldMonument.isTemporary, update.newIsTemporary)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Is Temporary" oldAttribute={oldMonument.isTemporary} newAttribute={update.newIsTemporary} isBoolean={true} key="isTemporary"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Is Temporary" oldAttribute={oldMonument.isTemporary} newAttribute={update.newIsTemporary} didChange={false} isBoolean={true} key="isTemporary"/>);

            /* Artist */
            (this.didAttributeChange(oldMonument.artist, update.newArtist)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Artist" oldAttribute={oldMonument.artist} newAttribute={update.newArtist} key="artist"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Artist" oldAttribute={oldMonument.artist} newAttribute={update.newArtist} didChange={false} key="artist"/>);

            /* Date */
            const oldDate = prettyPrintDate(oldMonument.date, oldMonument.dateFormat);
            const newDate = this.determineNewDate();
            (this.didAttributeChange(oldDate, newDate)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Date" oldAttribute={oldDate} newAttribute={newDate} key="date"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Date" oldAttribute={oldDate} newAttribute={newDate} didChange={false} key="date"/>);

            /* Deactivated Date */
            const oldDeactivatedDate = prettyPrintDate(oldMonument.deactivatedDate, oldMonument.deactivatedDateFormat);
            const newDeactivatedDate = this.determineNewDeactivatedDate();
            (this.didAttributeChange(oldDeactivatedDate, newDeactivatedDate)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Deactivated Date" oldAttribute={oldDeactivatedDate} newAttribute={newDeactivatedDate} key="deactivatedDate"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Deactivated Date" oldAttribute={oldDeactivatedDate} newAttribute={newDeactivatedDate} didChange={false} key="deactivatedDate"/>);

            /* Deactivated Comment */
            (this.didAttributeChange(oldMonument.deactivatedComment, update.newDeactivatedComment)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Deactivated Reason" oldAttribute={oldMonument.deactivatedComment} newAttribute={update.newDeactivatedComment} key="deactivatedComment"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Deactivated Reason" oldAttribute={oldMonument.deactivatedComment} newAttribute={update.newDeactivatedComment} didChange={false} key="deactivatedComment"/>);

            /* Address */
            (this.didAttributeChange(oldMonument.address, update.newAddress)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Address" oldAttribute={oldMonument.address} newAttribute={update.newAddress} key="address"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Address" oldAttribute={oldMonument.address} newAttribute={update.newAddress} didChange={false} key="address"/>);

            /* City */
            (this.didAttributeChange(oldMonument.city, update.newCity)) ?
                changedAttributes.push(<AttributeChange attributeLabel="City" oldAttribute={oldMonument.city} newAttribute={update.newCity} key="city"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="City" oldAttribute={oldMonument.city} newAttribute={update.newCity} didChange={false} key="city"/>);

            /* State */
            (this.didAttributeChange(oldMonument.state, update.newState)) ?
                changedAttributes.push(<AttributeChange attributeLabel="State" oldAttribute={oldMonument.state} newAttribute={update.newState} key="state"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="State" oldAttribute={oldMonument.state} newAttribute={update.newState} didChange={false} key="state"/>);

            /* Latitude */
            let oldLatitude = oldMonument.lat ? oldMonument.lat.toString() : '';
            (this.didAttributeChange(oldLatitude, update.newLatitude)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Latitude" oldAttribute={oldLatitude} newAttribute={update.newLatitude} key="latitude"/> ) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Latitude" oldAttribute={oldLatitude} newAttribute={update.newLatitude} didChange={false} key="latitude"/>);

            /* Longitude */
            let oldLongitude = oldMonument.lon ? oldMonument.lon.toString() : '';
            (this.didAttributeChange(oldLongitude, update.newLongitude)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Longitude" oldAttribute={oldLongitude} newAttribute={update.newLongitude} key="longitude"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Longitude" oldAttribute={oldLongitude} newAttribute={update.newLongitude} didChange={false} key="longitude"/>);

            /* Description */
            (this.didAttributeChange(oldMonument.description, update.newDescription)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Description" oldAttribute={oldMonument.description} newAttribute={update.newDescription} key="description"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Description" oldAttribute={oldMonument.description} newAttribute={update.newDescription} didChange={false} key="description"/>);

            /* Inscription */
            (this.didAttributeChange(oldMonument.inscription, update.newInscription)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Inscription" oldAttribute={oldMonument.inscription} newAttribute={update.newInscription} key="inscription"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Inscription" oldAttribute={oldMonument.inscription} newAttribute={update.newInscription} didChange={false} key="inscription"/>);

            /* Materials and Tags */
            const tagChanges = this.collectTagChanges();

            unchangedAttributes.push(<UnchangedTags tags={tagChanges.unchangedMaterials} areMaterials={true} key="unchangedMaterials"/>);

            let addedMaterialsDisplay = <AddedTags tags={tagChanges.addedMaterials} areMaterials={true} key="addedMaterials"/>;
            tagChanges.addedMaterials.length ?
                changedAttributes.push(addedMaterialsDisplay) :
                unchangedAttributes.push(addedMaterialsDisplay);

            let removedMaterialsDisplay = <RemovedTags tags={tagChanges.removedMaterials} areMaterials={true} key="removedMaterials"/>;
            tagChanges.removedMaterials.length ?
                changedAttributes.push(removedMaterialsDisplay) :
                unchangedAttributes.push(removedMaterialsDisplay);

            unchangedAttributes.push(<UnchangedTags tags={tagChanges.unchangedTags} areMaterials={false} key="unchangedTags"/>);

            let addedTagsDisplay = <AddedTags tags={tagChanges.addedTags} areMaterials={false} key="addedTags"/>;
            tagChanges.addedTags.length ?
                changedAttributes.push(addedTagsDisplay) :
                unchangedAttributes.push(addedTagsDisplay);

            let removedTagsDisplay = <RemovedTags tags={tagChanges.removedTags} areMaterials={false} key="removedTags"/>;
            tagChanges.removedTags.length ?
                changedAttributes.push(removedTagsDisplay) :
                unchangedAttributes.push(removedTagsDisplay);

            /* References */
            const referenceChanges = this.collectReferenceChanges();

            if (referenceChanges.unchangedReferences.length) {
                unchangedAttributes.push(<ReferenceChanges unchangedReferences={referenceChanges.unchangedReferences} didChange={false} key="unchangedReferences"/>);
            }

            if (referenceChanges.changedReferences.length) {
                changedAttributes.push(<ReferenceChanges changedReferences={referenceChanges.changedReferences} key="changedReferences"/>);
            }

            let addedReferencesDisplay = <AddedReferences references={referenceChanges.addedReferences} key="addedReferences"/>;
            referenceChanges.addedReferences.length ?
                changedAttributes.push(addedReferencesDisplay) :
                unchangedAttributes.push(addedReferencesDisplay);

            let deletedReferencesDisplay = <DeletedReferences references={referenceChanges.deletedReferences} key="deletedReferences"/>;
            referenceChanges.deletedReferences.length ?
                changedAttributes.push(deletedReferencesDisplay) :
                unchangedAttributes.push(deletedReferencesDisplay);

            /* Images */
            const addedImages = update.addedImages.filter(image => (image.name && image.name.length) || (image.url && image.url.length));
            let addedImagesDisplay = <AddedImages images={update.addedImages} key="addedImages"/>;
            (addedImages && addedImages.length) ?
                changedAttributes.push(addedImagesDisplay) :
                unchangedAttributes.push(addedImagesDisplay);

            let deletedImagesDisplay = <DeletedImages deletedImageUrls={update.deletedImageUrls} displayImageNames={update.displayDeletedImageNames} key="deletedImages"/>;
            (update.deletedImageUrls && update.deletedImageUrls.length) ?
                changedAttributes.push(deletedImagesDisplay) :
                unchangedAttributes.push(deletedImagesDisplay);

            let addedPhotoSphereImagesDisplay = <AddedPhotoSphereImages images={update.addedPhotoSphereImages} key="addedPhotoSphereImages"/>;
            (update.addedPhotoSphereImages && update.addedPhotoSphereImages.length) ?
                changedAttributes.push(addedPhotoSphereImagesDisplay) :
                unchangedAttributes.push(addedPhotoSphereImagesDisplay);

            let deletedPhotoSphereImagesDisplay = <DeletedPhotoSphereImages deletedImageUrls={update.deletedPhotoSphereImageUrls} key="deletedPhotoSphereImages"/>;
            (update.deletedPhotoSphereImageUrls && update.deletedPhotoSphereImageUrls.length) ?
                changedAttributes.push(deletedPhotoSphereImagesDisplay) :
                unchangedAttributes.push(deletedPhotoSphereImagesDisplay);
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
            )
        }

        let changedAttributesToDisplay = changedAttributes;
        let hiddenAttributes;
        if (!showAllChangedAttributes) {
            if (changedAttributes.length > 3) {
                changedAttributesToDisplay = changedAttributes.slice(0, 3);
                hiddenAttributes = changedAttributes.slice(3);
            }
        }

        return (
            <div className="attribute-update-container">
                <div>
                    {changedAttributesToDisplay}
                    {!showAllChangedAttributes && !showUnchangedAttributes && hiddenAttributes && <>
                        <Collapse in={showingAllChangedAttributes}>
                            <div>
                                {hiddenAttributes}
                            </div>
                        </Collapse>

                        {!showingAllChangedAttributes && showCollapseLinks && this.renderShowAllChangedAttributesLink()}
                        {showingAllChangedAttributes && showCollapseLinks && this.renderHideAllChangedAttributesLink()}
                    </>}
                </div>
                {showUnchangedAttributes && <>
                    <Collapse in={showingUnchangedAttributes}>
                        <div>
                            <hr className="unchanged-attributes-divider"/>
                            {unchangedAttributes}
                        </div>
                    </Collapse>

                    {!showingUnchangedAttributes && this.renderShowUnchangedAttributesLink()}
                    {showingUnchangedAttributes && this.renderHideUnchangedAttributesLink()}
                </>}
            </div>
        );
    }
}