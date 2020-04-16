import React from 'react';
import './CreateOrUpdateForm.scss';
import { Form, Button, ButtonToolbar, Collapse, OverlayTrigger, Tooltip, ButtonGroup } from 'react-bootstrap';
import { latitudeRegex, longitudeRegex } from '../../utils/regex-util';
import ImageUploader from 'react-images-upload';
import TagsSearch from '../Search/TagsSearch/TagsSearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import validator from 'validator';
import { isEmptyObject } from '../../utils/object-util';

/**
 * Presentational component for the Form for creating a new Monument or updating an existing Monument
 */
export default class CreateOrUpdateForm extends React.Component {

    constructor(props) {
        super(props);

        const reference = {
            value: '',
            isValid: true,
            message: ''
        };

        this.state = {
            locationType: {
                value: '',
                isValid: true,
                message: ''
            },
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
            imagesForUpdate:[],
            imageUploaderKey: 0,
            materials: {
                materialObjects: [],
                isValid: true,
                message: ''
            },
            newMaterials: [],
            tags: [],
            newTags: [],
            isTemporary: {
                value: false,
                isValid: true,
                message: ''
            }
        };

        this.materialsSelectRef = React.createRef();
        this.tagsSelectRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (isEmptyObject(prevProps.monument) && !isEmptyObject(this.props.monument)) {
            this.setFormFieldValuesForUpdate();
        }
    }

    /**
     * Clear the state of the Form
     * This means resetting the validation state for all inputs to true and clearing all error messages
     * @param clearValues - If true, also clears the values inside the inputs
     */
    clearForm(clearValues) {
        const { title, address, latitude, longitude, year, month, artist, description, inscription,
            references, isTemporary } = this.state;
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

        for (let reference of references) {
            reference.isValid = true;
            reference.message = '';

            if (clearValues) {
                reference.value = '';
            }
        }

        materials.isValid = true;
        materials.message = '';

        isTemporary.isValid = true;
        isTemporary.message = '';

        if (clearValues) {
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
            isTemporary.value = false;
        }

        this.setState({title, address, latitude, longitude, year, month, artist, description, inscription,
            datePickerCurrentDate, references, images, imageUploaderKey, materials, newMaterials, tags, newTags, isTemporary});
    }

    /**
     * Sets the values of Form fields to be the values of the Monument that is being updated
     */
    setFormFieldValuesForUpdate() {
        const { monument } = this.props;
        const { title, address, latitude, longitude, year, month, artist, description, inscription,
            materials, locationType } = this.state;
        let { datePickerCurrentDate, references, tags, imagesForUpdate, images, imageUploaderKey } = this.state;

        let monumentYear, monumentMonth, monumentExactDate;

        if (monument.date) {
            const monumentDateArray = monument.date.split('-');

            monumentYear = monumentDateArray[0];

            let monumentMonthInt = parseInt(monumentDateArray[1]) - 1;
            monumentMonth = (monumentMonthInt).toString();

            monumentExactDate = new Date(parseInt(monumentYear), monumentMonthInt, monumentDateArray[2]);
        }

        title.value = monument.title ? monument.title : '';
        address.value = monument.address ? monument.address : '';
        latitude.value = monument.lat ? monument.lat.toString() : '';
        longitude.value = monument.lon ? monument.lon.toString() : '';
        artist.value = monument.artist ? monument.artist : '';
        description.value = monument.description ? monument.description : '';
        inscription.value = monument.inscription ? monument.inscription : '';
        year.value = monumentYear ? monumentYear : '';
        month.value = monumentMonth ? monumentMonth : '';
        datePickerCurrentDate = monumentExactDate ? monumentExactDate : new Date();

        if (address.value) locationType.value = 'address';
        else if (latitude.value && longitude.value) locationType.value = 'coordinates';

        if (monument.references && monument.references.length) {
            let monumentReferences = [];
            for (const reference of monument.references) {
                let monumentReference = {
                    id: reference.id,
                    value: reference.url,
                    isValid: true,
                    message: ''
                };

                monumentReferences.push(monumentReference);
            }

            references = monumentReferences.length ? monumentReferences : references;
        }

        if (monument.monumentTags && monument.monumentTags.length) {
            let associatedMaterials = [];
            let associatedTags = [];

            for (const monumentTag of monument.monumentTags) {
                monumentTag.tag.selected = true;

                if (monumentTag.tag.isMaterial) {
                    associatedMaterials.push(monumentTag.tag);
                }
                else {
                    associatedTags.push(monumentTag.tag);
                }
            }

            if (associatedMaterials.length) {
                materials.materialObjects = associatedMaterials;
                this.materialsSelectRef.current.state.selectedTags = associatedMaterials;
            }

            if (associatedTags.length) {
                tags = associatedTags;
                this.tagsSelectRef.current.state.selectedTags = associatedTags;
            }
        }

        if (monument.images && monument.images.length) {
            imagesForUpdate = [];
            for (const image of monument.images) {
                imagesForUpdate.push(
                    {
                        id: image.id,
                        url: image.url,
                        isPrimary: image.isPrimary,
                        hasBeenDeleted: false
                    }
                )
            }
        }

        images = [];
        imageUploaderKey++;

        this.setState({title, address, latitude, longitude, artist, description, inscription, year, month,
            datePickerCurrentDate, references, materials, tags, imagesForUpdate, images, imageUploaderKey, locationType});
    }

