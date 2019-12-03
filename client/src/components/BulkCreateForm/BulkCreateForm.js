import React from 'react';
import './BulkCreateForm.scss';
import { Form, Button, ButtonToolbar, Collapse } from 'react-bootstrap';
import validator from 'validator';
import { csvFileRegex } from "../../utils/regex-util";
import MoreInformation from "./MoreInformation/MoreInformation";

/**
 * Presentational component for the Form to submit a CSV file for bulk creating Monuments
 */
export default class BulkCreateForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fileUpload: {
                file: {},
                isValid: true,
                message: ''
            },
            showingMoreInformation: false
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        console.log('Form submitted');
    }

    handleFileUploadChange(event) {
        const { fileUpload } = this.state;

        if (!validator.matches(event.target.value, csvFileRegex)) {
            event.target.value = '';
            alert('Invalid file type submitted');
        }
        else {
            fileUpload.file = event.target.files[0];
            this.setState({fileUpload});
        }

        console.log(fileUpload);
    }

    handleMoreInformationClick() {
        const { showingMoreInformation } = this.state;

        this.setState({showingMoreInformation: !showingMoreInformation});
    }

    render() {
        const { fileUpload, showingMoreInformation } = this.state;

        const moreInformationLink = (
            <div className='more-information-link'
                 onClick={() => this.handleMoreInformationClick()}>
                Show More Information
            </div>
        );

        const hideMoreInformationLink = (
            <div className='more-information-link'
                 onClick={() => this.handleMoreInformationClick()}>
                Hide More Information
            </div>
        );

        return (
            <div className='bulk-create-form-container'>
                <div className='h5'>
                    Bulk Create Monuments and Memorials
                </div>

                <Form onSubmit={(event) => this.handleSubmit(event)}>
                    <Form.Group controlId='bulk-create-form-file-upload'>
                        <Form.Label>Upload a CSV File:</Form.Label>
                        <label for='file-upload-input' className='file-upload-input-label'>
                            <text>CHOOSE A FILE</text>
                        </label>
                        <Form.Control
                            type='file'
                            id='file-upload-input'
                            onChange={(event) => this.handleFileUploadChange(event)}
                            isInvalid={!fileUpload.isValid}
                            accept='.csv'
                            className='file-upload-input'
                        />
                        <Form.Control.Feedback type='invalid'>{fileUpload.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Collapse in={showingMoreInformation}>
                        <div>
                            <MoreInformation/>
                        </div>
                    </Collapse>

                    {!showingMoreInformation && moreInformationLink}
                    {showingMoreInformation && hideMoreInformationLink}
                </Form>
            </div>
        );
    }
}