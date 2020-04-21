import * as React from 'react';
import './PhotoSphereImages.scss';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { validUrlRegex } from '../../../utils/string-util';
import { Link } from 'react-router-dom';

/**
 * Presentational component for displaying an input to add and delete PhotoSphere Images on the CreateOrUpdateForm
 */
export default class PhotoSphereImages extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modalShowing: false,
            linkInput: {
                value: '',
                isValid: true,
                message: ''
            }
        };
    }

    handleInputChange(event) {
        const value = event.target.value;
        const match = /src="([^"]+)"/.exec(value);
        const url = match ? match[1] : undefined;
        if (url && validUrlRegex.test(url)) {
            this.setState({linkInput: {
                value: url,
                isValid: true,
                message: ''
            }});
        }
        else {
            this.setState({linkInput: {
                value,
                isValid: false,
                message: 'Invalid embed HTML. Click the "How do I find 360° images?" link above for instructions on how to copy the correct embed HTML.'
            }});
        }
    }

    handleAddImage() {
        const { onAddImage } = this.props;
        const { linkInput: { value } } = this.state;
        const image = {url: value, isPhotoSphere: true, id: null};
        this.setState({
            linkInput: {
                value: '',
                isValid: true,
                message: ''
            }
        });
        onAddImage(image);
    }

    handleDeleteImage(image, index) {
        const { onDeleteImage } = this.props;
        if (image.id) {
            onDeleteImage({image});
        }
        else {
            onDeleteImage({index});
        }
    }

    handleRestoreImage(image) {
        const { onRestoreImage } = this.props;
        onRestoreImage(image);
    }

    renderModal() {
        const { modalShowing } = this.state;

        const googleMapsLink = (
            <Link to="google.com/maps">Google Maps</Link>
        );

        return (
            <Modal show={modalShowing} onHide={() => this.setState({modalShowing: false})}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        How to Find and Upload 360° Images
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>About</h5>
                    <p>
                        360° images are a feature available on Google Maps allowing users to view locations as if they
                        were there in-person. They allow visitors to experience the monument or memorial in a new way
                        and are a great addition to our database.
                    </p>
                    <h5>Step 1.</h5>
                    <p>
                        To upload 360° images, start by finding your monument or memorial in {googleMapsLink}.
                    </p>
                    <div className="mb-5">
                        <img alt="Step 1" src="/photosphere/step1.png"/>
                    </div>
                    <h5>Step 2.</h5>
                    <p>
                        Next, click on the image of the monument or memorial to go to the photos tab. You will see a
                        page similar to the one below. Look for the tab that says "360° view", circled in red below.
                    </p>
                    <p>
                        If there is not a tab that says "360° view" then your monument or memorial does not have any
                        360° images available. If your monument or memorial does have this tab, click on it and you will
                        be taken to the "360° view" page.
                    </p>
                    <div className="mb-5">
                        <img alt="Step 2" src="/photosphere/step2.png"/>
                    </div>
                    <h5>Step 3.</h5>
                    <p>
                        Once on this page, find the 360° image you like and click the button with three vertical dots
                        next to the name of the image and click "Share or embed image" in the dropdown menu.
                    </p>
                    <div className="mb-5">
                        <img alt="Step 3" src="/photosphere/step3.png"/>
                    </div>
                    <h5>Step 4.</h5>
                    <p>
                        Finally, click on the "Embed a map" tab and click "COPY HTML". You can then paste this into the
                        "Paste 360° HTML" field on this page.
                    </p>
                    <div>
                        <img alt="Step 4" src="/photosphere/step4.png"/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => this.setState({modalShowing: false})}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const { images } = this.props;
        const { linkInput } = this.state;

        return (
            <Form.Group controlId="photo-sphere-images" className="photosphere-input">
                <Form.Label className="mr-1">360° Images<OverlayTrigger
                    placement="top"
                    overlay={props => (
                        <Tooltip {...props} show={props.show ? 'show' : ''}>
                            You can link 360° images from Google Maps. Click "How do I find 360° images?" for more info.
                        </Tooltip>
                    )}>
                    <i className="material-icons">
                        help
                    </i>
                </OverlayTrigger>:</Form.Label>
                {images.map((image, index) => (
                    <div key={image.id || image.url} className="photosphere-preview fileContainer">
                        {image.hasBeenDeleted ? (
                            <i className="material-icons delete-button undo" onClick={() => this.handleRestoreImage(image)}>undo</i>
                        ) : (
                            <div className="deleteImage" onClick={() => this.handleDeleteImage(image, index)}>X</div>
                        )}
                        <iframe title="PhotoSphere" src={image.url} frameBorder="0"/>
                        {image.hasBeenDeleted &&
                            <div className="deleted-photosphere-overlay"/>
                        }
                    </div>
                ))}
                <Button variant="link" className="pl-0" onClick={() => this.setState({modalShowing: true})}>
                    How do I find 360° images?
                </Button>
                <div>
                    <Form.Control
                        type="text"
                        name="add-photosphere"
                        placeholder="Paste 360° HTML"
                        value={linkInput.value}
                        onChange={event => this.handleInputChange(event)}
                        isInvalid={!linkInput.isValid}
                        className="text-control d-inline-block"
                    />
                    <Button disabled={!linkInput.value || !linkInput.isValid}
                            className="ml-3 text-uppercase d-inline-block"
                            onClick={() => this.handleAddImage()}>
                        Add 360° Image
                    </Button>
                    <Form.Control.Feedback type="invalid">{linkInput.message}</Form.Control.Feedback>
                </div>
                {this.renderModal()}
            </Form.Group>
        );
    }
}