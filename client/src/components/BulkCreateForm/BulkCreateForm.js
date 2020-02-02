import React from 'react';
import './BulkCreateForm.scss';
import { Form, Card, Button } from 'react-bootstrap';
import validator from 'validator';
import { csvFileRegex, zipFileRegex } from '../../utils/regex-util';
import FeedbackModal from './FeedbackModal/FeedbackModal';
import * as JSZip from 'jszip';
import * as CSVParser from 'csvtojson';

/**
 * Presentational component for the Form to submit a CSV file for bulk creating Monuments
 */
export default class BulkCreateForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fileUpload: {
                csv: null,
                zip: null,
                images: [],
                isValid: true,
                errorMessage: ''
            },
            fileUploadInputKey: 0,
            showFieldMapping: false,
            mapping: [],
            fields: [
                        'artist', 'title', 'date', 'latitude', 'longitude', 'city', 'state', 'address', 'description', 'inscription', 'tags',
                        'materials', 'images', 'references', 'contributions'
                    ].map(field => {
                        return {
                            name: field,
                            selected: false
                        }
                    })
        };
    }


    /**
     * Build the form object to send to the onSubmit handler
     */
    submitMapping() {
        const { fileUpload, mapping } = this.state;
        const { onSubmit } = this.props;

        // Reformat the mapping into the Map<String, String> format the backend uses
        let map = {};
        for (let row of mapping) {
            if (!row.mappedField) continue;
            map[row.originalField] = row.mappedField;
        }

        const form = {
            csv: fileUpload.csv,
            zip: fileUpload.zip,
            mapping: JSON.stringify(map)
        };

        if (fileUpload.zip) {
            // When dealing with zip files, we set the csv to JSZip's object for the CSV file so that we can read the
            // headers, but it's not the real JavaScript File object, and it isn't useful on the backend, so we don't
            // want to include it in the request
            delete form.csv;
        }

        onSubmit(form);
    }

    /**
     * Handles when a file is uploaded to the file upload input
     * @param event - The upload event fired by the input
     */
    async handleFileUploadChange(event) {
        const { fileUpload } = this.state;

        this.resetForm(false);

        if (validator.matches(event.target.value, csvFileRegex)) {
            fileUpload.csv = event.target.files[0];
            this.setState({fileUpload});
            this.readCSVHeaders();
        }
        else if (validator.matches(event.target.value, zipFileRegex)) {
            fileUpload.zip = event.target.files[0];
            let content = await JSZip.loadAsync(fileUpload.zip);

            for (let fileName in content.files) {
                if (!content.files.hasOwnProperty(fileName) || fileName.startsWith('__MACOSX')) continue;
                if (fileName.endsWith('.csv')) {
                    if (fileUpload.csv) {
                        fileUpload.errorMessage = 'Your zip file contained multiple csv files. Please only upload one csv file at a time.';
                        fileUpload.csv = null;
                        fileUpload.zip = null;
                        fileUpload.images = [];
                        fileUpload.isValid = false;
                        break;
                    }
                    fileUpload.csv = content.files[fileName];
                } else {
                    fileUpload.images.push(content.files[fileName]);
                }
            }

            if (!fileUpload.csv && !fileUpload.errorMessage) {
                fileUpload.errorMessage = 'Your zip file didn\'t contain a csv file. Please check the contents of your zip file and try again.';
                fileUpload.zip = null;
                fileUpload.images = [];
                fileUpload.isValid = false;
            }

            this.setState({fileUpload});
            this.readCSVHeaders();
        }
        else {
            event.target.value = '';
            alert('Invalid file type submitted');
        }
    }

    async readCSVHeaders() {
        const csv = this.state.fileUpload.csv;
        if (!csv) return;

        let headersString;
        let shouldContinue = false;
        // For files read from a zip file
        if (csv.async && typeof csv.async === 'function') {
            headersString = await csv.async('string');
        // For files uploaded directly
        } else {
            shouldContinue = true;
            const reader = new FileReader();
            await new Promise(resolve => {
                reader.onload = (e => {
                    headersString = e.target.result;
                    resolve();
                });
                reader.readAsText(csv);
            });
        }

        headersString = headersString.split('\n')[0];

        CSVParser().fromString(headersString)
            .on('header', async headers => {
                if (shouldContinue) {
                    await this.setState({showFieldMapping: true});
                }
                this.setState({mapping: headers.map(header => {
                        return {
                            originalField: header,
                            mappedField: ''
                        }
                    })})
            });
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
            fileUpload.csv = null;
            fileUpload.zip = null;
            fileUpload.images = [];
            fileUpload.message = 'No file chosen';
            fileUploadInputKey++;
        }

        this.setState({fileUpload, fileUploadInputKey});
    }

    handleFeedbackModalClose() {
        this.resetForm(true);
    }

    render() {
        const { fileUpload, showFieldMapping } = this.state;

        return (
            <Card className="bulk-create-form-container">
                <Card.Title>
                    Bulk Create Monuments and Memorials
                </Card.Title>
                {!showFieldMapping && <>
                    {!fileUpload.csv && !fileUpload.zip && this.renderFileUpload()}
                    {fileUpload.images.length > 0 && this.renderUploadedFiles()}
                </>}
                {showFieldMapping && this.renderFieldMapping()}
            </Card>
        );
    }

    renderFileUpload() {
        const { bulkCreateResult } = this.props;
        const { fileUpload, fileUploadInputKey } = this.state;
        return (<Card.Body>
            <Card.Subtitle className="mt-2">
                CSV Upload
            </Card.Subtitle>
            <p className="mb-4">
                You can create multiple monuments or memorials by uploading
                a <code>.csv</code> file with information about them.
            </p>
            <Card.Subtitle>
                Zip Upload
            </Card.Subtitle>
            <p className="mb-4">
                If you're uploading images with your monuments, you must create
                a <code>.zip</code> file containing
                your <code>.csv</code> file and your image files.
            </p>
            <Form>
                <Form.Group className="d-flex flex-column align-items-center mb-0">
                    <label htmlFor="file-upload-input" className="file-upload-input-label btn btn-outline-primary mb-0">
                        <span>Upload CSV or Zip</span>
                    </label>
                    <Form.Control
                        type="file"
                        id="file-upload-input"
                        onChange={(event) => this.handleFileUploadChange(event)}
                        isInvalid={!fileUpload.isValid}
                        accept=".csv,.zip"
                        className="file-upload-input"
                        key={fileUploadInputKey}
                    />
                    <Form.Control.Feedback type="invalid">{fileUpload.errorMessage}</Form.Control.Feedback>
                </Form.Group>
            </Form>

            <div className="feedback-modal-container">
                <FeedbackModal
                    bulkCreateResult={bulkCreateResult}
                    onClose={() => this.handleFeedbackModalClose()}
                />
            </div>
        </Card.Body>)
    }

    renderUploadedFiles() {
        const { fileUpload } = this.state;
        return (<>
            <Card.Body>
                <Card.Subtitle className="d-flex align-items-center">
                    <i className="material-icons mr-1">
                        notes
                    </i>
                    Uploaded CSV File
                </Card.Subtitle>
                <div className="pl-1">
                    {fileUpload.csv && fileUpload.csv.name}
                </div>
                <Card.Subtitle className="d-flex align-items-center mt-3">
                    <i className="material-icons mr-1">
                        image
                    </i>
                    Uploaded Image Files ({fileUpload.images.length})
                </Card.Subtitle>
                <ul className="list-unstyled pl-1">
                {fileUpload.images.map(file => (
                    <li key={file.name} className="mb-1">
                        {file.name}
                    </li>
                ))}
                </ul>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-end">
                <Button variant="bare" onClick={() => this.resetForm(true)}>
                    Cancel
                </Button>
                <Button onClick={() => this.setState({showFieldMapping: true})}>
                    Continue
                </Button>
            </Card.Footer>
        </>)
    }

    renderFieldMapping() {
        const { mapping, fields, fileUpload } = this.state;

        return (<>
            <Card.Body>
                <div className="field-mapping-table">
                    <div className="d-flex row">
                        <div className="column font-weight-bold">
                            Your Fields
                        </div>
                        <div className="column font-weight-bold">
                        </div>
                        <div className="column font-weight-bold">
                            Our Fields
                        </div>
                    </div>
                    {mapping.map(pair => (
                        <div className="d-flex row" key={pair.originalField}>
                            <div className="column d-flex align-items-center">{pair.originalField}</div>
                            <div className="column d-flex align-items-center justify-content-center">
                                <i className="material-icons">
                                    arrow_right_alt
                                </i>
                            </div>
                            <div className="column d-flex justify-content-end my-1">
                                <Form.Control as="select" className="mr-3" value={pair.mappedField} onChange={event => {
                                    pair.mappedField = event.currentTarget.value;
                                    fields.forEach(field => {
                                        field.selected = !!mapping.find(currentPair => {
                                            return currentPair.mappedField === field.name;
                                        });
                                    });
                                    this.setState({mapping, fields});
                                }}>
                                    <option value={null}>Select a Field</option>
                                    {fields.map(field => (
                                        <option key={field.name}
                                                disabled={field.selected && field.name !== pair.mappedField}
                                                value={field.name}>
                                            {field.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </div>
                        </div>
                    ))}
                </div>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-end">
                <Button variant="bare" onClick={() => this.resetForm(true)}>
                    Cancel
                </Button>
                <Button onClick={(event) => this.submitMapping(event)}>
                    Continue
                </Button>
            </Card.Footer>
        </>)
    }
}