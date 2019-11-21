import React from 'react';
import './CreateForm.scss';
import { Form, Button, ButtonToolbar, Collapse } from 'react-bootstrap';
import {latitudeRegex, longitudeRegex} from "../../utils/regex-util";
import ImageUploader from 'react-images-upload';
import TagsSearch from '../Search/TagsSearch/TagsSearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import validator from 'validator';

/**
 * Presentational component for the Form for creating a new Monument
 */
export default class CreateForm extends React.Component {

    constructor(props) {
        super(props);

        const reference = {
            value: '',
            isValid: true,
            message: ''
        };

        this.state = {
            showingAdvancedInformation: false,
            dateSelectValue: 'year',
            datePickerCurrentDate: new Date(),
            title: {
                value: '',
                isValid: true,
                message: ''
            },
            address: {
                value: '',
                isValid: true,
                message: ''
            },
            latitude: {
                value: '',
                isValid: true,
                message: ''
            },
            longitude: {
                value: '',
                isValid: true,
                message: ''
            },
            year: {
                value: '',
                isValid: true,
                message: ''
            },
            month: {
                value: '0',
                isValid: true,
                message: ''
            },
            references: [reference]
        };
    }

    handleShowAdvancedInformationClick() {
        this.setState({showingAdvancedInformation: true});
    }

    handleHideAdvancedInformationClick() {
        this.setState({showingAdvancedInformation: false});
    }

    handleDateSelectChange(event) {
        this.setState({dateSelectValue: event.target.value});
    }

    handleDatePickerChange(date) {
        this.setState({datePickerCurrentDate: date});
    }

    handleAddAnotherReferenceLinkClick() {
        const newReference = {
            value: '',
            isValid: true,
            message: ''
        };
        const {references} = this.state;

        references.push(newReference);

        this.setState({references});
    }

    handleInputChange(event) {
        const currentState = this.state[event.target.name];
        currentState.value = event.target.value;

        this.setState({ [event.target.name]: currentState});
    }

    handleReferenceChange(event) {
        const currentReferences = this.state.references;
        const index = parseInt(event.target.name.split('-')[1]);

        currentReferences[index].value = event.target.value;

        this.setState({references: currentReferences});
    }

    handleSubmit(event) {
        event.preventDefault();

        this.resetForm(false);

        if (this.validateForm()) {
            console.log('Valid form!');
        }
    }

    resetForm(resetValue) {
        const { title, address, latitude, longitude, year, month, references } = this.state;
        let { datePickerCurrentDate } = this.state;

        title.isValid = true;
        title.message = '';

        address.isValid = true;
        address.message = '';

        latitude.isValid = true;
        latitude.message = '';

        longitude.isValid = true;
        longitude.message = '';

        year.isValid = true;
        year.message = '';

        month.isValid = true;
        month.message = '';

        references.forEach(reference => {
            reference.isValid = true;
            reference.message = '';

            if (resetValue) {
                reference.value = '';
            }
        });

        if (resetValue) {
            title.value = '';
            address.value = '';
            latitude.value = '';
            longitude.value = '';
            year.value = '';
            month.value = '1';
            datePickerCurrentDate = new Date();
        }

        this.setState({title, address, latitude, longitude, year, month, datePickerCurrentDate, references});
    }

    validateForm() {
        const { title, address, latitude, longitude, year, month, references } = this.state;
        const currentDate = new Date();
        let formIsValid = true;

        /* Title Validation */
        if (validator.isEmpty(title.value)) {
            title.isValid = false;
            title.message = 'Title is required';
            formIsValid = false;
        }

        /* Address or Coordinates Validation */
        if (validator.isEmpty(address.value) &&
            (validator.isEmpty(latitude.value) || validator.isEmpty(longitude.value))) {
            address.isValid = false;
            address.message = 'Address OR Coordinates are required';

            latitude.isValid = false;
            latitude.message = 'Address OR Coordinates are required';

            longitude.isValid = false;
            longitude.message = 'Address OR Coordinates are required';

            formIsValid = false;
        }

        /* Latitude Validation */
        if (validator.isEmpty(address.value) && !validator.isEmpty(latitude.value)) {
            if (!validator.matches(latitude.value, latitudeRegex)) {
                latitude.isValid = false;
                latitude.message = 'Latitude must be valid';
                formIsValid = false;
            }
        }

        /* Longitude Validation */
        if (validator.isEmpty(address.value) && !validator.isEmpty(longitude.value)) {
            if (!validator.matches(longitude.value, longitudeRegex)) {
                longitude.isValid = false;
                longitude.message = 'Longitude must be valid';
                formIsValid = false;
            }
        }

        /* Date Validation */
        if (!validator.isEmpty(year.value)) {
            const yearInt = parseInt(year.value);
            const monthInt = parseInt(month.value);

            if (yearInt <= 0) {
                year.isValid = false;
                year.message = 'Year must be valid';
                formIsValid = false;
            }
            else if (yearInt > currentDate.getFullYear()) {
                year.isValid = false;
                year.message = 'Year must be valid';
                formIsValid = false;
            }
            else {
                if (yearInt === currentDate.getFullYear()) {
                    if (monthInt > currentDate.getMonth()) {
                        month.isValid = false;
                        month.message = 'Month must be valid';
                        formIsValid = false;
                    }
                }
            }
        }

        /* References Validation */
        references.forEach(reference => {
            if (!validator.isEmpty(reference.value)) {
                if (!validator.isURL(reference.value)) {
                    reference.isValid = false;
                    reference.message = 'Reference must be a valid URL';
                    formIsValid = false;
                }
            }
        });

        if (!formIsValid) {
            this.setState({title, address, latitude, longitude, year, month, references});
        }

        return formIsValid;
    }

