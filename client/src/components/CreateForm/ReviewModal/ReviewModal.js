import React from 'react';
import './ReviewModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { prettyPrintDate } from '../../../utils/string-util';

/**
 * Presentational component for the Modal shown before a Monument Creation is completed
 */
export default class ReviewModal extends React.Component {

    render() {
        const { showing, onCancel, onConfirm, form, dateSelectValue } = this.props;

        let date = (
            <span className="missing-attribute">NONE</span>
        );
        switch (dateSelectValue) {
            case 'year':
                if (form.year) {
                    date = `${form.year}`;
                }
                break;
            case 'month-year':
                if (form.year) {
                    date = `${form.month}, ${form.year}`;
                }
                break;
            case 'exact-date':
                date = prettyPrintDate(form.date);
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

        let tags = (
            <span className="missing-attribute">NONE</span>
        );
        if (form.tags && form.tags.length) {
            tags = (
                <ul>
                    {form.tags.map(tag => <li key={tag}>{tag}</li>)}
                    {form.newTags.map(newTag => <li key={newTag}>{newTag}</li>)}
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

        return (
            <Modal
                show={showing}
                onHide={onCancel}
            >
                <Modal.Header className="review-modal">
                    <Modal.Title>
                        Review Creation
                    </Modal.Title>
                </Modal.Header>
                <hr className="review-modal"/>
                <Modal.Body className="review-modal">
                    <p>Please review the data you entered for correctness and completeness!</p>
                    <p>*Fields marked with an asterisk are required.</p>
                    <p>**Address OR Latitude AND Longitude are required.</p>
                    <div className="attributes-container">
                        <div className="attribute">
                            <span className="attribute-label">*Title:&nbsp;</span>
                            {form.title}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">Artist:&nbsp;</span>
                            {form.artist ? form.artist : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">Date:&nbsp;</span>
                            {date}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">**Address:&nbsp;</span>
                            {form.address ? form.address : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">**Latitude:&nbsp;</span>
                            {form.latitude ? form.latitude : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">**Longitude:&nbsp;</span>
                            {form.longitude ? form.longitude : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">Description:&nbsp;</span>
                            {form.description ? form.description : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">Inscription:&nbsp;</span>
                            {form.inscription ? form.inscription : (
                                <span className="missing-attribute">NONE</span>
                            )}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">*Materials:&nbsp;</span>
                            {materials}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">Tags:&nbsp;</span>
                            {tags}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">References:&nbsp;</span>
                            {references}
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">Images:&nbsp;</span>
                            {images}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="review-modal">
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