    /**
     * Validates the Form
     * If any of the inputs are invalid, the entire Form is considered invalid
     * @returns {boolean} - True if the Form is valid, False otherwise
     */
    validateForm() {
        const { title, address, latitude, longitude, year, month, references, materials, newMaterials, locationType } = this.state;
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
        if (locationType.value === 'address') {
            if (validator.isEmpty(address.value)) {
                address.isValid = false;
                address.message = 'Address must not be blank';
                formIsValid = false;
            }
        } else if (locationType.value === 'coordinates') {
            if (validator.isEmpty(latitude.value)) {
                latitude.isValid = false;
                latitude.message = 'Latitude must not be blank';
                formIsValid = false;
            } else if (latitude.value.includes('°')) {
                latitude.isValid = false;
                latitude.message = 'Please use decimal coordinates, not degrees. ' +
                    'To convert, input your degrees into Google Maps and copy the new numbers here.';
                formIsValid = false;
            } else if (!validator.matches(latitude.value, latitudeRegex)) {
                latitude.isValid = false;
                latitude.message = 'Latitude must be valid';
                formIsValid = false;
            } else {
                const latAsDouble = parseFloat(latitude.value);
                // Alaska is the furthest north location and its latitude is approximately 71
                // The American Samoa is the furthest south location and its latitude is approximately -14
                if (latAsDouble > 72 || latAsDouble < -15) {
                    latitude.isValid = false;
                    latitude.message = 'Latitude is not near the United States';
                    formIsValid = false;
                }
            }

            if (validator.isEmpty(longitude.value)) {
                longitude.isValid = false;
                longitude.message = 'Longitude must not be blank';
                formIsValid = false;
            } else if (longitude.value.includes('°')) {
                longitude.isValid = false;
                longitude.message = 'Please use decimal coordinates, not degrees. ' +
                    'To convert, input your degrees into Google Maps and copy the new numbers here.';
                formIsValid = false;
            }
            else if (!validator.matches(longitude.value, longitudeRegex)) {
                longitude.isValid = false;
                longitude.message = 'Longitude must be valid';
                formIsValid = false;
            } else {
                const lonAsDouble = parseFloat(longitude.value);
                // Guam is the furthest west location and its longitude is approximately 144
                // Puerto Rico is the furthest east location and its longitude is approximately -65
                if (lonAsDouble > -64 && !(lonAsDouble < 180 && lonAsDouble > 143)) {
                    longitude.isValid = false;
                    longitude.message = 'Longitude is not near the United States';
                    formIsValid = false;
                }
            }
        } else {
            locationType.isValid = false;
            locationType.message = 'You must provide either a street address or geographic coordinates';
            formIsValid = false;
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
        for (let reference of references) {
            if (!validator.isEmpty(reference.value)) {
                if (!validator.isURL(reference.value)) {
                    reference.isValid = false;
                    reference.message = 'Reference must be a valid URL';
                    formIsValid = false;
                }
            }
        }

        if (!formIsValid) {
            this.setState({title, address, latitude, longitude, year, month, references});
        }

        return formIsValid;
    }

    /**
     * Build the form object for creating a new CreateMonumentSuggestion
     */
    buildCreateForm() {
        const { title, address, latitude, longitude, dateSelectValue, year, month, artist, description, inscription,
            datePickerCurrentDate, references, images, materials, newMaterials, tags, newTags, isTemporary } = this.state;

        let createForm = {
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
            newTags: newTags.map(newTag => newTag.name),
            dateSelectValue: dateSelectValue,
            isTemporary: isTemporary.value
        };

        switch (dateSelectValue) {
            case 'year':
                createForm.year = year.value === '' ? null : year.value;
                break;
            case 'month-year':
                createForm.year = year.value === '' ? null : year.value;
                createForm.month = month.value;
                break;
            case 'exact-date':
                createForm.date = datePickerCurrentDate;
                break;
            default:
                break;
        }

        // JSON fields
        createForm.referencesJson = JSON.stringify(createForm.references);
        createForm.materialsJson = JSON.stringify(createForm.materials);
        createForm.newMaterialsJson = JSON.stringify(createForm.newMaterials);
        createForm.tagsJson = JSON.stringify(createForm.tags);
        createForm.newTagsJson = JSON.stringify(createForm.newTags);

        return createForm;
    }

    /**
     * Build the form object for creating an UpdateMonumentSuggestion
     */
    buildUpdateForm() {
        const { title, address, artist, description, inscription, latitude, longitude, dateSelectValue, year, month,
            datePickerCurrentDate, references, images, imagesForUpdate, materials, tags, isTemporary } = this.state;
        let { newMaterials, newTags } = this.state;

        let updateForm = {
            newTitle: title.value,
            newAddress: address.value === '' ? undefined : address.value,
            newArtist: artist.value === '' ? undefined : artist.value,
            newDescription: description.value === '' ? undefined : description.value,
            newInscription: inscription.value === '' ? undefined : inscription.value,
            newLatitude: (latitude.value === '' && longitude.value === '') ? undefined : latitude.value,
            newLongitude: (latitude.value === '' && longitude.value === '') ? undefined : longitude.value,
            images: images,
            newIsTemporary: isTemporary.value,
            dateSelectValue: dateSelectValue,
            imagesForUpdate: imagesForUpdate
        };

        switch (dateSelectValue) {
            case 'year':
                updateForm.newYear = year.value === '' ? undefined : year.value;
                break;
            case 'month-year':
                updateForm.newYear = year.value === '' ? undefined : year.value;
                updateForm.newMonth = month.value;
                break;
            case 'exact-date':
                updateForm.newDate = datePickerCurrentDate;
                break;
            default:
                break;
        }

        let newlyAssociatedMaterialNames = materials.materialObjects.map(material => material.name);
        let createdMaterialNames = newMaterials.map(newMaterial => newMaterial.name);
        updateForm.newMaterials = newlyAssociatedMaterialNames.concat(createdMaterialNames);

        let newlyAssociatedTagNames = tags.map(tag => tag.name);
        let createdTagNames = newTags.map(newTag => newTag.name);
        updateForm.newTags = newlyAssociatedTagNames.concat(createdTagNames);

        updateForm.updatedReferenceUrlsById = {};
        updateForm.newReferenceUrls = [];
        updateForm.deletedReferenceIds = [];

        for (const reference of references) {
            if (reference.id) {
                if (reference.deleted === true) {
                    updateForm.deletedReferenceIds.push(reference.id);
                }
                else {
                    updateForm.updatedReferenceUrlsById[reference.id] = reference.value;
                }
            }
            else {
                updateForm.newReferenceUrls.push(reference.value);
            }
        }

        updateForm.deletedImageUrls = [];
        updateForm.deletedImageIds = [];

        for (const imageForUpdate of imagesForUpdate) {
            if (imageForUpdate.isPrimary) {
                updateForm.newPrimaryImageId = imageForUpdate.id;
            }

            if (imageForUpdate.hasBeenDeleted) {
                updateForm.deletedImageUrls.push(imageForUpdate.url);
                updateForm.deletedImageIds.push(imageForUpdate.id);
            }
        }

        // JSON fields
        updateForm.updatedReferenceUrlsByIdJson = JSON.stringify(updateForm.updatedReferenceUrlsById);
        updateForm.newReferenceUrlsJson = JSON.stringify(updateForm.newReferenceUrls);
        updateForm.deletedReferenceIdsJson = JSON.stringify(updateForm.deletedReferenceIds);
        updateForm.deletedImageIdsJson = JSON.stringify(updateForm.deletedImageIds);
        updateForm.deletedImageUrlsJson = JSON.stringify(updateForm.deletedImageUrls);
        updateForm.newMaterialsJson = JSON.stringify(updateForm.newMaterials);
        updateForm.newTagsJson = JSON.stringify(updateForm.newTags);

        return updateForm;
    }

    handleInputChange(event) {
        const currentState = this.state[event.target.name];
        currentState.value = event.target.value;

        this.setState({[event.target.name]: currentState});
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

    handleReferenceChange(event) {
        const currentReferences = this.state.references;
        const index = parseInt(event.target.name.split('-')[1]);

        currentReferences[index].value = event.target.value;

        this.setState({references: currentReferences});
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

    handleReferenceDeleteButtonClick(event, reference, index) {
        const { references } = this.state;

        if (reference.id) {
            const referenceFromState = references.filter(r => r.id === reference.id)[0];
            referenceFromState['deleted'] = true;
        }
        else {
            references.splice(index, 1);
        }

        this.setState({references});
    }

    handleReferenceUndoDeleteButtonClick(event, reference) {
        const { references } = this.state;

        const referenceFromState = references.filter(r => r.id === reference.id)[0];
        referenceFromState['deleted'] = false;

        this.setState({references});
    }

    async handleImageUploaderChange(files) {
        await this.setState({images: files});
    }

    handleImageIsPrimaryCheckboxClick(event, image) {
        const { images, imagesForUpdate } = this.state;

        if (image.isPrimary) {
            image.isPrimary = false;
        }
        else {
            image.isPrimary = true;

            for (const i of images) {
                if (i.url !== image.url) {
                    i.isPrimary = false;
                }
            }

            for (const i of imagesForUpdate) {
                if (i.url !== image.url) {
                    i.isPrimary = false;
                }
            }
        }

        this.setState({images, imagesForUpdate});
    }

    handleImageForUpdateDeleteButtonClick(event, image) {
        const { imagesForUpdate } = this.state;

        let imageForUpdateFromState;
        for (const imageForUpdate of imagesForUpdate) {
            if (imageForUpdate.id === image.id) {
                imageForUpdateFromState = imageForUpdate;
                break;
            }
        }

        if (imageForUpdateFromState) {
            imageForUpdateFromState.hasBeenDeleted = true;
        }

        this.setState({imagesForUpdate});
    }

    handleImageForUpdateUndoDeleteButtonClick(event, image) {
        const { imagesForUpdate } = this.state;

        let imageForUpdateFromState;
        for (const imageForUpdate of imagesForUpdate) {
            if (imageForUpdate.id === image.id) {
                imageForUpdateFromState = imageForUpdate;
                break;
            }
        }

        if (imageForUpdateFromState) {
            imageForUpdateFromState.hasBeenDeleted = false;
        }

        this.setState({imagesForUpdate});
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
        const { monument, onSubmit } = this.props;
        const { images } = this.state;

        event.preventDefault();

        this.clearForm(false);

        if (this.validateForm()) {
            if (!monument) {
                onSubmit(this.buildCreateForm());
            }
            else {
                onSubmit(monument, this.buildUpdateForm(), images);
            }
        }
    }

    handleCancelButtonClick() {
        const { onCancelButtonClick } = this.props;

        onCancelButtonClick();
    }

    renderReferenceDeleteButton(reference, index) {
        if (!reference.deleted) {
            return (
                <div
                    className="delete-button reference"
                    onClick={e => this.handleReferenceDeleteButtonClick(e, reference, index)}
                >
                    X
                </div>
            );
        }
        else {
            return (
                <i
                    className="material-icons delete-button undo reference"
                    onClick={e => this.handleReferenceUndoDeleteButtonClick(e, reference)}
                >
                    undo
                </i>
            );
        }
    }

    renderImageIsPrimaryCheckbox(image) {
        const { monument } = this.props;

        if (monument) {
            let isPrimaryIcon;

            if (image.isPrimary) {
                isPrimaryIcon = (
                    <i
                        className="material-icons image-is-primary-checkbox"
                        onClick={e => this.handleImageIsPrimaryCheckboxClick(e, image)}
                    >
                        check_box
                    </i>
                );
            }
            else {
                isPrimaryIcon = (
                    <i
                        className="material-icons image-is-primary-checkbox"
                        onClick={e => this.handleImageIsPrimaryCheckboxClick(e, image)}
                    >
                        check_box_outline_blank
                    </i>
                );
            }

            return (
                <div className="is-primary-container">
                    <div className="image-is-primary-message">
                        Is Primary Image:
                    </div>
                    {isPrimaryIcon}
                </div>
            );
        }
        else {
            return (
                <div/>
            );
        }
    }

    renderImageDeleteButton(image) {
        if (image.hasBeenDeleted) {
            return (
                <i
                    className="material-icons delete-button undo"
                    onClick={e => this.handleImageForUpdateUndoDeleteButtonClick(e, image)}
                >
                    undo
                </i>
            );
        }
        else {
            return (
                <div
                    className="delete-button"
                    onClick={e => this.handleImageForUpdateDeleteButtonClick(e, image)}
                >
                    X
                </div>
            );
        }
    }

    renderClearButton() {
        const { monument } = this.props;

        if (!monument) {
            return (
                <Button
                    type="button"
                    onClick={() => this.clearForm(true)}
                    className="reset-button mr-4 mt-1"
                >
                    Clear
                </Button>
            );
        }
        else {
            return (
                <div/>
            );
        }
    }

    renderResetButton() {
        const { monument } = this.props;

        if (monument) {
            return (
                <Button
                    type="button"
                    onClick={() => this.setFormFieldValuesForUpdate()}
                    className="reset-button mr-4 mt-1"
                >
                    Reset
                </Button>
            );
        }
        else {
            return (
                <div/>
            );
        }
    }

    render() {
        const { showingAdvancedInformation, dateSelectValue, datePickerCurrentDate, title, address, latitude,
            longitude, year, month, artist, description, inscription, references, imageUploaderKey, materials,
            imagesForUpdate, isTemporary, locationType } = this.state;
        const { monument, action } = this.props;

        const advancedInformationLink = (
            <div className="advanced-information-link more-link" onClick={() => this.handleAdvancedInformationClick()}>Want to tell us more?</div>
        );

        const hideAdvancedInformationLink = (
            <div className="advanced-information-link hide-link" onClick={() => this.handleAdvancedInformationClick()}>Hide More Information</div>
        );

        let dateInput;

        const dateYearInput = (
            <Form.Group controlId="create-form-date-year">
                <Form.Label>Year:</Form.Label>
                <Form.Control
                    type="number"
                    name="year"
                    placeholder="YYYY"
                    value={year.value}
                    onChange={(event) => this.handleInputChange(event)}
                    isInvalid={!year.isValid}
                    className="text-control-small"
                />
                <Form.Control.Feedback type="invalid">{year.message}</Form.Control.Feedback>
            </Form.Group>
        );

        switch (dateSelectValue) {
            case 'year':
                dateInput = dateYearInput;
                break;
            case 'month-year':
                dateInput = (
                    <Form.Row>
                        <Form.Group controlId="create-form-date-month">
                            <Form.Label>Month:</Form.Label>
                            <Form.Control
                                as="select"
                                name="month"
                                value={month.value}
                                onChange={(event) => this.handleInputChange(event)}
                                isInvalid={!month.isValid}
                                className="select-control mr-2"
                            >
                                <option value="0">January</option>
                                <option value="1">February</option>
                                <option value="2">March</option>
                                <option value="3">April</option>
                                <option value="4">May</option>
                                <option value="5">June</option>
                                <option value="6">July</option>
                                <option value="7">August</option>
                                <option value="8">September</option>
                                <option value="9">October</option>
                                <option value="10">November</option>
                                <option value="11">December</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{month.message}</Form.Control.Feedback>
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
                    <Form.Group controlId="create-form-datepicker">
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

        for (const [index, reference] of references.entries()) {
            referenceInputs.push(
                <div className="reference-container" key={index}>
                    <Form.Label>Reference:</Form.Label>
                    <Form.Control
                        type="text"
                        name={'reference-' + index}
                        placeholder="Reference URL"
                        value={reference.value}
                        onChange={(event) => this.handleReferenceChange(event)}
                        isInvalid={!reference.isValid}
                        className={reference.deleted ? 'text-control deleted-reference' : 'text-control'}
                    />
                    {monument ? this.renderReferenceDeleteButton(reference, index) : <div/>}
                    <Form.Control.Feedback type="invalid">{reference.message}</Form.Control.Feedback>
                </div>
            );
        }

        const invalidMaterials = (
            <div className="invalid-feedback materials">{materials.message}</div>
        );

        let imagesForUpdateDisplay;
        if (imagesForUpdate.length) {
            let imageDisplays = [];
            for (const image of imagesForUpdate) {
                imageDisplays.push(
                    <div
                        className={image.hasBeenDeleted ? 'image-for-update-container deleted' : 'image-for-update-container'}
                        key={image.id}
                    >
                        {this.renderImageDeleteButton(image)}
                        <div
                            className={image.hasBeenDeleted ? 'image-for-update deleted' : 'image-for-update'}
                            style={{backgroundImage: `url("${image.url}")`}}
                        />
                        {this.renderImageIsPrimaryCheckbox(image)}
                    </div>
                );
            }

            imagesForUpdateDisplay = (
                <div>
                    <Form.Label>Current Images:</Form.Label>
                    <div className="images-for-update-container">
                        {imageDisplays}
                    </div>
                </div>
            );
        }

        return (
            <div className="create-form-container">
                {monument
                    ? <div className="h4 update">{action} an existing Monument or Memorial</div>
                    : <div className="h4 create">{action} a new Monument or Memorial</div>}

                <Form onSubmit={(event) => this.handleSubmit(event)}>
                    {/* Title */}
                    <Form.Group controlId="create-form-title">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={title.value}
                            onChange={(event) => this.handleInputChange(event)}
                            isInvalid={!title.isValid}
                            className="text-control"
                        />
                        <Form.Control.Feedback type="invalid">{title.message}</Form.Control.Feedback>
                    </Form.Group>

                    {/* IsTemporary */}
                    <Form.Group controlId="create-form-is-temporary">
                        <Form.Label className="mr-2 is-temporary">
                            Is Temporary
                            <OverlayTrigger
                                placement="top"
                                overlay={props => (
                                    <Tooltip {...props} show={props.show ? 'show' : ''}>
                                        Temporary monuments or memorials are those that are not built from permanent materials
                                    </Tooltip>
                                )}>
                                <i className="material-icons">
                                    help
                                </i>
                            </OverlayTrigger>:
                        </Form.Label>
                        <ButtonGroup>
                            <Button variant={isTemporary.value ? 'primary' : 'outline-primary'} size="sm" active={isTemporary.value}
                                    onClick={() => this.setState({isTemporary: {...isTemporary, value: true}})}>
                                Yes
                            </Button>
                            <Button variant={!isTemporary.value ? 'primary' : 'outline-primary'} size="sm" active={!isTemporary.value}
                                    onClick={() => this.setState({isTemporary: {...isTemporary, value: false}})}>
                                No
                            </Button>
                        </ButtonGroup>
                    </Form.Group>

                    {/* Materials */}
                    <Form.Group controlId="create-form-materials">
                        <Form.Label>Materials:</Form.Label>
                        <TagsSearch
                            variant="materials"
                            onChange={(variant, selectedMaterials, createdMaterials) =>
                                this.handleMaterialSelect(variant, selectedMaterials, createdMaterials)}
                            allowTagCreation={true}
                            className={materials.isValid ? undefined : 'is-invalid'}
                            ref={this.materialsSelectRef}
                        />
                        {!materials.isValid && invalidMaterials}
                    </Form.Group>

                    <div className="address-coordinates-container">
                        <span className="font-weight-bold">Location Type:</span>
                        <Form.Group>
                            <Form.Control as="select"
                                          value={locationType.value}
                                          isInvalid={!locationType.isValid}
                                          onChange={event => this.setState({locationType: {isValid: true, message: '', value: event.target.value}})}>
                                <option value="">Select a Location Type</option>
                                <option value="address">Street Address</option>
                                <option value="coordinates">Geographic Coordinates</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{locationType.message}</Form.Control.Feedback>
                        </Form.Group>

                        {locationType.value === 'address' &&
                            <Form.Group controlId="create-form-address" className="mt-3">
                                <Form.Label>Address:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={address.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!address.isValid}
                                    className="text-control w-100"
                                />
                                <Form.Control.Feedback type="invalid">{address.message}</Form.Control.Feedback>
                            </Form.Group>
                        }

                        {locationType.value === 'coordinates' &&
                            <Form.Group controlId="create-form-coordinates" className="mt-3">
                                <Form.Label>Coordinates:</Form.Label>
                                <div className="coordinates-group">
                                    <div className="coordinate-field">
                                        <Form.Control
                                            type="text"
                                            name="latitude"
                                            placeholder="Latitude"
                                            value={latitude.value}
                                            onChange={(event) => this.handleInputChange(event)}
                                            isInvalid={!latitude.isValid}
                                            className="text-control-small"
                                        />
                                        <Form.Control.Feedback type="invalid">{latitude.message}</Form.Control.Feedback>
                                    </div>
                                    <div className="coordinate-field">
                                        <Form.Control
                                            type="text"
                                            name="longitude"
                                            placeholder="Longitude"
                                            value={longitude.value}
                                            onChange={(event) => this.handleInputChange(event)}
                                            isInvalid={!longitude.isValid}
                                            className="text-control-small"
                                        />
                                        <Form.Control.Feedback type="invalid">{longitude.message}</Form.Control.Feedback>
                                    </div>
                                </div>
                            </Form.Group>
                        }
                    </div>

                    {/* Images */}
                    <Form.Group controlId="create-form-image">
                        <Form.Label>{monument ? 'Add More Images:' : 'Images:'}</Form.Label>
                        <ImageUploader
                            withIcon={false}
                            imgExtension={['.jpg', '.png']}
                            maxFileSize={5000000}
                            label=""
                            fileSizeError="- File is too large. The maximum file size is 5MB"
                            fileTypeError="File type is not supported"
                            withPreview={true}
                            onChange={(files) => this.handleImageUploaderChange(files)}
                            key={imageUploaderKey}
                            errorClass="invalid-feedback"
                        />
                        {imagesForUpdateDisplay}
                    </Form.Group>

                    <Collapse in={showingAdvancedInformation}>
                        <div>
                            {/* Artist */}
                            <Form.Group controlId="create-form-artist">
                                <Form.Label>Artist:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="artist"
                                    placeholder="Artist"
                                    value={artist.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!artist.isValid}
                                    className="text-control"
                                />
                                <Form.Control.Feedback type="invalid">{artist.message}</Form.Control.Feedback>
                            </Form.Group>

                            <div className="date-container">
                                {/* Date */}
                                <Form.Group controlId="create-form-date-select">
                                    <Form.Label>Date:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="select-control"
                                        onChange={(event) => this.handleDateSelectChange(event)}
                                    >
                                        <option value="year">Year</option>
                                        <option value="month-year">Month/Year</option>
                                        <option value="exact-date">Exact Date</option>
                                    </Form.Control>
                                </Form.Group>

                                {/* Date: Input (Year, Year/Month, or Date Picker) */}
                                {dateInput}
                            </div>

                            {/* Description */}
                            <Form.Group controlId="create-form-description">
                                <Form.Label>Description:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows="3"
                                    name="description"
                                    placeholder="Description"
                                    value={description.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!description.isValid}
                                    className="multi-line-text-control"
                                />
                                <Form.Control.Feedback type="invalid">{description.message}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Inscription */}
                            <Form.Group controlId="create-form-inscription">
                                <Form.Label>Inscription:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows="3"
                                    name="inscription"
                                    placeholder="Inscription"
                                    value={inscription.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!inscription.isValid}
                                    className="multi-line-text-control"
                                />
                                <Form.Control.Feedback type="invalid">{inscription.message}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Tags */}
                            <Form.Group controlId="create-form-tags">
                                <Form.Label>Tags:</Form.Label>
                                <TagsSearch
                                    variant="tags"
                                    onChange={(variant, selectedTags, createdTags) =>
                                        this.handleTagSelect(variant, selectedTags, createdTags)}
                                    allowTagCreation={true}
                                    ref={this.tagsSelectRef}
                                />
                            </Form.Group>

                            <div className="references-container">
                                {/* References */}
                                <Form.Group controlId="create-form-references">
                                    {referenceInputs}
                                </Form.Group>

                                <div className="add-reference-link" onClick={() => this.handleAddAnotherReferenceLinkClick()}>+ Add Another Reference</div>
                            </div>
                        </div>
                    </Collapse>

                    {!showingAdvancedInformation && advancedInformationLink}
                    {showingAdvancedInformation && hideAdvancedInformationLink}

                    <ButtonToolbar className={monument ? 'btn-toolbar update' : null}>
                        <Button
                            variant="primary"
                            type="submit"
                            className="mr-4 mt-1"
                        >
                            Submit
                        </Button>

                        {this.renderClearButton()}
                        {this.renderResetButton()}

                        <Button
                            variant="danger"
                            type="button"
                            onClick={() => this.handleCancelButtonClick()}
                            className="mt-1"
                        >
                            Cancel
                        </Button>
                    </ButtonToolbar>
                </Form>
            </div>
        );
    }
}