import React from 'react';
import './BulkCreateForm.scss';
import { Form, Button, ButtonToolbar, Collapse } from 'react-bootstrap';
import validator from 'validator';
import { csvFileRegex, zipFileRegex } from '../../utils/regex-util';
import MoreInformation from './MoreInformation/MoreInformation';
import FeedbackModal from './FeedbackModal/FeedbackModal';

/**
 * Presentational component for the Form to submit a CSV file for bulk creating Monuments
 */
export default class BulkCreateForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fileUpload: {
                file: {},
                fileType: '',
                isValid: true,
                message: 'No file chosen',
                errorMessage: ''
            },
            showingMoreInformation: false,
            fileUploadInputKey: 0
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        this.resetForm(false);

        if (this.validateForm()) {
            this.submitForm();
        }
    }

    /**
     * Handles when a file is uploaded to the file upload input
     * @param event - The upload event fired by the input
     */
    handleFileUploadChange(event) {
        const { fileUpload } = this.state;

        this.resetForm(false);

        if (validator.matches(event.target.value, csvFileRegex)) {
            fileUpload.file = event.target.files[0];
            fileUpload.message = event.target.files[0].name;
            fileUpload.fileType = '.csv';
            this.setState({fileUpload});
        }
        else if (validator.matches(event.target.value, zipFileRegex)) {
            fileUpload.file = event.target.files[0];
            fileUpload.message = event.target.files[0].name;
            fileUpload.fileType = '.zip';
            this.setState({fileUpload});
        }
        else {
            event.target.value = '';
            alert('Invalid file type submitted');
        }
    }

    handleMoreInformationClick() {
        const { showingMoreInformation } = this.state;

        this.setState({showingMoreInformation: !showingMoreInformation});
    }

    /**
     * Resets the state of the Form
     * This means resetting the validation state for all inputs to true and clearing all error messages
     * @param resetValue - If true, also resets the values of the inputs
     */
    resetForm(resetValue) {
        const { fileUpload } = this.state;
        let { fileUploadInputKey } = this.state;

        fileUpload.isValid = true;
        fileUpload.errorMessage = '';

        if (resetValue) {
            fileUpload.file = {};
            fileUpload.message = 'No file chosen';
            fileUploadInputKey++;
        }

        this.setState({fileUpload, fileUploadInputKey});
    }

    handleCancelButtonClick() {
        const { onCancelButtonClick } = this.props;

        onCancelButtonClick();
    }

    /**
     * Validates the Form
     * If any of the inputs are invalid, the entire Form is considered invalid
     * @returns {boolean} - True if the Form is valid, False otherwise
     */
    validateForm() {
        const { fileUpload } = this.state;
        let formIsValid = true;

        /* File Upload Validation */
        /* A File upload is required */
        if (fileUpload.file.size === undefined) {
            fileUpload.isValid = false;
            fileUpload.errorMessage = 'A file is required';
            formIsValid = false;
        }

        if (!formIsValid) {
            this.setState({fileUpload});
        }

        return formIsValid;
    }

    /**
     * Build the form object to send to the onSubmit handler
     */
    submitForm() {
        const { fileUpload } = this.state;
        const { onCsvSubmit, onZipSubmit } = this.props;

        let form = {
            file: fileUpload.file
        };

        if (fileUpload.fileType === '.zip') {
            onZipSubmit(form);
        }
        else {
            onCsvSubmit(form);
        }
    }

    handleFeedbackModalClose() {
        this.resetForm(true);
    }

    render() {
        const { bulkCreateResult } = this.props;
        const { fileUpload, showingMoreInformation, fileUploadInputKey } = this.state;

        const moreInformationLink = (
            <div className='more-information-link'
                 onClick={() => this.handleMoreInformationClick()}>
                Show More Information
            </div>
        );

        const hideMoreInformationLink = (
            <div className='more-information-link hide-link'
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
                    <Form.Group className='file-upload-form-group'>
                        <Form.Label>Upload a CSV or Zip File:</Form.Label>
                        <label htmlFor='file-upload-input' className='file-upload-input-label'>
                            <span>CHOOSE A FILE</span>
                        </label>
                        <Form.Control
                            type='file'
                            id='file-upload-input'
                            onChange={(event) => this.handleFileUploadChange(event)}
                            isInvalid={!fileUpload.isValid}
                            accept='.csv,.zip'
                            className='file-upload-input'
                            key={fileUploadInputKey}
                        />
                        <Form.Control.Feedback type='invalid'>{fileUpload.errorMessage}</Form.Control.Feedback>
                        <div className={fileUpload.isValid ? 'file-upload-input-file-name' : 'd-none'}>
                            {fileUpload.message}
                        </div>
                    </Form.Group>

                    <Collapse in={showingMoreInformation}>
                        <div className='more-information-container'>
                            <MoreInformation/>
                        </div>
                    </Collapse>

                    {!showingMoreInformation && moreInformationLink}
                    {showingMoreInformation && hideMoreInformationLink}

                    <ButtonToolbar className={showingMoreInformation ? 'button-toolbar-extra-padding' : null}>
                        <Button
                            variant='primary'
                            type='submit'
                            className='mr-4 mt-1'
                        >
                            Submit
                        </Button>

                        <Button
                            variant='secondary'
                            type='button'
                            onClick={() => this.resetForm(true)}
                            className='mr-4 mt-1'
                        >
                            Clear
                        </Button>

                        <Button
                            variant='danger'
                            type='button'
                            onClick={() => this.handleCancelButtonClick()}
                            className='mt-1'
                        >
                            Cancel
                        </Button>
                    </ButtonToolbar>
                </Form>

                <div className='feedback-modal-container'>
                    <FeedbackModal
                        bulkCreateResult={bulkCreateResult}
                        onClose={() => this.handleFeedbackModalClose()}
                    />
                </div>
            </div>
        );
    }
}