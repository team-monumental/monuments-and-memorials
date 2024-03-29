import React from 'react';
import './CreateReviewModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {DateFormat, prettyPrintDate} from '../../../utils/string-util';

/**
 * Presentational component for the Modal shown before a CreateMonumentSuggestion is created
 */
export default class CreateReviewModal extends React.Component {

    render() {
        const { showing, onCancel, onConfirm, form } = this.props;

        if (!form) {
            return <div/>;
        }

        let date = (
            <span className="missing-attribute">NONE</span>
        );
        switch (form.dateSelectValue) {
            case DateFormat.YEAR:
                if (form.year) {
                    date = prettyPrintDate(`${form.year}`, form.dateSelectValue);
                }
                break;
            case DateFormat.MONTH_YEAR:
                if (form.year) {
                    date = prettyPrintDate(`${form.year}-${form.month}`, form.dateSelectValue);
                }
                break;
            case DateFormat.EXACT_DATE:
                date = prettyPrintDate(form.date, form.dateSelectValue);
                break;
            case DateFormat.UNKNOWN:
                date = 'UNKNOWN';
                break;
            default:
                break;
        }

        let deactivatedDate = (
            <span className="missing-attribute">NONE</span>
        );
        switch (form.deactivatedDateSelectValue) {
            case DateFormat.YEAR:
                if (form.deactivatedYear) {
                    deactivatedDate = prettyPrintDate(`${form.deactivatedYear}`, form.deactivatedDateSelectValue);
                }
                break;
            case DateFormat.MONTH_YEAR:
                if (form.deactivatedYear) {
                    deactivatedDate = prettyPrintDate(`${form.deactivatedYear}-${form.deactivatedMonth}`, form.deactivatedDateSelectValue);
                }
                break;
            case DateFormat.EXACT_DATE:
                deactivatedDate = prettyPrintDate(form.deactivatedDate, form.deactivatedDateSelectValue);
                break;
            case DateFormat.UNKNOWN:
                deactivatedDate = 'UNKNOWN';
                break;
            default:
                break;
        }

        let materials = (
            <ul>
                {form.materials.map(material => <li key={material}>{material}</li>)}
                {form.newMaterials.map(newMaterial => <li key={newMaterial}>{newMaterial}</li>)}
            </ul>
        );

        let tags = [];
        let tagsDisplay = (
            <span className="missing-attribute">NONE</span>
        );

        if (form.tags && form.tags.length) {
            tags.push(form.tags);
        }
        if (form.newTags && form.newTags.length) {
            tags.push(form.newTags);
        }

        if (tags && tags.length) {
            tagsDisplay = (
                <ul>
                    {tags.map(tag => <li key={tag}>{tag}</li>)}
                </ul>
            );
        }

        let references = (
            <span className="missing-attribute">NONE</span>
        );
        if (form.references) {
            let referenceList = [];
            form.references.map((reference) => {
               if (reference !== '') {
                   referenceList.push(reference);
               }
               return referenceList;
            });

            if (referenceList.length > 0) {
                references = (
                    <ul>
                        {form.references.map(reference => <li key={reference}>{reference}</li>)}
                    </ul>
                );
            }
        }

        let images = (
            <span className="missing-attribute">NONE</span>
        );
        if (form.images && form.images.length) {
            images = (
                <ul>
                    {form.images.map(image => <li key={image.name}>{image.name}</li>)}
                </ul>
            );
        }

        let photoSphereImages = (
            <span className="missing-attribute">NONE</span>
        );
        if (form.photoSphereImages && form.photoSphereImages.length) {
            photoSphereImages = (
                <ul className="mt-2 d-flex justify-content-center flex-column pl-0">
                    {form.photoSphereImages.map(photoSphereImage => <iframe title="PhotoSphere" src={photoSphereImage.url} key={photoSphereImage.url} frameBorder="0" allowFullScreen/>)}
                </ul>
            );
        }

        return (
            <Modal
                show={showing}
                onHide={onCancel}
                className="create-review-modal"
            >
                <Modal.Header>
                    <Modal.Title>
                        Review Creation
                    </Modal.Title>
                </Modal.Header>
                <hr/>
                <Modal.Body>
                    <p>Please review the data you entered for correctness and completeness!</p>
                    <p>*Fields marked with an asterisk are required.</p>
                    <p>**Address OR Latitude AND Longitude are required.</p>
                    <div className="attributes-container">
                        <div className="attribute">
                            <span className="font-weight-bold">*Title:&nbsp;</span>
                            {form.title}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">Is Temporary:&nbsp;</span>
                            {form.isTemporary ? 'Yes' : 'No'}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">Artist:&nbsp;</span>
                            {form.artist ? form.artist : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">Date:&nbsp;</span>
                            {date}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">Un-installed Date:&nbsp;</span>
                            {deactivatedDate}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">Un-installed Reason:&nbsp;</span>
                            {form.deactivatedComment ? form.deactivatedComment : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">**Address:&nbsp;</span>
                            {form.address ? form.address : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">**Latitude:&nbsp;</span>
                            {form.latitude ? form.latitude : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">**Longitude:&nbsp;</span>
                            {form.longitude ? form.longitude : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">City:&nbsp;</span>
                            {form.city ? form.city : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">State:&nbsp;</span>
                            {form.state ? form.state : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">Description:&nbsp;</span>
                            {form.description ? form.description : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">Inscription:&nbsp;</span>
                            {form.inscription ? form.inscription : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">*Materials:&nbsp;</span>
                            {materials}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">Tags:&nbsp;</span>
                            {tagsDisplay}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">References:&nbsp;</span>
                            {references}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">Images:&nbsp;</span>
                            {images}
                        </div>
                        <div className="attribute">
                            <span className="font-weight-bold">360° Images:&nbsp;</span>
                            {photoSphereImages}
                        </div>
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