import React from 'react';
import './UpdateReviewModal.scss';
import { Modal, Button, Collapse } from 'react-bootstrap';
import { prettyPrintDate } from '../../../utils/string-util';
import AttributeChange from '../../Monument/Update/AttributeChange/AttributeChange';
import DateChange from '../../Monument/Update/DateChange/DateChange';
import UnchangedTags from '../../Monument/Update/TagChanges/UnchangedTags/UnchangedTags';
import AddedTags from '../../Monument/Update/TagChanges/AddedTags/AddedTags';
import RemovedTags from '../../Monument/Update/TagChanges/RemovedTags/RemovedTags';
import ReferenceChanges from '../../Monument/Update/References/ReferenceChanges/ReferenceChanges';
import AddedReferences from '../../Monument/Update/References/AddedReferences/AddedReferences';
import DeletedReferences from '../../Monument/Update/References/DeletedReferences/DeletedReferences';
import AddedImages from '../../Monument/Update/Images/AddedImages/AddedImages';
import DeletedImages from '../../Monument/Update/Images/DeletedImages/DeletedImages';

/**
 * Presentational component for the Modal shown before an UpdateMonumentSuggestion is created
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
                changedAttributes.push(<AttributeChange attributeLabel="Title" oldAttribute={oldTitle} newAttribute={newTitle} didChange={true}/>) :
                changedAttributes.push(<AttributeChange attributeLabel="Title" oldAttribute={oldTitle} newAttribute={newTitle} didChange={false}/>);

            /* IsTemporary */
            let oldIsTemporary = oldMonument.isTemporary;
            let newIsTemporary = newMonument.newIsTemporary;
            (!!oldIsTemporary !== !!newIsTemporary) ?
                changedAttributes.push(<AttributeChange attributeLabel="Is Temporary" oldAttribute={oldIsTemporary} newAttribute={newIsTemporary} didChange={true} isBoolean={true}/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Is Temporary" oldAttribute={oldIsTemporary} newAttribute={newIsTemporary} didChange={false} isBoolean={true}/>);

            /* Artist */
            let oldArtist = oldMonument.artist ? oldMonument.artist : '';
            let newArtist = newMonument.newArtist ? newMonument.newArtist : '';
            (oldArtist !== newArtist) ?
                changedAttributes.push(<AttributeChange attributeLabel="Artist" oldAttribute={oldArtist} newAttribute={newArtist} didChange={true}/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Artist" oldAttribute={oldArtist} newAttribute={newArtist} didChange={false}/>);

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
                        changedAttributes.push(<DateChange type="year" oldYear={oldMonumentYear} newYear={newMonument.newYear} didChange={true}/>) :
                        unchangedAttributes.push(<DateChange type="year" oldYear={oldMonumentYear} newYear={newMonument.newYear} didChange={false}/>);
                    break;
                case 'month-year':
                    if (oldMonumentYear !== newMonument.newYear ||
                        oldMonumentMonth !== newMonument.newMonth) {
                        changedAttributes.push(<DateChange type="month-year" oldYear={oldMonumentYear} oldMonth={oldMonumentMonth} newYear={newMonument.newYear} newMonth={newMonument.newMonth} didChange={true}/>);
                    }
                    else {
                        unchangedAttributes.push(<DateChange type="month-year" oldYear={oldMonumentYear} oldMonth={oldMonumentMonth} newYear={newMonument.newYear} newMonth={newMonument.newMonth} didChange={false}/>);
                    }
                    break;
                case 'exact-date':
                    (prettyPrintDate(oldMonument.date) !== prettyPrintDate(newMonument.newDate)) ?
                        changedAttributes.push(<DateChange type="exact-date" oldDate={oldMonument.date} newDate={newMonument.newDate} didChange={true}/>) :
                        unchangedAttributes.push(<DateChange type="exact-date" oldDate={oldMonument.date} newDate={newMonument.newDate} didChange={false}/>);
                    break;
                default:
                    break;
            }

            /* Address */
            let oldAddress = oldMonument.address ? oldMonument.address : '';
            let newAddress = newMonument.newAddress ? newMonument.newAddress : '';
            (oldAddress !== newAddress) ?
                changedAttributes.push(<AttributeChange attributeLabel="Address" oldAttribute={oldAddress} newAttribute={newAddress} didChange={true}/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Address" oldAttribute={oldAddress} newAttribute={newAddress} didChange={false}/>);

            /* Latitude */
            let oldLatitude = oldMonument.lat ? oldMonument.lat.toString() : '';
            let newLatitude = newMonument.newLatitude ? newMonument.newLatitude : '';
            (oldLatitude !== newLatitude) ?
                changedAttributes.push(<AttributeChange attributeLabel="Latitude" oldAttribute={oldLatitude} newAttribute={newLatitude} didChange={true}/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Latitude" oldAttribute={oldLatitude} newAttribute={newLatitude} didChange={false}/>);

            /* Longitude */
            let oldLongitude = oldMonument.lon ? oldMonument.lon.toString() : '';
            let newLongitude = newMonument.newLongitude ? newMonument.newLongitude : '';
            (oldLongitude !== newLongitude) ?
                changedAttributes.push(<AttributeChange attributeLabel="Longitude" oldAttribute={oldLongitude} newAttribute={newLongitude} didChange={true}/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Longitude" oldAttribute={oldLongitude} newAttribute={newLongitude} didChange={false}/>);

            /* Description */
            let oldDescription = oldMonument.description ? oldMonument.description : '';
            let newDescription = newMonument.newDescription ? newMonument.newDescription : '';
            (oldDescription !== newDescription) ?
                changedAttributes.push(<AttributeChange attributeLabel="Description" oldAttribute={oldDescription} newAttribute={newDescription} didChange={true}/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Description" oldAttribute={oldDescription} newAttribute={newDescription} didChange={false}/>);

            /* Inscription */
            let oldInscription = oldMonument.inscription ? oldMonument.inscription : '';
            let newInscription = newMonument.newInscription ? newMonument.newInscription : '';
            (oldInscription !== newInscription) ?
                changedAttributes.push(<AttributeChange attributeLabel="Inscription" oldAttribute={oldInscription} newAttribute={newInscription} didChange={true}/>) :
                unchangedAttributes.push(<AttributeChange attributeLabel="Inscription" oldAttribute={oldInscription} newAttribute={newInscription} didChange={false}/>);

            /* Materials and Tags */
            const tagChanges = this.collectTagChanges();

            unchangedAttributes.push(<UnchangedTags tags={tagChanges.unchangedMaterials} areMaterials={true}/>);

            tagChanges.addedMaterials.length ?
                changedAttributes.push(<AddedTags tags={tagChanges.addedMaterials} areMaterials={true}/>) :
                unchangedAttributes.push(<AddedTags tags={tagChanges.addedMaterials} areMaterials={true}/>);

            tagChanges.removedMaterials.length ?
                changedAttributes.push(<RemovedTags tags={tagChanges.removedMaterials} areMaterials={true}/>) :
                unchangedAttributes.push(<RemovedTags tags={tagChanges.removedMaterials} areMaterials={true}/>);

            unchangedAttributes.push(<UnchangedTags tags={tagChanges.unchangedTags} areMaterials={false}/>);

            tagChanges.addedTags.length ?
                changedAttributes.push(<AddedTags tags={tagChanges.addedTags} areMaterials={false}/>) :
                unchangedAttributes.push(<AddedTags tags={tagChanges.addedTags} areMaterials={false}/>);

            tagChanges.removedTags.length ?
                changedAttributes.push(<RemovedTags tags={tagChanges.removedTags} areMaterials={false}/>) :
                unchangedAttributes.push(<RemovedTags tags={tagChanges.removedTags} areMaterials={false}/>);

            /* References */
            const referenceChanges = this.collectReferenceChanges();

            if (referenceChanges.unchangedReferences.length) {
                unchangedAttributes.push(<ReferenceChanges unchangedReferences={referenceChanges.unchangedReferences} didChange={false}/>);
            }

            if (referenceChanges.changedReferences.length) {
                changedAttributes.push(<ReferenceChanges changedReferences={referenceChanges.changedReferences} didChange={true}/>);
            }

            referenceChanges.addedReferences.length ?
                changedAttributes.push(<AddedReferences references={referenceChanges.addedReferences}/>) :
                unchangedAttributes.push(<AddedReferences references={referenceChanges.addedReferences}/>);

            referenceChanges.deletedReferences.length ?
                changedAttributes.push(<DeletedReferences references={referenceChanges.deletedReferences}/>) :
                unchangedAttributes.push(<DeletedReferences references={referenceChanges.deletedReferences}/>);

            /* Images */
            (addedImages && addedImages.length) ?
                changedAttributes.push(<AddedImages images={this.props.addedImages}/>) :
                unchangedAttributes.push(<AddedImages images={this.props.addedImages}/>);

            (newMonument.deletedImageUrls && newMonument.deletedImageUrls.length) ?
                changedAttributes.push(<DeletedImages newMonument={this.props.newMonument}/>) :
                unchangedAttributes.push(<DeletedImages newMonument={this.props.newMonument}/>);
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