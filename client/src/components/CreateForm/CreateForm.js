import React from 'react';
import './CreateForm.scss';
import { Form, Button, ButtonToolbar, Collapse } from 'react-bootstrap';
import {latitudeRegex, longitudeRegex} from "../../utils/regex-util";
import ImageUploader from 'react-images-upload';
import TagsSearch from '../Search/TagsSearch/TagsSearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import validator from 'validator';
import NoImageModal from './NoImageModal/NoImageModal';
import ReviewModal from './ReviewModal/ReviewModal';

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
            artist: {
                value: '',
                isValid: true,
                message: ''
            },
            description: {
                value: '',
                isValid: true,
                message: ''
            },
            inscription: {
                value: '',
                isValid: true,
                message: ''
            },
            references: [reference],
            images: [],
            imageUploaderKey: 0,
            showingNoImageModal: false,
            materials: {
                materialObjects: [],
                isValid: true,
                message: ''
            },
            newMaterials: [],
            tags: [],
            newTags: [],
            showingReviewModal: false
        };

        this.materialsSelectRef = React.createRef();
        this.tagsSelectRef = React.createRef();
    }

    handleAdvancedInformationClick() {
        const { showingAdvancedInformation } = this.state;

        this.setState({showingAdvancedInformation: !showingAdvancedInformation});
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
        const { references } = this.state;

        references.push(newReference);

        this.setState({references});
    }

    handleInputChange(event) {
        const currentState = this.state[event.target.name];
        currentState.value = event.target.value;

        this.setState({[event.target.name]: currentState});
    }

    handleReferenceChange(event) {
        const currentReferences = this.state.references;
        const index = parseInt(event.target.name.split('-')[1]);

        currentReferences[index].value = event.target.value;

        this.setState({references: currentReferences});
    }

    async handleImageUploaderChange(files) {
        await this.setState({images: files});
    }

    handleCancelButtonClick() {
        const { onCancelButtonClick } = this.props;

        onCancelButtonClick();
    }

    handleNoImageModalClose() {
        this.setState({showingNoImageModal: false});
    }

    async handleNoImageModalContinue() {
        await this.setState({showingNoImageModal: false});
        this.setState({showingReviewModal: true});
    }

    handleMaterialSelect(variant, selectedMaterials, createdMaterials) {
        const { materials } = this.state;
        let { newMaterials } = this.state;

        materials.materialObjects = selectedMaterials;
        newMaterials = createdMaterials;
        this.setState({materials, newMaterials});
    }

    handleTagSelect(variant, selectedTags, createdTags) {
        this.setState({tags: selectedTags, newTags: createdTags});
    }

    handleSubmit(event) {
        event.preventDefault();

        this.resetForm(false);

        if (this.validateForm()) {
            if (!this.validateImages()) {
                this.setState({showingNoImageModal: true});
            }
            else {
                this.setState({showingReviewModal: true});
            }
        }
    }

    /**
     * Resets the state of the Form
     * This means resetting the validation state for all inputs to true and clearing all error messages
     * @param resetValue - If true, also resets the values inside the inputs
     */
    resetForm(resetValue) {
        const { title, address, latitude, longitude, year, month, artist, description, inscription,
            references } = this.state;
        let { datePickerCurrentDate, images, imageUploaderKey, materials, newMaterials, tags, newTags } = this.state;

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

        artist.isValid = true;
        artist.message = '';

        description.isValid = true;
        description.message = '';

        inscription.isValid = true;
        inscription.message = '';

        references.forEach(reference => {
            reference.isValid = true;
            reference.message = '';

            if (resetValue) {
                reference.value = '';
            }
        });

        materials.isValid = true;
        materials.message = '';

        if (resetValue) {
            title.value = '';
            address.value = '';
            latitude.value = '';
            longitude.value = '';
            year.value = '';
            month.value = '0';
            artist.value = '';
            description.value = '';
            inscription.value = '';
            datePickerCurrentDate = new Date();
            images = [];
            imageUploaderKey++;
            materials.materialObjects = [];
            newMaterials = [];
            this.materialsSelectRef.current.handleClear();
            this.materialsSelectRef.current.handleSelectedTagsClear();
            tags = [];
            newTags = [];
            this.tagsSelectRef.current.handleClear();
            this.tagsSelectRef.current.handleSelectedTagsClear();
        }

        this.setState({title, address, latitude, longitude, year, month, artist, description, inscription,
            datePickerCurrentDate, references, images, imageUploaderKey, materials, newMaterials, tags, newTags});
    }

    /**
     * Validates the Form
     * If any of the inputs are invalid, the entire Form is considered invalid
     * @returns {boolean} - True if the Form is valid, False otherwise
     */
    validateForm() {
        const { title, address, latitude, longitude, year, month, references, materials, newMaterials } = this.state;
        const currentDate = new Date();
        let formIsValid = true;

        /* Title Validation */
        /* Title is a required Form field */
        if (validator.isEmpty(title.value)) {
            title.isValid = false;
            title.message = 'Title is required';
            formIsValid = false;
        }

        /* Materials Validation */
        /* Materials is a required Form field */
        if ((!materials.materialObjects || !materials.materialObjects.length)
            && (!newMaterials || !newMaterials.length))
        {
            materials.isValid = false;
            materials.message = 'At least one Material is required';
            formIsValid = false;
        }

        /* Address or Coordinates Validation */
        /* An Address OR Coordinates must be specified */
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
        /* Check that the Latitude is within a valid range and formatted correctly */
        if (validator.isEmpty(address.value) && !validator.isEmpty(latitude.value)) {
            if (!validator.matches(latitude.value, latitudeRegex)) {
                latitude.isValid = false;
                latitude.message = 'Latitude must be valid';
                formIsValid = false;
            }
        }

        /* Longitude Validation */
        /* Check that the Longitude is within a valid range and formatted correctly */
        if (validator.isEmpty(address.value) && !validator.isEmpty(longitude.value)) {
            if (!validator.matches(longitude.value, longitudeRegex)) {
                longitude.isValid = false;
                longitude.message = 'Longitude must be valid';
                formIsValid = false;
            }
        }

        /* Date Validation */
        /* Check that the Year and Month specified are not in the future */
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
        /* Check that the References are valid URLs */
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

    validateImages() {
        const { images } = this.state;

        return !(!images || !images.length);
    }

    /**
     * Build the form object based on the current values of the inputs
     */
    buildForm() {
        const { title, address, latitude, longitude, dateSelectValue, year, month, artist, description, inscription,
        datePickerCurrentDate, references, images, materials, newMaterials, tags, newTags } = this.state;

        let form = {
            title: title.value,
            address: address.value === '' ? null : address.value,
            latitude: (latitude.value === '' && longitude.value === '') ? null : latitude.value,
            longitude: (latitude.value === '' && longitude.value === '') ? null : longitude.value,
            artist: artist.value === '' ? null : artist.value,
            description: description.value === '' ? null : description.value,
            inscription: inscription.value === '' ? null : inscription.value,
            references: references.map(reference => reference.value),
            images: images,
            materials: materials.materialObjects.map(material => material.name),
            newMaterials: newMaterials.map(newMaterial => newMaterial.name),
            tags: tags.map(tag => tag.name),
            newTags: newTags.map(newTag => newTag.name)
        };

        switch (dateSelectValue) {
            case 'year':
                form.year = year.value === '' ? null : year.value;
                break;
            case 'month-year':
                form.year = year.value === '' ? null : year.value;
                form.month = month.value;
                break;
            case 'exact-date':
                form.date = datePickerCurrentDate;
                break;
            default:
                break;
        }

        return form;
    }

    /**
     * Build a form object and send it to the onSubmit handler
     */
    submitForm() {
        const { onSubmit } = this.props;

        let form = this.buildForm();

        onSubmit(form);
    }

    handleReviewModalCancel() {
        this.setState({showingReviewModal: false});
    }

    render() {
        const { showingAdvancedInformation, dateSelectValue, datePickerCurrentDate, title, address, latitude,
            longitude, year, month, artist, description, inscription, references, imageUploaderKey, showingNoImageModal,
            materials, showingReviewModal } = this.state;

        const advancedInformationLink = (
            <div className='advanced-information-link more-link' onClick={() => this.handleAdvancedInformationClick()}>Want to tell us more?</div>
        );

        const hideAdvancedInformationLink = (
            <div className='advanced-information-link hide-link' onClick={() => this.handleAdvancedInformationClick()}>Hide More Information</div>
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

        const invalidMaterials = (
            <div className='invalid-feedback materials'>{materials.message}</div>
        );

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
                            onChange={(variant, selectedMaterials, createdMaterials) =>
                                this.handleMaterialSelect(variant, selectedMaterials, createdMaterials)}
                            allowTagCreation={true}
                            className={materials.isValid ? undefined : 'is-invalid'}
                            ref={this.materialsSelectRef}
                        />
                        {!materials.isValid && invalidMaterials}
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
                            onChange={(files) => this.handleImageUploaderChange(files)}
                            key={imageUploaderKey}
                            errorClass='invalid-feedback'
                        />
                    </Form.Group>

                    <Collapse in={showingAdvancedInformation}>
                        <div>
                            {/* Artist */}
                            <Form.Group controlId='create-form-artist'>
                                <Form.Label>Artist:</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='artist'
                                    placeholder='Artist'
                                    value={artist.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!artist.isValid}
                                    className='text-control'
                                />
                                <Form.Control.Feedback type='invalid'>{artist.message}</Form.Control.Feedback>
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
                                    name='description'
                                    placeholder='Description'
                                    value={description.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!description.isValid}
                                    className='multi-line-text-control'
                                />
                                <Form.Control.Feedback type='invalid'>{description.message}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Inscription */}
                            <Form.Group controlId='create-form-inscription'>
                                <Form.Label>Inscription:</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows='3'
                                    name='inscription'
                                    placeholder='Inscription'
                                    value={inscription.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!inscription.isValid}
                                    className='multi-line-text-control'
                                />
                                <Form.Control.Feedback type='invalid'>{inscription.message}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Tags */}
                            <Form.Group controlId='create-form-tags'>
                                <Form.Label>Tags:</Form.Label>
                                <TagsSearch
                                    variant='tags'
                                    onChange={(variant, selectedTags, createdTags) =>
                                        this.handleTagSelect(variant, selectedTags, createdTags)}
                                    allowTagCreation={true}
                                    ref={this.tagsSelectRef}
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

                <div className='no-image-modal-container'>
                    <NoImageModal
                        showing={showingNoImageModal}
                        onClose={() => this.handleNoImageModalClose()}
                        onCancel={() => this.handleNoImageModalClose()}
                        onContinue={() => this.handleNoImageModalContinue()}
                    />
                </div>

                <div className='review-modal-container'>
                    <ReviewModal
                        showing={showingReviewModal}
                        onCancel={() => this.handleReviewModalCancel()}
                        onConfirm={() => this.submitForm()}
                        form={this.buildForm()}
                        dateSelectValue={dateSelectValue}
                    />
                </div>
            </div>
        );
    }
}