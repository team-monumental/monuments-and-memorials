import * as React from 'react';
import './MonumentUpdate.scss';
import AttributeChange from './AttributeChange/AttributeChange';
import { prettyPrintDate, prettyPrintDateString } from '../../../utils/string-util';
import UnchangedTags from './TagChanges/UnchangedTags/UnchangedTags';
import AddedTags from './TagChanges/AddedTags/AddedTags';
import RemovedTags from './TagChanges/RemovedTags/RemovedTags';
import ReferenceChanges from './References/ReferenceChanges/ReferenceChanges';
import AddedReferences from './References/AddedReferences/AddedReferences';
import DeletedReferences from './References/DeletedReferences/DeletedReferences';
import AddedImages from './Images/AddedImages/AddedImages';
import DeletedImages from './Images/DeletedImages/DeletedImages';
import { Collapse } from 'react-bootstrap';

/**
 * Presentational component for displaying changes to a Monument
 */
export default class MonumentUpdate extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
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
        const { newMonument } = this.props;

        switch (newMonument.dateType) {
            case 'year':
                if (newMonument.newYear) {
                    return prettyPrintDateString(`${newMonument.newYear}-01-01`);
                }
                return undefined;
            case 'month-year':
                if (newMonument.newYear) {
                    const month = (parseInt(newMonument.newMonth) + 1).toString();
                    return prettyPrintDateString(`${newMonument.newYear}-${month}-01`);
                }
                return undefined;
            case 'exact-date':
                return prettyPrintDate(newMonument.newDate);
            default:
                return undefined;
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

    handleExpandLinkClick() {
        const { expanded } = this.state;
        this.setState({expanded: !expanded});
    }

    renderExpandLink() {
        return (
            <div className="collapse-link" onClick={() => this.handleExpandLinkClick()}>
                Show Unchanged Attributes
            </div>
        );
    }

    renderHideLink() {
        return (
            <div className="collapse-link" onClick={() => this.handleExpandLinkClick()}>
                Hide Unchanged Attributes
            </div>
        );
    }

    render() {
        const { expanded } = this.state;
        const { oldMonument, newMonument, addedImages } = this.props;

        let changedAttributes = [];
        let unchangedAttributes = [];

        if (oldMonument && newMonument) {
            /* Title */
            (this.didAttributeChange(oldMonument.title, newMonument.newTitle)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Title" oldAttribute={oldMonument.title} newAttribute={newMonument.newTitle} key="title"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Title" oldAttribute={oldMonument.title} newAttribute={newMonument.newTitle} didChange={false} key="title"/>);

            /* IsTemporary */
            (this.didBooleanChange(oldMonument.isTemporary, newMonument.newIsTemporary)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Is Temporary" oldAttribute={oldMonument.isTemporary} newAttribute={newMonument.newIsTemporary} isBoolean={true} key="isTemporary"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Is Temporary" oldAttribute={oldMonument.isTemporary} newAttribute={newMonument.newIsTemporary} didChange={false} isBoolean={true} key="isTemporary"/>);

            /* Artist */
            (this.didAttributeChange(oldMonument.artist, newMonument.newArtist)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Artist" oldAttribute={oldMonument.artist} newAttribute={newMonument.newArtist} key="artist"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Artist" oldAttribute={oldMonument.artist} newAttribute={newMonument.newArtist} didChange={false} key="artist"/>);

            /* Date */
            const oldDate = prettyPrintDateString(oldMonument.date);
            const newDate = this.determineNewDate();
            console.log(newDate);
            (this.didAttributeChange(oldDate, newDate)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Date" oldAttribute={oldDate} newAttribute={newDate} key="date"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Date" oldAttribute={oldDate} newAttribute={newDate} didChange={false} key="date"/>);

            /* Address */
            (this.didAttributeChange(oldMonument.address, newMonument.newAddress)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Address" oldAttribute={oldMonument.address} newAttribute={newMonument.newAddress} key="address"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Address" oldAttribute={oldMonument.address} newAttribute={newMonument.newAddress} didChange={false} key="address"/>);

            /* Latitude */
            let oldLatitude = oldMonument.lat ? oldMonument.lat.toString() : '';
            (this.didAttributeChange(oldLatitude, newMonument.newLatitude)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Latitude" oldAttribute={oldLatitude} newAttribute={newMonument.newLatitude} key="latitude"/> ) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Latitude" oldAttribute={oldLatitude} newAttribute={newMonument.newLatitude} didChange={false} key="latitude"/>);

            /* Longitude */
            let oldLongitude = oldMonument.lon ? oldMonument.lon.toString() : '';
            (this.didAttributeChange(oldLongitude, newMonument.newLongitude)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Longitude" oldAttribute={oldLongitude} newAttribute={newMonument.newLongitude} key="longitude"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Longitude" oldAttribute={oldLongitude} newAttribute={newMonument.newLongitude} didChange={false} key="longitude"/>);

            /* Description */
            (this.didAttributeChange(oldMonument.description, newMonument.newDescription)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Description" oldAttribute={oldMonument.description} newAttribute={newMonument.newDescription} key="description"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Description" oldAttribute={oldMonument.description} newAttribute={newMonument.newDescription} didChange={false} key="description"/>);

            /* Inscription */
            (this.didAttributeChange(oldMonument.inscription, newMonument.newInscription)) ?
                changedAttributes.push(<AttributeChange attributeLabel="Inscription" oldAttribute={oldMonument.inscription} newAttribute={newMonument.newInscription} key="inscription"/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Inscription" oldAttribute={oldMonument.inscription} newAttribute={newMonument.newInscription} didChange={false} key="inscription"/>);

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
            let addedImagesDisplay = <AddedImages images={this.props.addedImages} key="addedImages"/>;
            (addedImages && addedImages.length) ?
                changedAttributes.push(addedImagesDisplay) :
                unchangedAttributes.push(addedImagesDisplay);

            let deletedImagesDisplay = <DeletedImages newMonument={this.props.newMonument} key="deletedImages"/>;
            (newMonument.deletedImageUrls && newMonument.deletedImageUrls.length) ?
                changedAttributes.push(deletedImagesDisplay) :
                unchangedAttributes.push(deletedImagesDisplay);
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

        return (
            <div className="attribute-update-container">
                <div>
                    {changedAttributes}
                </div>
                <Collapse in={expanded}>
                    <div>
                        <hr className="unchanged-attributes-divider"/>
                        {unchangedAttributes}
                    </div>
                </Collapse>

                {!expanded && this.renderExpandLink()}
                {expanded && this.renderHideLink()}
            </div>
        );
    }
}