    render() {
        const { showingAdvancedInformation, dateSelectValue, datePickerCurrentDate, title, address, latitude,
            longitude, year, month, references } = this.state;

        const advancedInformationLink = (
            <div className='advanced-information-link' onClick={() => this.handleShowAdvancedInformationClick()}>Show Advanced Information</div>
        );

        const hideAdvancedInformationLink = (
            <div className='advanced-information-link' onClick={() => this.handleHideAdvancedInformationClick()}>Hide Advanced Information</div>
        );

        let dateInput;

        const dateYearInput = (
            <Form.Group controlId='create-form-date-year'>
                <Form.Label>Year:</Form.Label>
                <Form.Control
                    type='number'
                    name='year'
                    placeholder='YYYY'
                    value={year.value}
                    onChange={(event) => this.handleInputChange(event)}
                    isInvalid={!year.isValid}
                    className='text-control-small'
                />
                <Form.Control.Feedback type='invalid'>{year.message}</Form.Control.Feedback>
            </Form.Group>
        );

        switch (dateSelectValue) {
            case 'year':
                dateInput = dateYearInput;
                break;
            case 'month-year':
                dateInput = (
                    <Form.Row>
                        <Form.Group controlId='create-form-date-month'>
                            <Form.Label>Month:</Form.Label>
                            <Form.Control
                                as='select'
                                name='month'
                                value={month.value}
                                onChange={(event) => this.handleInputChange(event)}
                                isInvalid={!month.isValid}
                                className='select-control mr-2'
                            >
                                <option value='0'>January</option>
                                <option value='1'>February</option>
                                <option value='2'>March</option>
                                <option value='3'>April</option>
                                <option value='4'>May</option>
                                <option value='5'>June</option>
                                <option value='6'>July</option>
                                <option value='7'>August</option>
                                <option value='8'>September</option>
                                <option value='9'>October</option>
                                <option value='10'>November</option>
                                <option value='11'>December</option>
                            </Form.Control>
                            <Form.Control.Feedback type='invalid'>{month.message}</Form.Control.Feedback>
                        </Form.Group>

                        {dateYearInput}
                    </Form.Row>
                );
                break;
            case 'exact-date':
                const minimumDate = new Date(1, 0);
                minimumDate.setFullYear(1);
                const currentDate = new Date();

                dateInput = (
                    <Form.Group controlId='create-form-datepicker'>
                        <Form.Label>Choose a Date:</Form.Label>
                        <DatePicker
                            selected={datePickerCurrentDate}
                            onChange={(date) => this.handleDatePickerChange(date)}
                            minDate={minimumDate}
                            maxDate={currentDate}
                        />
                        <Form.Control.Feedback type='invalid'>Test</Form.Control.Feedback>
                    </Form.Group>
                );
                break;
            default:
                dateInput = <div/>;
        }

        const referenceInputs = [];

        references.forEach((reference, index) => {
            referenceInputs.push(
                <div className='reference-container' key={index}>
                    <Form.Label>Reference:</Form.Label>
                    <Form.Control
                        type='text'
                        name={'reference-' + index}
                        placeholder='Reference URL'
                        value={reference.value}
                        onChange={(event) => this.handleReferenceChange(event)}
                        isInvalid={!reference.isValid}
                        className='text-control'
                    />
                    <Form.Control.Feedback type='invalid'>{reference.message}</Form.Control.Feedback>
                </div>
            );
        });

        return (
            <div className='create-form-container'>
                <div className='h5'>
                    Create a new Monument or Memorial
                </div>

                <Form onSubmit={(event) => this.handleSubmit(event)}>
                    {/* Title */}
                    <Form.Group controlId='create-form-title'>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            type='text'
                            name='title'
                            placeholder='Title'
                            value={title.value}
                            onChange={(event) => this.handleInputChange(event)}
                            isInvalid={!title.isValid}
                            className='text-control'
                        />
                        <Form.Control.Feedback type='invalid'>{title.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Materials */}
                    <Form.Group controlId='create-form-materials'>
                        <Form.Label>Materials:</Form.Label>
                        <TagsSearch
                            variant='materials'
                            searchAfterTagSelect={false}
                        />
                        <Form.Control.Feedback type='invalid'>Test</Form.Control.Feedback>
                    </Form.Group>

                    <div className='address-coordinates-container'>
                        <span className='font-weight-bold'>Please specify one of the following:</span>

                        {/* Address */}
                        <Form.Group controlId='create-form-address'>
                            <Form.Label>Address:</Form.Label>
                            <Form.Control
                                type='text'
                                name='address'
                                placeholder='Address'
                                value={address.value}
                                onChange={(event) => this.handleInputChange(event)}
                                isInvalid={!address.isValid}
                                className='text-control'
                            />
                            <Form.Control.Feedback type='invalid'>{address.message}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Coordinates */}
                        <Form.Group controlId='create-form-coordinates'>
                            <Form.Label>Coordinates:</Form.Label>
                            <Form.Row>
                                <Form.Control
                                    type='text'
                                    name='latitude'
                                    placeholder='Latitude'
                                    value={latitude.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!latitude.isValid}
                                    className='text-control-small mr-2'
                                />
                                <Form.Control.Feedback type='invalid'>{latitude.message}</Form.Control.Feedback>
                                <Form.Control
                                    type='text'
                                    name='longitude'
                                    placeholder='Longitude'
                                    value={longitude.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!longitude.isValid}
                                    className='text-control-small'
                                />
                                <Form.Control.Feedback type='invalid'>{longitude.message}</Form.Control.Feedback>
                            </Form.Row>
                        </Form.Group>
                    </div>

                    {/* Images */}
                    <Form.Group controlId='create-form-image'>
                        <Form.Label>Images:</Form.Label>
                        <ImageUploader
                            withIcon={false}
                            imgExtension={['.jpg', '.png']}
                            label=''
                            fileSizeError='File size is too large'
                            fileTypeError='File type is not supported'
                            withPreview={true}
                        />
                    </Form.Group>

                    <Collapse in={showingAdvancedInformation}>
                        <div>
                            {/* Artist */}
                            <Form.Group controlId='create-form-artist'>
                                <Form.Label>Artist:</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Artist'
                                    className='text-control'
                                />
                                <Form.Control.Feedback type='invalid'>Test</Form.Control.Feedback>
                            </Form.Group>

                            <div className='date-container'>
                                {/* Date */}
                                <Form.Group controlId='create-form-date-select'>
                                    <Form.Label>Date:</Form.Label>
                                    <Form.Control
                                        as='select'
                                        className='select-control'
                                        onChange={(event) => this.handleDateSelectChange(event)}
                                    >
                                        <option value='year'>Year</option>
                                        <option value='month-year'>Month/Year</option>
                                        <option value='exact-date'>Exact Date</option>
                                    </Form.Control>
                                </Form.Group>

                                {/* Date: Input (Year, Year/Month, or Date Picker) */}
                                {dateInput}
                            </div>

                            {/* Description */}
                            <Form.Group controlId='create-form-description'>
                                <Form.Label>Description:</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows='3'
                                    placeholder='Description'
                                    className='multi-line-text-control'
                                />
                                <Form.Control.Feedback type='invalid'>Test</Form.Control.Feedback>
                            </Form.Group>

                            {/* Inscription */}
                            <Form.Group controlId='create-form-inscription'>
                                <Form.Label>Inscription:</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows='3'
                                    placeholder='Inscription'
                                    className='multi-line-text-control'
                                />
                                <Form.Control.Feedback type='invalid'>Test</Form.Control.Feedback>
                            </Form.Group>

                            {/* Tags */}
                            <Form.Group controlId='create-form-tags'>
                                <Form.Label>Tags:</Form.Label>
                                <TagsSearch
                                    variant='tags'
                                    searchAfterTagSelect={false}
                                />
                            </Form.Group>

                            <div className='references-container'>
                                {/* References */}
                                <Form.Group controlId='create-form-references'>
                                    {referenceInputs}
                                </Form.Group>

                                <div className='add-reference-link' onClick={() => this.handleAddAnotherReferenceLinkClick()}>+ Add Another Reference</div>
                            </div>
                        </div>
                    </Collapse>

                    {!showingAdvancedInformation && advancedInformationLink}
                    {showingAdvancedInformation && hideAdvancedInformationLink}

                    <ButtonToolbar>
                        <Button
                            variant='primary'
                            type='submit'
                            className='mr-4 mt-1'>
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
                            className='mt-1'>
                            Cancel
                        </Button>
                    </ButtonToolbar>
                </Form>
            </div>
        );
    }
}