import React from 'react';
import './BulkCreateForm.scss';
import { Form, Card, Button } from 'react-bootstrap';
import validator from 'validator';
import { csvFileRegex, zipFileRegex } from '../../utils/regex-util';
import * as JSZip from 'jszip';
import * as CSVParser from 'csvtojson';
import moment from 'moment';
import ExportToCsvButton from '../Export/ExportToCsvButton/ExportToCsvButton';
import { capitalize } from '../../utils/string-util';

/**
 * Presentational component for the Form to submit a CSV file for bulk creating/suggesting Monuments
 */
export default class BulkCreateForm extends React.Component {

    csvExportFields = ['Row Number', 'Warnings', 'Errors'];

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
                {name: 'artist'}, {name: 'title', label: 'Title/Name'}, {name: 'date', label: 'Date Created'},
                {name: 'latitude'}, {name: 'longitude'}, {name: 'city'}, {name: 'state'}, {name: 'address'},
                {name: 'description'}, {name: 'inscription'}, {name: 'tags'}, {name: 'materials'}, {name: 'images'},
                {name: 'references'}, {name: 'contributions', label: 'Submitted By/Contributors'}, {name: 'is_temporary'}
            ].map(field => {
                return {
                    label: capitalize(field.name.replace(/_/g, ' ')),
                    ...field
                }
            })
        };
    }

    /**
     * Build the form object to send to the onSubmit handler
     */
    buildForm() {
        const { fileUpload, mapping } = this.state;

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
        return form;
    }

    submitForValidation() {
        const { onValidationSubmit } = this.props;
        onValidationSubmit(this.buildForm());
    }

    submitCreate() {
        const { onCreateSubmit } = this.props;
        onCreateSubmit(this.buildForm());
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
                        fileUpload.errorMessage = 'Your .zip file contained multiple .csv files. Please only upload one .csv file at a time.';
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
                fileUpload.errorMessage = 'Your zip file didn\'t contain a .csv file. Please check the contents of your .zip file and try again.';
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
        const { fields, fileUpload: { csv, zip } } = this.state;
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
                const mapping = headers.map(header => {
                    let mappedField = '';
                    for (let field of fields) {
                        // By default don't select images on CSV uploads since they don't work.
                        // If the user chooses to select it, let them get the warnings later about it
                        if (field.name === 'images' && !zip) continue;
                        let name = field.name.toLowerCase().trim();
                        let label = field.label.toLowerCase().trim();
                        let trimmedHeader = header.toLowerCase().trim();
                        if ((name === trimmedHeader || label === trimmedHeader ||
                             name.includes(trimmedHeader) || label.includes(trimmedHeader) ||
                             trimmedHeader.includes(name) || trimmedHeader.includes(label)) &&
                             !field.selected && trimmedHeader) {
                            field.selected = true;
                            mappedField = field.name;
                        }
                    }
                    return {
                        originalField: header,
                        mappedField
                    }
                });

                this.setState({mapping, fields})
            });
    }

    /**
     * Resets the state of the Form
     * This means resetting the validation state for all inputs to true and clearing all error messages
     * @param resetValue - If true, also resets the values of the inputs
     */
    resetForm(resetValue) {
        const { fileUpload, fields } = this.state;
        const { onResetForm } = this.props;
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

        fields.forEach(field => field.selected = false);

        onResetForm();
        this.setState({
            fileUpload,
            fileUploadInputKey,
            fields,
            showFieldMapping: false,
            mapping: []
        });
    }

    buildCsvExportData(results) {
        return results.map(result => {return {
            'Row Number': result.index,
            'Warnings': result.warnings.join('\n'),
            'Errors': result.errors.join('\n')
        }});
    }

    render() {
        const { fileUpload, showFieldMapping } = this.state;
        const { showValidationResults, showCreateResults, term } = this.props;

        return (
            <Card className="bulk-create-form-container">
                <Card.Header>
                    <Card.Title>
                        Bulk {term} Monuments and Memorials
                    </Card.Title>
                </Card.Header>
                {!showFieldMapping && !showValidationResults && <>
                    {!fileUpload.csv && !fileUpload.zip && this.renderFileUpload()}
                    {fileUpload.images.length > 0 && this.renderUploadedFiles()}
                </>}
                {showFieldMapping && !showValidationResults && !showCreateResults && this.renderFieldMapping()}
                {showValidationResults && this.renderValidationResults()}
                {showCreateResults && this.renderCreateResults()}
            </Card>
        );
    }

    renderFileUpload() {
        const { fileUpload, fileUploadInputKey } = this.state;
        const { term } = this.props;

        return (<Card.Body>
            <Card.Subtitle className="mt-2">
                CSV Upload
            </Card.Subtitle>
            <p className="mb-4">
                You can {term.toLowerCase()} multiple monuments or memorials by uploading
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
        </Card.Body>)
    }

    renderUploadedFiles() {
        const { fileUpload } = this.state;
        return (<>
            <Card.Body>
                <div className="zip-list-wrapper">
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
                </div>
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
        const { mapping, fields } = this.state;

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
                                            {field.label}
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
                <Button onClick={(event) => this.submitForValidation(event)}>
                    Continue
                </Button>
            </Card.Footer>
        </>)
    }

    renderValidationResults() {
        const { fileUpload } = this.state;
        const { validationResult, actionHappeningTerm, pastTenseTerm } = this.props;

        // TODO: Handle general errors
        // const { error } = validationResult;

        let results = [];
        for (let index in validationResult.results) {
            if (!validationResult.results.hasOwnProperty(index)) continue;
            let row = validationResult.results[index];
            if (row === null) continue;
            row.index = index;
            results.push(row);
        }

        const errorCount = results.filter(result => result.errors.length > 0).length;
        const warningCount = results.filter(result => result.warnings.length > 0).length;

        if (errorCount === 0 && warningCount === 0) {
            return (<>
                <Card.Body>
                    We've validated your <code>{fileUpload.zip ? '.zip' : '.csv'}</code> and have found no errors or warnings.
                    You may now proceed with {actionHappeningTerm.toLowerCase()} {results.length} monuments or memorials.
                </Card.Body>

                <Card.Footer className="d-flex justify-content-end">
                    <Button variant="bare" onClick={() => this.resetForm(true)}>
                        Cancel
                    </Button>
                    <Button onClick={() => this.submitCreate()}>
                        Continue
                    </Button>
                </Card.Footer>
            </>);
        }

        let errorString = [];
        if (errorCount > 0) errorString.push(errorCount + ' error' + (errorCount > 1 ? 's' : ''));
        if (warningCount > 0) errorString.push(warningCount + ' warning' + (warningCount > 1 ? 's' : ''));
        errorString = errorString.join(' and ');

        const fileString = (<code>{fileUpload.zip ? '.zip' : '.csv'}</code>);

        results = results.filter(result => result.errors.length > 0 || result.warnings.length > 0);

        return (<>
            <Card.Body>
                <div>
                    We've encountered {errorString} while validating your {fileString}.
                    Please review them below. You may fix issues within your {fileString} file and re-upload it here.
                </div>
                <div className="validation-table-wrapper mt-4 mb-1">
                    <table className="table validation-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Warnings</th>
                                <th>Errors</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                results.map(result => (
                                    <tr key={result.index}>
                                        <td>{result.index}</td>
                                        <td>{result.warnings.map((warning, index) => (
                                            <div key={index} dangerouslySetInnerHTML={{__html: warning}}/>
                                        ))}</td>
                                        <td>{result.errors.map((error, index) => (
                                            <div key={index}>{error}</div>
                                        ))}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {warningCount > 0 && errorCount === 0 &&
                    <div>
                        If you choose to continue with warnings, the affected rows will still be
                        {pastTenseTerm.toLowerCase()}, but may have non-critical issues that should be addressed with
                        updates later.
                    </div>
                }
                {errorCount > 0 &&
                    <div>
                        If you choose to continue with errors, any rows with errors
                        will <span className="font-weight-bold">not</span> be {pastTenseTerm.toLowerCase()}. Any rows
                        with warnings will still be {pastTenseTerm.toLowerCase()}, but may have non-critical issues that
                        should be addressed with updates later.
                    </div>
                }
            </Card.Body>
            <Card.Footer className="d-flex justify-content-end">
                <ExportToCsvButton className="mr-2" fields={this.csvExportFields} data={this.buildCsvExportData(results)}
                                   exportTitle={`Validation Results ${moment().format('YYYY-MM-DD hh:mm')}`}/>
                {warningCount > 0 && errorCount === 0 &&
                    <Button variant="warning" className="mr-2" onClick={() => this.submitCreate()}>
                        Continue With Warnings
                    </Button>
                }
                {errorCount > 0 &&
                    <Button variant="danger" className="mr-2" onClick={() => this.submitCreate()}>
                        Continue With Errors
                    </Button>
                }

                <Button onClick={() => this.resetForm(true)}>
                    Re-Upload File
                </Button>
            </Card.Footer>
        </>);
    }

    renderCreateResults() {
        const { createResult, pastTenseTerm } = this.props;
        return (
            <Card.Body>
                <h5>Success!</h5>
                <div>
                    {createResult.length} monuments or memorials have been {pastTenseTerm.toLowerCase()}. I would list
                    them out here, but pretty soon they're just going to be suggestions anyway!
                </div>
            </Card.Body>
        );
    }
}