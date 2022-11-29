import React from 'react';
import './CreateOrUpdateForm.scss';
import { Form, Button, ButtonToolbar, Collapse, OverlayTrigger, Tooltip, ButtonGroup } from 'react-bootstrap';
import {
    latitudeDecRegex,
    longitudeDecRegex,
    latitudeDegRegex,
    longitudeDegRegex,
    latitudeLongDegRegex,
    longitudeLongDegRegex,
    validateUrl
} from '../../utils/regex-util';
import { DateFormat } from '../../utils/string-util';
import ImageUploader from 'react-images-upload';
import TagsSearch from '../Search/TagsSearch/TagsSearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import validator from 'validator';
import { isEmptyObject } from '../../utils/object-util';
import LocationSearch from '../Header/SearchBar/LocationSearch/LocationSearch';
import PhotoSphereImages from './PhotoSphereImages/PhotoSphereImages';

/* global google */

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
            dateSelectValue: {
                value: DateFormat.EXACT_DATE,
                isValid: true,
                message: ''
            },
            datePickerCurrentDate: null,
            deactivatedDateSelectValue: {
                value: DateFormat.EXACT_DATE,
                isValid: true,
                message: ''
            },
            deactivatedDatePickerCurrentDate: null,
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
            country: '',
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
            deactivatedYear: {
                value: '',
                isValid: true,
                message: ''
            },
            deactivatedMonth: {
                value: '0',
                isValid: true,
                message: ''
            },
            deactivatedComment: {
                value: '',
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
            imageReferenceUrls: [],
            imageCaptions: [],
            photoSphereImages: [],
            photoSphereImageReferenceUrls: [],
            photoSphereImageCaptions: [],
            imagesForUpdate:[],
            imageReferenceUrlsForUpdate: {},
            imageCaptionsForUpdate: {},
            photoSphereImagesForUpdate: [],
            photoSphereImageReferenceUrlsForUpdate: {},
            photoSphereImageCaptionsForUpdate: {},
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
        const { title, address, latitude, longitude, year, month, deactivatedYear, deactivatedMonth, deactivatedComment,
            artist, description, inscription, references, isTemporary } = this.state;
        let { datePickerCurrentDate, deactivatedDatePickerCurrentDate, images, imageCaptions, imageReferenceUrls,
            imageUploaderKey, materials, newMaterials, tags, newTags } = this.state;

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

        deactivatedYear.isValid = true;
        deactivatedYear.message = '';

        deactivatedMonth.isValid = true;
        deactivatedMonth.message = '';

        deactivatedComment.isValid = true;
        deactivatedComment.message = '';

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
            deactivatedYear.value = '';
            deactivatedMonth.value = '0';
            deactivatedComment.value = '';
            artist.value = '';
            description.value = '';
            inscription.value = '';
            datePickerCurrentDate = null;
            deactivatedDatePickerCurrentDate = null;
            images = [];
            imageReferenceUrls = [];
            imageCaptions = [];
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

        this.setState({title, address, latitude, longitude, year, month, deactivatedYear, deactivatedMonth,
            deactivatedComment, artist, description, inscription, datePickerCurrentDate,
            deactivatedDatePickerCurrentDate, references, images, imageReferenceUrls, imageCaptions, imageUploaderKey,
            materials, newMaterials, tags, newTags, isTemporary});
    }

    /**
     * Sets the values of Form fields to be the values of the Monument that is being updated
     */
    setFormFieldValuesForUpdate() {
        const { monument } = this.props;
        const { title, address, latitude, longitude, year, month, deactivatedYear, deactivatedMonth, deactivatedComment,
            artist, description, inscription, materials, locationType } = this.state;
        let { datePickerCurrentDate, deactivatedDatePickerCurrentDate, dateSelectValue, deactivatedDateSelectValue,
            references, tags, imagesForUpdate, imageReferenceUrlsForUpdate, imageCaptionsForUpdate,
            photoSphereImagesForUpdate, photoSphereImageReferenceUrlsForUpdate, photoSphereImageCaptionsForUpdate,
            images, imageReferenceUrls, imageCaptions, photoSphereImages, photoSphereImageReferenceUrls,
            photoSphereImageCaptions, imageUploaderKey, city, state, isTemporary } = this.state;

        let monumentYear, monumentMonth, monumentExactDate;

        if (monument.date) {
            const monumentDateArray = monument.date.split('-');

            monumentYear = monumentDateArray[0];

            let monumentMonthInt = parseInt(monumentDateArray[1]) - 1;
            monumentMonth = (monumentMonthInt).toString();

            monumentExactDate = new Date(parseInt(monumentYear), monumentMonthInt, monumentDateArray[2]);
        }

        let monumentDeactivatedYear, monumentDeactivatedMonth, monumentExactDeactivatedDate;

        if (monument.deactivatedDate) {
            const monumentDeactivatedDateArray = monument.deactivatedDate.split('-');

            monumentDeactivatedYear = monumentDeactivatedDateArray[0];

            let monumentDeactivatedMonthInt = parseInt(monumentDeactivatedDateArray[1]) - 1;
            monumentDeactivatedMonth = (monumentDeactivatedMonthInt).toString();

            monumentExactDeactivatedDate = new Date(parseInt(monumentDeactivatedYear), monumentDeactivatedMonthInt, monumentDeactivatedDateArray[2]);
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
        dateSelectValue.value = monument.dateFormat ? monument.dateFormat : DateFormat.EXACT_DATE;
        datePickerCurrentDate = monumentExactDate && dateSelectValue.value === DateFormat.EXACT_DATE ? monumentExactDate : null;
        deactivatedDateSelectValue.value = monument.deactivatedDateFormat ? monument.deactivatedDateFormat : DateFormat.EXACT_DATE;
        deactivatedYear.value = monumentDeactivatedYear ? monumentDeactivatedYear : '';
        deactivatedMonth.value = monumentDeactivatedMonth ? monumentDeactivatedMonth : '';
        deactivatedDatePickerCurrentDate = monumentExactDeactivatedDate && deactivatedDateSelectValue.value === DateFormat.EXACT_DATE ? monumentExactDeactivatedDate : null;
        deactivatedComment.value = monument.deactivatedComment ? monument.deactivatedComment : '';
        city = monument.city;
        state = monument.state;
        isTemporary.value = monument.isTemporary ? monument.isTemporary : false;

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
            imageReferenceUrlsForUpdate = {};
            imageCaptionsForUpdate = {};
            photoSphereImagesForUpdate = [];
            photoSphereImageReferenceUrlsForUpdate = {};
            photoSphereImageCaptionsForUpdate = {};
            for (const originalImage of monument.images) {
                const image = Object.create(originalImage);
                image.hasBeenDeleted = false;
                if (image.isPhotoSphere) {
                    photoSphereImagesForUpdate.push(image);
                    photoSphereImageReferenceUrlsForUpdate[image.id] = { value: image.referenceUrl, isValid: true };
                    photoSphereImageCaptionsForUpdate[image.id] = { value: image.caption, isValid: true };
                } else {
                    imagesForUpdate.push(image);
                    imageReferenceUrlsForUpdate[image.id] = { value: image.referenceUrl, isValid: true };
                    imageCaptionsForUpdate[image.id] = { value: image.caption, isValid: true };
                }
            }
        }

        images = [];
        imageReferenceUrls = [];
        imageCaptions = [];
        photoSphereImages = [];
        photoSphereImageReferenceUrls = [];
        photoSphereImageCaptions = [];
        imageUploaderKey++;

        this.setState({ title, address, latitude, longitude, artist, description, inscription, year, month,
            datePickerCurrentDate, dateSelectValue, deactivatedYear, deactivatedMonth, deactivatedDatePickerCurrentDate,
            deactivatedDateSelectValue, deactivatedComment, references, materials, tags, imagesForUpdate,
            imageReferenceUrlsForUpdate, imageCaptionsForUpdate, photoSphereImagesForUpdate,
            photoSphereImageReferenceUrlsForUpdate, photoSphereImageCaptionsForUpdate, images, imageReferenceUrls,
            imageCaptions, photoSphereImages, photoSphereImageReferenceUrls, photoSphereImageCaptions, imageUploaderKey,
            locationType, city, state, isTemporary });
    }

    convertCoordinate(coordinate){
        const values = coordinate.value.split(/[°'"]/g);
        let decimal = 0;
        let degree = 0;

        if(validator.matches(coordinate.value, latitudeDegRegex) || validator.matches(coordinate.value, longitudeDegRegex)){
            degree = parseFloat(values[0]);
            const min = parseFloat(values[1]);
            const sec = parseFloat(values[2]);

            /* decimal = degrees + (minutes/60) + (seconds/3600) */
            decimal = Math.abs(degree) + (min/60) + (sec/3600);
        }else if (validator.matches(coordinate.value, latitudeLongDegRegex) || validator.matches(coordinate.value, longitudeLongDegRegex)){
            const vals = values[0].split(/[NnEeSsWw]/g);
            degree = parseFloat(vals[1]);
            decimal = Math.abs(degree) + (parseFloat(values[1])/60);
        }
        if ((coordinate.value.includes('W'))||(coordinate.value.includes('w'))
            ||(coordinate.value.includes('S'))||(coordinate.value.includes('s'))
            ||(degree<0)) {
            decimal *= -1;
        }
        console.log(decimal);
        return decimal.toFixed(6);
    }

    validateReferenceUrl(referenceUrl) {
        if (referenceUrl.value && !validator.isEmpty(referenceUrl.value) && !validateUrl(referenceUrl.value)) {
            referenceUrl.isValid = false
            referenceUrl.message = 'Must be a URL'
            return false
        }
        referenceUrl.isValid = true
        referenceUrl.message = null
        return true
    }

    /**
     * Validates the Form
     * If any of the inputs are invalid, the entire Form is considered invalid
     * @returns {boolean} - True if the Form is valid, False otherwise
     */
    validateForm() {
        const { title, address, latitude, longitude, year, month, deactivatedYear, deactivatedMonth, deactivatedComment,
            references, materials, newMaterials, locationType, datePickerCurrentDate, deactivatedDatePickerCurrentDate,
            datePickerError, dateSelectValue, deactivatedDateSelectValue, imageReferenceUrls, imageReferenceUrlsForUpdate,
            photoSphereImageReferenceUrls, photoSphereImageReferenceUrlsForUpdate } = this.state;
        let { deactivatedDatePickerError } = this.state
        const currentDate = new Date();
        let formIsValid = true;

        imageReferenceUrls.forEach(referenceUrl => {
            if (!this.validateReferenceUrl(referenceUrl)) {
                formIsValid = false
            }
        })
        photoSphereImageReferenceUrls.forEach(referenceUrl => {
            if (!this.validateReferenceUrl(referenceUrl)) {
                formIsValid = false
            }
        })
        for(const prop in imageReferenceUrlsForUpdate) {
            if(imageReferenceUrlsForUpdate.hasOwnProperty(prop) && imageReferenceUrlsForUpdate[prop].value) {
                const referenceUrl = imageReferenceUrlsForUpdate[prop]
                if (!this.validateReferenceUrl(referenceUrl)) {
                    formIsValid = false
                }
            }
        }
        for(const prop in photoSphereImageReferenceUrlsForUpdate) {
            if(photoSphereImageReferenceUrlsForUpdate.hasOwnProperty(prop) && photoSphereImageReferenceUrlsForUpdate[prop].value) {
                const referenceUrl = photoSphereImageReferenceUrlsForUpdate[prop]
                if (!this.validateReferenceUrl(referenceUrl)) {
                    formIsValid = false
                }
            }
        }

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

        /* US and territories, '' if Google Maps goes down */
        const valid_countries = ['US', 'PR', 'VI', 'AS', 'GU', 'MP', '']

        /* Address or Coordinates Validation */
        /* An Address OR Coordinates must be specified */
        if (locationType.value === 'address') {
            if (validator.isEmpty(address.value)) {
                address.isValid = false;
                address.message = 'Address must be selected from the dropdown';
                formIsValid = false;
            } else if (!valid_countries.includes(this.state.country)) {
                address.isValid = false;
                address.message = 'Address is not in the United States';
                formIsValid = false;
            }
        } else if (locationType.value === 'coordinates') {
            if (latitude.value.includes('°')) {
                latitude.value = latitude.value.replaceAll(/\s/g, '');
                if (!validator.matches(latitude.value, latitudeDegRegex) && !validator.matches(latitude.value, latitudeLongDegRegex)) {
                    latitude.isValid = false;
                    latitude.message = 'Latitude must be valid';
                    formIsValid = false;
                } else {
                    latitude.value = this.convertCoordinate(latitude)
                }
            }
            if (validator.isEmpty(latitude.value)) {
                latitude.isValid = false;
                latitude.message = 'Latitude must not be blank';
                formIsValid = false;
            } else if (!validator.matches(latitude.value, latitudeDecRegex)) {
                latitude.isValid = false;
                latitude.message = 'Latitude must be valid';
                formIsValid = false;
            } else if (!valid_countries.includes(this.state.country)) {
                latitude.isValid = false;
                latitude.message = 'Latitude is not in the United States';
                formIsValid = false;
            }

            if (longitude.value.includes('°')) {
                longitude.value = longitude.value.replaceAll(/\s/g, '');
                if (!validator.matches(longitude.value, longitudeDegRegex) && !validator.matches(longitude.value, longitudeLongDegRegex)) {
                    longitude.isValid = false;
                    longitude.message = 'Longitude must be valid';
                    formIsValid = false;
                } else {
                    longitude.value = this.convertCoordinate(longitude)
                }
            }
            if (validator.isEmpty(longitude.value)) {
                longitude.isValid = false;
                longitude.message = 'Longitude must not be blank';
                formIsValid = false;
            } else if (!validator.matches(longitude.value, longitudeDecRegex)) {
                longitude.isValid = false;
                longitude.message = 'Longitude must be valid';
                formIsValid = false;
            } else if (!valid_countries.includes(this.state.country)) {
                longitude.isValid = false;
                longitude.message = 'Longitude is not in the United States';
                formIsValid = false;
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

            if ((yearInt <= 0) || (yearInt > currentDate.getFullYear())) {
                year.isValid = false;
                year.message = 'Year must be valid';
                formIsValid = false;
            } else {
                if (yearInt === currentDate.getFullYear()) {
                    if (monthInt > currentDate.getMonth()) {
                        month.isValid = false;
                        month.message = 'Month must be valid';
                        formIsValid = false;
                    }
                }
            }
        }

        /* Un-installed Date Validation */
        /* Check that the un-installed Year and Month specified are not in the future */
        if (!validator.isEmpty(deactivatedYear.value)) {
            const deactivatedYearInt = parseInt(deactivatedYear.value);
            const deactivatedMonthInt = parseInt(deactivatedMonth.value);

            if ((deactivatedYearInt <= 0) || (deactivatedYearInt > currentDate.getFullYear())) {
                deactivatedYear.isValid = false;
                deactivatedYear.message = 'Un-installed year must be valid';
                formIsValid = false;
            } else {
                if (deactivatedYearInt === currentDate.getFullYear()) {
                    if (deactivatedMonthInt > currentDate.getMonth()) {
                        deactivatedMonth.isValid = false;
                        deactivatedMonth.message = 'Un-installed month must be valid';
                        formIsValid = false;
                    }
                }
            }
        }

        /* Check that the un-installed date is after created date */
        if ((!validator.isEmpty(deactivatedYear.value) || (deactivatedDatePickerCurrentDate && deactivatedDateSelectValue.value === DateFormat.EXACT_DATE))
            && (!validator.isEmpty(year.value) || (datePickerCurrentDate && dateSelectValue.value === DateFormat.EXACT_DATE))) {
            const deactivatedYearInt = parseInt(deactivatedYear.value || (deactivatedDatePickerCurrentDate ? deactivatedDatePickerCurrentDate.getFullYear() : (new Date()).getFullYear().toString()));
            const deactivatedMonthInt = parseInt(deactivatedMonth.value > 0 ? deactivatedMonth.value : (deactivatedDatePickerCurrentDate ? deactivatedDatePickerCurrentDate.getMonth() : (new Date()).getMonth().toString()));
            const deactivatedDayInt = parseInt((deactivatedDatePickerCurrentDate ? deactivatedDatePickerCurrentDate.getDate() : (new Date()).getDate().toString()));
            const yearInt = parseInt(year.value || (datePickerCurrentDate ? datePickerCurrentDate.getFullYear() : '0'));
            const monthInt = parseInt(month.value > 0 ? month.value : (datePickerCurrentDate ? datePickerCurrentDate.getMonth() : '0'));
            const dayInt = parseInt((datePickerCurrentDate ? datePickerCurrentDate.getDate() : '0'));

            if (yearInt > deactivatedYearInt) {
                deactivatedYear.isValid = false;
                deactivatedYear.message = 'Un-installed date must be after created date';
                formIsValid = false;
            } else if (yearInt === deactivatedYearInt) {
                if (monthInt > deactivatedMonthInt) {
                    deactivatedMonth.isValid = false;
                    deactivatedMonth.message = 'Un-installed date must be after created date';
                    formIsValid = false;
                } else if (monthInt === deactivatedMonthInt) {
                    if (dayInt > deactivatedDayInt) {
                        formIsValid = false;
                        deactivatedDatePickerError = 'Un-installed date must be after created date';
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

        /*
        The following form validation is based off of a conversation with Dr. Decker where the following truth table was
        defined for various form states of known vs unknown dates:
        _______________________________________________________________________________
        DateOfCreation     |DateOfUninstall    |UninstallReasonGiven   |FormStateLegal?|
        ___________________|___________________|_______________________|_______________|
        Unknown            |Unknown            |NotGiven               |FALSE          |
        Unknown            |Unknown            |Given                  |FALSE          |
        Unknown            |Known/NotGiven     |NotGiven               |FALSE          |
        Unknown            |Known/NotGiven     |Given                  |TRUE           |
        Known/NotGiven     |Unknown            |NotGiven               |TRUE*          |    *Allow iff supporting references are provided
        Known/NotGiven     |Unknown            |Given                  |TRUE           |
        Known/NotGiven     |Known/NotGiven     |NotGiven               |TRUE           |
        Known/NotGiven     |Known/NotGiven     |Given                  |TRUE           |
         */
        if (dateSelectValue.value === DateFormat.UNKNOWN && deactivatedDateSelectValue.value === DateFormat.UNKNOWN){//covers rows 1 and 2
            dateSelectValue.isValid = false;
            dateSelectValue.message = 'Must provide either a date of creation or date of un-install (or leave them blank for another contributor to add)';
            deactivatedDateSelectValue.isValid = false;
            deactivatedDateSelectValue.message = 'Must provide either a date of creation or date of un-install (or leave them blank for another contributor to add)';
            formIsValid = false;
        } else if (dateSelectValue.value === DateFormat.UNKNOWN && validator.isEmpty(deactivatedComment.value)){//covers row 3
            deactivatedComment.isValid = false;
            deactivatedComment.message = 'Un-installed reason is required if date of removal is known';
            formIsValid = false;
        } else if (dateSelectValue.value !== DateFormat.UNKNOWN && deactivatedDateSelectValue.value === DateFormat.UNKNOWN && validator.isEmpty(deactivatedComment.value)) {//covers row 5
            deactivatedDateSelectValue.isValid = false;
            deactivatedDateSelectValue.message = 'Must provide date of un-install (or be left blank for another contributor to add) if deactivation reason is given without supporting references'
            deactivatedComment.isValid = false;
            deactivatedComment.message = 'Un-installed reason is required if date of removal is known';
            formIsValid = false;
        }

        if (!formIsValid) {
            this.setState({title, address, latitude, longitude, year, month, deactivatedYear, deactivatedMonth,
                references, datePickerError, deactivatedDatePickerError});
        }

        return formIsValid;
    }

    /**
     * Build the form object for creating a new CreateMonumentSuggestion
     */
    buildCreateForm() {
        const { title, address, latitude, longitude, dateSelectValue, deactivatedDateSelectValue, year, month,
            deactivatedYear, deactivatedMonth, artist, description, inscription, datePickerCurrentDate,
            deactivatedDatePickerCurrentDate, deactivatedComment, references, images, imageReferenceUrls, imageCaptions,
            photoSphereImages, photoSphereImageReferenceUrls, photoSphereImageCaptions, materials, newMaterials, tags,
            newTags, isTemporary, city, state } = this.state;

        let createForm = {
            title: title.value,
            address: address.value === '' ? null : address.value,
            latitude: (latitude.value === '' && longitude.value === '') ? null : latitude.value,
            longitude: (latitude.value === '' && longitude.value === '') ? null : longitude.value,
            artist: artist.value === '' ? null : artist.value,
            description: description.value === '' ? null : description.value,
            inscription: inscription.value === '' ? null : inscription.value,
            references: references.map(reference => reference.value),
            images,
            imageReferenceUrlsJson: JSON.stringify(imageReferenceUrls.map(referenceUrl => referenceUrl.value)),
            imageCaptionsJson: JSON.stringify(imageCaptions.map(caption => caption.value)),
            photoSphereImages,
            photoSphereImageReferenceUrlsJson: JSON.stringify(photoSphereImageReferenceUrls.map(referenceUrl => referenceUrl.value)),
            photoSphereImageCaptionsJson: JSON.stringify(photoSphereImageCaptions.map(caption => caption.value)),
            materials: materials.materialObjects.map(material => material.name),
            newMaterials: newMaterials.map(newMaterial => newMaterial.name),
            tags: tags.map(tag => tag.name),
            newTags: newTags.map(newTag => newTag.name),
            dateSelectValue: dateSelectValue,
            deactivatedDateSelectValue: deactivatedDateSelectValue,
            dateFormat: dateSelectValue.value,
            deactivatedDateFormat: deactivatedDateSelectValue.value,
            deactivatedComment: deactivatedComment.value === '' ? null : deactivatedComment.value,
            isTemporary: isTemporary.value,
            city,
            state
        };

        switch (dateSelectValue.value) {
            case DateFormat.YEAR:
                createForm.year = year.value === '' ? null : year.value;
                break;
            case DateFormat.MONTH_YEAR:
                createForm.year = year.value === '' ? null : year.value;
                createForm.month = month.value;
                break;
            case DateFormat.EXACT_DATE:
                createForm.date = datePickerCurrentDate;
                break;
            case DateFormat.UNKNOWN:
                createForm.date = null;
                break;
            default:
                break;
        }

        switch (deactivatedDateSelectValue.value) {
            case DateFormat.YEAR:
                createForm.deactivatedYear = deactivatedYear.value === '' ? null : deactivatedYear.value;
                break;
            case DateFormat.MONTH_YEAR:
                createForm.deactivatedYear = deactivatedYear.value === '' ? null : deactivatedYear.value;
                createForm.deactivatedMonth = deactivatedMonth.value;
                break;
            case DateFormat.EXACT_DATE:
                createForm.deactivatedDate = deactivatedDatePickerCurrentDate;
                break;
            case DateFormat.UNKNOWN:
                createForm.deactivatedDate = null;
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

    remapObjectToValuesOnly(object) {
        const finalObject = {}
        for(const prop in object) {
            if(object.hasOwnProperty(prop)) {
                if (object[prop].value) {
                    finalObject[prop] = object[prop].value;
                }
            }
        }
        return finalObject
    }

    /**
     * Build the form object for creating an UpdateMonumentSuggestion
     */
    buildUpdateForm() {
        const { title, address, artist, description, inscription, latitude, longitude, dateSelectValue,
            deactivatedDateSelectValue, year, month, deactivatedYear, deactivatedMonth, datePickerCurrentDate,
            deactivatedDatePickerCurrentDate, deactivatedComment, references, images, imageReferenceUrls, imageCaptions,
            imagesForUpdate, imageReferenceUrlsForUpdate, imageCaptionsForUpdate, photoSphereImages,
            photoSphereImageReferenceUrls, photoSphereImageCaptions, photoSphereImagesForUpdate,
            photoSphereImageReferenceUrlsForUpdate, photoSphereImageCaptionsForUpdate, materials, tags, isTemporary,
            city, state } = this.state;
        let { newMaterials, newTags } = this.state;

        let updateForm = {
            newTitle: title.value,
            newAddress: address.value === '' ? undefined : address.value,
            newArtist: artist.value === '' ? undefined : artist.value,
            newDescription: description.value === '' ? undefined : description.value,
            newInscription: inscription.value === '' ? undefined : inscription.value,
            newLatitude: (latitude.value === '' && longitude.value === '') ? undefined : latitude.value,
            newLongitude: (latitude.value === '' && longitude.value === '') ? undefined : longitude.value,
            images,
            newImageReferenceUrlsJson: JSON.stringify(imageReferenceUrls.map(referenceUrl => referenceUrl.value)),
            newImageCaptionsJson: JSON.stringify(imageCaptions.map(caption => caption.value)),
            photoSphereImages: photoSphereImages.map(photoSphereImage => photoSphereImage.url),
            newPhotoSphereImageReferenceUrlsJson: JSON.stringify(photoSphereImageReferenceUrls.map(referenceUrl => referenceUrl.value)),
            newPhotoSphereImageCaptionsJson: JSON.stringify(photoSphereImageCaptions.map(caption => caption.value)),
            newIsTemporary: isTemporary.value,
            dateSelectValue: dateSelectValue,
            deactivatedDateSelectValue: deactivatedDateSelectValue,
            newDateFormat: dateSelectValue,
            newDeactivatedDateFormat: deactivatedDateSelectValue.value,
            newDeactivatedComment: deactivatedComment.value === '' ? undefined : deactivatedComment.value,
            imagesForUpdate,
            updatedImageReferenceUrlsJson: JSON.stringify(this.remapObjectToValuesOnly(imageReferenceUrlsForUpdate)),
            updatedImageCaptionsJson: JSON.stringify(this.remapObjectToValuesOnly(imageCaptionsForUpdate)),
            updatedPhotoSphereImageReferenceUrlsJson: JSON.stringify(this.remapObjectToValuesOnly(photoSphereImageReferenceUrlsForUpdate)),
            updatedPhotoSphereImageCaptionsJson: JSON.stringify(this.remapObjectToValuesOnly(photoSphereImageCaptionsForUpdate)),
            newCity: city,
            newState: state
        };

        switch (dateSelectValue.value) {
            case DateFormat.YEAR:
                updateForm.newYear = year.value === '' ? undefined : year.value;
                break;
            case DateFormat.MONTH_YEAR:
                updateForm.newYear = year.value === '' ? undefined : year.value;
                updateForm.newMonth = month.value;
                break;
            case DateFormat.EXACT_DATE:
                updateForm.newDate = datePickerCurrentDate;
                break;
            case DateFormat.UNKNOWN:
                updateForm.newDate = null;
                break;
            default:
                break;
        }

        switch (deactivatedDateSelectValue.value) {
            case DateFormat.YEAR:
                updateForm.newDeactivatedYear = deactivatedYear.value === '' ? undefined : deactivatedYear.value;
                break;
            case DateFormat.MONTH_YEAR:
                updateForm.newDeactivatedYear = deactivatedYear.value === '' ? undefined : deactivatedYear.value;
                updateForm.newDeactivatedMonth = deactivatedMonth.value;
                break;
            case DateFormat.EXACT_DATE:
                updateForm.newDeactivatedDate = deactivatedDatePickerCurrentDate;
                break;
            case DateFormat.UNKNOWN:
                updateForm.newDeactivatedDate = null;
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
        updateForm.deletedPhotoSphereImageUrls = [];
        updateForm.deletedPhotoSphereImageIds = [];

        for (const imageForUpdate of imagesForUpdate) {
            if (imageForUpdate.isPrimary) {
                updateForm.newPrimaryImageId = imageForUpdate.id;
            }

            if (imageForUpdate.hasBeenDeleted) {
                updateForm.deletedImageUrls.push(imageForUpdate.url);
                updateForm.deletedImageIds.push(imageForUpdate.id);
            }
        }

        for (const photoSphereImage of photoSphereImagesForUpdate) {
            if (photoSphereImage.hasBeenDeleted) {
                updateForm.deletedPhotoSphereImageUrls.push(photoSphereImage.url);
                updateForm.deletedPhotoSphereImageIds.push(photoSphereImage.id);
            }
        }

        // JSON fields
        updateForm.updatedReferenceUrlsByIdJson = JSON.stringify(updateForm.updatedReferenceUrlsById);
        updateForm.newReferenceUrlsJson = JSON.stringify(updateForm.newReferenceUrls);
        updateForm.deletedReferenceIdsJson = JSON.stringify(updateForm.deletedReferenceIds);
        updateForm.deletedImageIdsJson = JSON.stringify(updateForm.deletedImageIds);
        updateForm.deletedImageUrlsJson = JSON.stringify(updateForm.deletedImageUrls);
        updateForm.deletedPhotoSphereImageIdsJson = JSON.stringify(updateForm.deletedPhotoSphereImageIds);
        updateForm.deletedPhotoSphereImageUrlsJson = JSON.stringify(updateForm.deletedPhotoSphereImageUrls);
        updateForm.newMaterialsJson = JSON.stringify(updateForm.newMaterials);
        updateForm.newTagsJson = JSON.stringify(updateForm.newTags);

        return updateForm;
    }

    async handleImageInfoChange(event) {
        const { target: { name } } = event;
        const splitName = name.split('-')
        const stateName = splitName[0]
        const id = splitName[1]
        let currentState = this.state[stateName];
        if (id) {
            if (!currentState) {
                currentState = {}
            }
            if (!currentState[id]) {
                currentState[id] = {}
            }
            currentState[id].value = event.target.value;
            currentState[id].isValid = true;
            await this.setState({ [stateName]: currentState })
        }
    }

    async handleArrayImageInfoChange(event) {
        const { target: { name } } = event;
        const splitName = name.split('-')
        const stateName = splitName[0]
        const id = splitName[1]
        let currentState = this.state[stateName];
        if (id) {
            if (!currentState) {
                currentState = []
            }
            let diff = id - currentState.length
            if (id > -1) {
                while (diff > -1) {
                    currentState.push(null)
                    diff--
                }
            }
            if (!currentState[id]) {
                currentState[id] = {}
            }
            currentState[id].value = event.target.value;
            currentState[id].isValid = true;
            await this.setState({ [stateName]: currentState })
        }
    }

    async handleInputChange(event) {
        const { target: { name } } = event;
        const currentState = this.state[name];
        currentState.value = event.target.value;

        await this.setState({[name]: currentState});

        if (name === 'latitude' || name === 'longitude') {
            const { latitude, longitude } = this.state;
            if (!validator.isEmpty(latitude.value) && !validator.isEmpty(longitude.value) &&
                (validator.matches(latitude.value, latitudeDecRegex)||validator.matches(latitude.value, latitudeDegRegex) || validator.matches(latitude.value, latitudeLongDegRegex)) &&
                (validator.matches(longitude.value, longitudeDecRegex)||validator.matches(longitude.value, longitudeDegRegex) || validator.matches(longitude.value, longitudeLongDegRegex))) {
                this.reverseGeocode();
            }
        }
    }

    async reverseGeocode() {
        const { latitude, longitude, previousCoordinates } = this.state;
        let coordinates = {};
        if (latitude.value.includes('°')) {
            coordinates.lat = parseFloat(this.convertCoordinate(latitude));
        } else {
            coordinates.lat = parseFloat(latitude.value);
        }
        if (longitude.value.includes('°')) {
            coordinates.lng = parseFloat(this.convertCoordinate(longitude));
        } else {
            coordinates.lng = parseFloat(longitude.value);
        }
        // Avoid doing duplicate requests
        if (previousCoordinates && coordinates.lat === previousCoordinates.lat && coordinates.lng === previousCoordinates.lng) {
            return;
        }
        const geocoder = new google.maps.Geocoder();
        const result = await new Promise(resolve => geocoder.geocode({location: coordinates}, (results, status) => resolve({results, status})));
        if (result.status !== 'OK' || !result.results || result.results.length === 0) {
            return;
        }
        this.getAddressCityStateFromGeocodingResult(result.results[0]);
        this.setState({previousCoordinates: coordinates});
    }

    handleLocationSearchSelect(lat, lon, address, result) {
        this.setState({
            address: {
                ...this.state.address,
                value: address
            },
            latitude: {
                ...this.state.latitude,
                value: lat
            },
            longitude: {
                ...this.state.longitude,
                value: lon
            }
        });
        this.getAddressCityStateFromGeocodingResult(result);
    }

    getAddressCityStateFromGeocodingResult(result) {
        let city, state, address, country;
        if (result) {
            for (let component of result.address_components) {
                if (component.types.includes('locality')) {
                    city = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                }
                if (component.types.includes('country')) {
                    country = component.short_name;
                }
            }
        }
        /* US Territories are usually listed as countries, with some strange edge cases, like
           San Juan, Puerto Rico where the administrative_area_level_1 is San Juan, not Puerto Rico.
           For Guam, there is no administrative_area_level_1, and Guam is the country
           This is kind of a catch all attempt to get a 2 letter state code
         */
        if ((!state || state.length !== 2) && country && country.length === 2) {
            state = country;
        }
        /* If there was no 2 letter state code, we could end up with something longer like San Juan, so fallback to
           leaving the field blank if it's not 2 letters long
         */
        if (state && state.length !== 2) {
            state = undefined;
        }
        address = result ? result.formatted_address : '';
        this.setState({city, state, address: {...this.state.address, value: address}, country: country});
    }

    handleAdvancedInformationClick() {
        const { showingAdvancedInformation } = this.state;

        this.setState({showingAdvancedInformation: !showingAdvancedInformation});
    }

    handleDateSelectChange(event) {
        this.setState({
            dateSelectValue: {
                ...this.state.dateSelectValue,
                value: event.target.value
            }});
    }

    handleDatePickerChange(date) {
        this.setState({datePickerCurrentDate: date, datePickerError: null});
    }

    handleDeactivatedDateSelectChange(event) {
        this.setState({
            deactivatedDateSelectValue: {
                ...this.state.deactivatedDateSelectValue,
                value: event.target.value
            }});
    }

    handleDeactivatedDatePickerChange(date) {
        this.setState({deactivatedDatePickerCurrentDate: date, deactivatedDatePickerError: null});
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

        this.setState({ references });
    }

    async handleImageUploaderChange(files) {
        const { images, imageReferenceUrls, imageCaptions } = this.state;

        const newImageReferenceUrls = imageReferenceUrls.slice()
        const newImageCaptions = imageCaptions.slice()

        // handle image deletion
        if (images.length > files.length) {
            let i = 0;
            images.forEach(image => {
                if (!files.includes(image)) {
                    newImageReferenceUrls.splice(i, 1);
                    newImageCaptions.splice(i, 1);
                }
                i++;
            })
        }

        while (newImageCaptions.length < files.length) {
            newImageCaptions.push({ value: null, isValid: true })
        }
        while (newImageReferenceUrls.length < files.length) {
            newImageReferenceUrls.push({ value: null, isValid: true })
        }

        await this.setState({ images: files, imageReferenceUrls: newImageReferenceUrls, imageCaptions: newImageCaptions });
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
        const { images, photoSphereImages } = this.state;

        event.preventDefault();

        this.clearForm(false);

        if (this.validateForm()) {
            if (!monument) {
                onSubmit(this.buildCreateForm());
            }
            else {
                onSubmit(monument, this.buildUpdateForm(), images, photoSphereImages);
            }
        }
    }

    handleCancelButtonClick() {
        const { onCancelButtonClick } = this.props;

        onCancelButtonClick();
    }

    handleAddPhotoSphereImage(image) {
        const { photoSphereImages, photoSphereImageReferenceUrls, photoSphereImageCaptions } = this.state;
        photoSphereImages.push(image);
        photoSphereImageReferenceUrls.push({ value: null, isValid: true })
        photoSphereImageCaptions.push({ value: null, isValid: true })
        this.setState({ photoSphereImages, photoSphereImageReferenceUrls, photoSphereImageCaptions });
    }

    handleDeletePhotoSphereImage({image, index}) {
        const { photoSphereImages, photoSphereImagesForUpdate, photoSphereImageReferenceUrls, photoSphereImageCaptions } = this.state;

        const newPhotoSphereImageReferenceUrls = photoSphereImageReferenceUrls.slice()
        const newPhotoSphereImageCaptions = photoSphereImageCaptions.slice()

        if (image) {
            photoSphereImagesForUpdate.find(i => {
                return i.id === image.id;
            }).hasBeenDeleted = true
        }
        else {
            photoSphereImages.splice(index, 1);
            newPhotoSphereImageReferenceUrls.splice(index, 1);
            newPhotoSphereImageCaptions.splice(index, 1);
        }

        this.setState({ photoSphereImagesForUpdate, photoSphereImages,
            photoSphereImageReferenceUrls: newPhotoSphereImageReferenceUrls, photoSphereImageCaptions: newPhotoSphereImageCaptions });
    }

    handleRestorePhotoSphereImage(image) {
        const { photoSphereImagesForUpdate } = this.state;

        photoSphereImagesForUpdate.find(i => {
            return i.id === image.id;
        }).hasBeenDeleted = false;

        this.setState({photoSphereImagesForUpdate});
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
                        Primary Image:
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
        const { showingAdvancedInformation, dateSelectValue, deactivatedDateSelectValue, datePickerCurrentDate,
            deactivatedDatePickerCurrentDate, title, address, latitude, longitude, year, deactivatedYear, month,
            deactivatedMonth, deactivatedComment, artist, description, inscription, references, imageUploaderKey,
            materials, imagesForUpdate, isTemporary, locationType, photoSphereImagesForUpdate, photoSphereImages,
            city, state, datePickerError, deactivatedDatePickerError, images, imageReferenceUrls, imageCaptions,
            photoSphereImageReferenceUrls, photoSphereImageCaptions, imageReferenceUrlsForUpdate, imageCaptionsForUpdate,
            photoSphereImageReferenceUrlsForUpdate, photoSphereImageCaptionsForUpdate } = this.state;
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

        switch (dateSelectValue.value) {
            case DateFormat.YEAR:
                dateInput = dateYearInput;
                break;
            case DateFormat.MONTH_YEAR:
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
            case DateFormat.EXACT_DATE:
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
                            defaultValue={null}
                        />
                        <div style={{color: "red"}}>{datePickerError}</div>
                    </Form.Group>
                );
                break;
            case DateFormat.UNKNOWN:
                dateInput = (
                    <Form.Group controlId="create-form-UnknownDate">
                        <Form.Label>Creation Date:</Form.Label>
                        <Form.Control
                            type="string"
                            value="Unknown"
                            isInvalid={!dateSelectValue.isValid}
                            className="text-control-small"
                        />
                        <Form.Control.Feedback type="invalid">{dateSelectValue.message}</Form.Control.Feedback>
                    </Form.Group>
                );
                break;
            default:
                dateInput = <div/>;
        }

        let deactivatedDateInput;

        const deactivatedDateYearInput = (
            <Form.Group controlId="create-form-deactivated-date-year">
                <Form.Label>Un-installed Year:</Form.Label>
                <Form.Control
                    type="number"
                    name="deactivatedYear"
                    placeholder="YYYY"
                    value={deactivatedYear.value}
                    onChange={(event) => this.handleInputChange(event)}
                    isInvalid={!deactivatedYear.isValid}
                    className="text-control-small"
                />
                <Form.Control.Feedback type="invalid">{deactivatedYear.message}</Form.Control.Feedback>
            </Form.Group>
        );

        switch (deactivatedDateSelectValue.value) {
            case DateFormat.YEAR:
                deactivatedDateInput = deactivatedDateYearInput;
                break;
            case DateFormat.MONTH_YEAR:
                deactivatedDateInput = (
                    <Form.Row>
                        <Form.Group controlId="create-form-deactivated-date-month">
                            <Form.Label>Un-installed Month:</Form.Label>
                            <Form.Control
                                as="select"
                                name="deactivatedMonth"
                                value={deactivatedMonth.value}
                                onChange={(event) => this.handleInputChange(event)}
                                isInvalid={!deactivatedMonth.isValid}
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
                            <Form.Control.Feedback type="invalid">{deactivatedMonth.message}</Form.Control.Feedback>
                        </Form.Group>

                        {deactivatedDateYearInput}
                    </Form.Row>
                );
                break;
            case DateFormat.EXACT_DATE:
                const minimumDate = new Date(1, 0);
                minimumDate.setFullYear(1);
                const currentDate = new Date();
                deactivatedDateInput = (
                    <Form.Group controlId="create-form-deactivated-datepicker">
                        <Form.Label>Choose a Un-installed Date:</Form.Label>
                        <DatePicker
                            selected={deactivatedDatePickerCurrentDate}
                            onChange={(date) => this.handleDeactivatedDatePickerChange(date)}
                            minDate={minimumDate}
                            maxDate={currentDate}
                        />
                        <div style={{color: "red"}}>{deactivatedDatePickerError}</div>
                    </Form.Group>
                );
                break;
            case DateFormat.UNKNOWN:
                deactivatedDateInput = (
                    <Form.Group controlId="create-form-deactivated-UnknownDate">
                        <Form.Label>Un-installed Date:</Form.Label>
                        <Form.Control
                            type="string"
                            value="Unknown"
                            isInvalid={!deactivatedDateSelectValue.isValid}
                            className="text-control-small"
                        />
                        <Form.Control.Feedback type="invalid">{deactivatedDateSelectValue.message}</Form.Control.Feedback>
                    </Form.Group>
                );
                break;
            default:
                deactivatedDateInput = <div/>;
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
                    <div style={{width: '100%'}} key={image.id}>
                        <div
                            className={image.hasBeenDeleted ? 'image-for-update-container deleted' : 'image-for-update-container'}
                            key={image.id}
                        >
                            {this.renderImageDeleteButton(image)}
                            <div
                                className={image.hasBeenDeleted ? 'image-for-update deleted' : 'image-for-update'}
                                style={{backgroundImage: `url("${image.url}")`}}
                            />
                            <div className="image-fields-container">
                                <Form.Label className="image-field-label">Reference URL:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={`imageReferenceUrlsForUpdate-${image.id}`}
                                    placeholder=""
                                    value={imageReferenceUrlsForUpdate[image.id].value}
                                    onChange={(event) => this.handleImageInfoChange(event)}
                                    isInvalid={!imageReferenceUrlsForUpdate[image.id].isValid}
                                    className="text-control-medium"
                                    maxLength="2048"
                                />
                                <Form.Control.Feedback type="invalid">{imageReferenceUrlsForUpdate[image.id]?.message}</Form.Control.Feedback>
                                <Form.Label className="image-field-label">Caption:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={`imageCaptionsForUpdate-${image.id}`}
                                    placeholder=""
                                    value={imageCaptionsForUpdate[image.id].value}
                                    onChange={(event) => this.handleImageInfoChange(event)}
                                    isInvalid={!imageCaptionsForUpdate[image.id].isValid}
                                    className="text-control-medium"
                                    maxLength="2048"
                                />
                                <Form.Control.Feedback type="invalid">{imageCaptionsForUpdate[image.id]?.message}</Form.Control.Feedback>
                            </div>
                            {this.renderImageIsPrimaryCheckbox(image)}
                        </div>
                    </div>
                );

            }

            imagesForUpdateDisplay = (
                <div style={{marginBottom: '32px'}}>
                    <Form.Label>Current Images:</Form.Label>
                    <div className="images-for-update-container">
                        {imageDisplays}
                    </div>
                </div>
            );
        }

        let imageFields = [];
        if (images.length) {
            images.forEach((image, i) => {
                imageFields.push(
                    <div className="image-fields-container-spaced" key={i}>
                        <Form.Label className="image-field-label">Image {i + 1} Reference URL:</Form.Label>
                        <Form.Control
                            type="text"
                            name={`imageReferenceUrls-${i}`}
                            placeholder=""
                            value={imageReferenceUrls[i]?.value}
                            onChange={(event) => this.handleArrayImageInfoChange(event)}
                            isInvalid={imageReferenceUrls[i]?.value && !imageReferenceUrls[i]?.isValid}
                            className="text-control-medium"
                            maxLength="2048"
                        />
                        <Form.Control.Feedback type="invalid">{imageReferenceUrls[i]?.message}</Form.Control.Feedback>
                        <Form.Label className="image-field-label">Image {i + 1} Caption:</Form.Label>
                        <Form.Control
                            type="text"
                            name={`imageCaptions-${i}`}
                            placeholder=""
                            value={imageCaptions[i]?.value}
                            onChange={(event) => this.handleArrayImageInfoChange(event)}
                            isInvalid={imageCaptions[i]?.value && !imageCaptions[i]?.isValid}
                            className="text-control-medium"
                            maxLength="2048"
                        />
                        <Form.Control.Feedback type="invalid">{imageCaptions[i]?.message}</Form.Control.Feedback>
                    </div>
                )
            })
        }
        const imageFieldsDisplay = <div style={{marginBottom: '16px'}}>{imageFields}</div>

        let photoSphereImageFields = [];
        if (photoSphereImagesForUpdate.length) {
            photoSphereImagesForUpdate.forEach((image, i) => {
                photoSphereImageFields.push(
                    <div className="image-fields-container-spaced" key={i}>
                        <Form.Label className="image-field-label">360° Image {i + 1} Reference URL:</Form.Label>
                        <Form.Control
                            type="text"
                            name={`photoSphereImageReferenceUrlsForUpdate-${image.id}`}
                            placeholder=""
                            value={photoSphereImageReferenceUrlsForUpdate[image.id]?.value}
                            onChange={(event) => this.handleImageInfoChange(event)}
                            isInvalid={photoSphereImageReferenceUrlsForUpdate[image.id]?.value && !photoSphereImageReferenceUrlsForUpdate[image.id]?.isValid}
                            className="text-control-medium"
                            maxLength="2048"
                        />
                        <Form.Control.Feedback type="invalid">{photoSphereImageReferenceUrlsForUpdate[image.id]?.message}</Form.Control.Feedback>
                        <Form.Label className="image-field-label">360° Image {i + 1} Caption:</Form.Label>
                        <Form.Control
                            type="text"
                            name={`photoSphereImageCaptionsForUpdate-${image.id}`}
                            placeholder=""
                            value={photoSphereImageCaptionsForUpdate[image.id]?.value}
                            onChange={(event) => this.handleImageInfoChange(event)}
                            isInvalid={photoSphereImageCaptionsForUpdate[image.id]?.value && !photoSphereImageCaptionsForUpdate[image.id]?.isValid}
                            className="text-control-medium"
                            maxLength="2048"
                        />
                        <Form.Control.Feedback type="invalid">{photoSphereImageCaptionsForUpdate[image.id]?.message}</Form.Control.Feedback>
                    </div>
                )
            })
        }
        if (photoSphereImages.length) {
            photoSphereImages.forEach((image, i) => {
                photoSphereImageFields.push(
                    <div className="image-fields-container-spaced" key={i}>
                        <Form.Label className="image-field-label">360° Image {i + photoSphereImagesForUpdate.length + 1} Reference URL:</Form.Label>
                        <Form.Control
                            type="text"
                            name={`photoSphereImageReferenceUrls-${i}`}
                            placeholder=""
                            value={photoSphereImageReferenceUrls[i]?.value}
                            onChange={(event) => this.handleArrayImageInfoChange(event)}
                            isInvalid={photoSphereImageReferenceUrls[i]?.value && !photoSphereImageReferenceUrls[i]?.isValid}
                            className="text-control-medium"
                            maxLength="2048"
                        />
                        <Form.Control.Feedback type="invalid">{photoSphereImageReferenceUrls[i]?.message}</Form.Control.Feedback>
                        <Form.Label className="image-field-label">360° Image {i + 1} Caption:</Form.Label>
                        <Form.Control
                            type="text"
                            name={`photoSphereImageCaptions-${i}`}
                            placeholder=""
                            value={photoSphereImageCaptions[i]?.value}
                            onChange={(event) => this.handleArrayImageInfoChange(event)}
                            isInvalid={photoSphereImageCaptions[i]?.value && !photoSphereImageCaptions[i]?.isValid}
                            className="text-control-medium"
                            maxLength="2048"
                        />
                        <Form.Control.Feedback type="invalid">{photoSphereImageCaptions[i]?.message}</Form.Control.Feedback>
                    </div>
                )
            })
        }
        const photoSphereImageFieldsDisplay = <div style={{marginBottom: '16px'}}>{photoSphereImageFields}</div>

        return (
            <div className="create-form">
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

                        {locationType.value === 'address' && <>
                            <Form.Group controlId="create-form-address" className="mt-3">
                                <Form.Label>Address:</Form.Label>
                                <LocationSearch value={address.value}
                                                placeholder="Address"
                                                isInvalid={!address.isValid}
                                                className="form-control text-control w-100"
                                                onSuggestionSelect={this.handleLocationSearchSelect.bind(this)}/>
                                {!address.isValid && <div className="invalid-feedback d-inline-block">{address.message}</div>}
                            </Form.Group>
                            {latitude.value && longitude.value && <div className="coordinates-geocode-group">
                                <div className="coordinates-geocode-row">
                                    <span className="coordinates-geocode-row-label">Coordinates:</span> {latitude.value}, {longitude.value}
                                </div>
                                <div className="coordinates-geocode-row">
                                    <span className="coordinates-geocode-row-label">City:</span> {city}
                                </div>
                                <div className="coordinates-geocode-row">
                                    <span className="coordinates-geocode-row-label">State:</span> {state}
                                </div>
                            </div>}
                        </>}

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
                                <Form.Label>{`Valid Formats:\n43.084670,   -77.674357\n43°05'04.8",  -77°40'27.7"\n43°05'04.8"N, 77°40'27.7"W \nN47°37.298,  W122°20.916`}</Form.Label>
                                {address.value && <div className="coordinates-geocode-group">
                                    <div className="coordinates-geocode-row">
                                        <span className="coordinates-geocode-row-label">Address:</span> {address.value}
                                    </div>
                                    <div className="coordinates-geocode-row">
                                        <span className="coordinates-geocode-row-label">City:</span> {city}
                                    </div>
                                    <div className="coordinates-geocode-row">
                                        <span className="coordinates-geocode-row-label">State:</span> {state}
                                    </div>
                                </div>}
                            </Form.Group>
                        }
                    </div>

                    {/* Images */}
                    <Form.Group controlId="create-form-image">
                        <Form.Label>{monument ? 'Add More Images:' : 'Images:'}</Form.Label>
                        <ImageUploader
                            withIcon={false}
                            imgExtension={['.jpg', '.png', 'JPG', 'PNG', 'jpeg', 'JPEG']}
                            maxFileSize={5000000}
                            label=""
                            fileSizeError="- File is too large. The maximum file size is 5MB"
                            fileTypeError="File type is not supported"
                            withPreview={true}
                            onChange={(files) => this.handleImageUploaderChange(files)}
                            key={imageUploaderKey}
                            errorClass="invalid-feedback"
                        />
                        {imageFieldsDisplay}
                        {imagesForUpdateDisplay}
                    </Form.Group>

                    <Collapse in={showingAdvancedInformation}>
                        <div>
                            {/* PhotoSphere Images */}
                            <PhotoSphereImages images={photoSphereImagesForUpdate.concat(photoSphereImages)}
                                               onAddImage={this.handleAddPhotoSphereImage.bind(this)}
                                               onDeleteImage={this.handleDeletePhotoSphereImage.bind(this)}
                                               onRestoreImage={this.handleRestorePhotoSphereImage.bind(this)}/>
                            {photoSphereImageFieldsDisplay}
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
                                        value={dateSelectValue.value}
                                    >
                                        <option value={DateFormat.YEAR}>Year</option>
                                        <option value={DateFormat.MONTH_YEAR}>Month/Year</option>
                                        <option value={DateFormat.EXACT_DATE}>Exact Date</option>
                                        <option value={DateFormat.UNKNOWN}>Unknown</option>
                                    </Form.Control>
                                </Form.Group>

                                {/* Date: Input (Year, Year/Month, or Date Picker) */}
                                {dateInput}
                            </div>

                            <div className="date-container">
                                {/* Un-installed Date */}
                                <Form.Group controlId="create-form-deactivated-date-select">
                                    <Form.Label>Un-installed Date:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="select-control"
                                        onChange={(event) => this.handleDeactivatedDateSelectChange(event)}
                                        value={deactivatedDateSelectValue.value}
                                    >
                                        <option value={DateFormat.YEAR}>Year</option>
                                        <option value={DateFormat.MONTH_YEAR}>Month/Year</option>
                                        <option value={DateFormat.EXACT_DATE}>Exact Date</option>
                                        <option value={DateFormat.UNKNOWN}>Unknown</option>
                                    </Form.Control>
                                </Form.Group>

                                {/* Un-installed Date: Input (Year, Year/Month, or Date Picker) */}
                                {deactivatedDateInput}
                            </div>

                            {/* Un-installed Comment */}
                            <Form.Group controlId="create-form-deactivated-comment">
                                <Form.Label>Un-installed Reason:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows="3"
                                    name="deactivatedComment"
                                    placeholder="Un-installed Reason"
                                    value={deactivatedComment.value}
                                    onChange={(event) => this.handleInputChange(event)}
                                    isInvalid={!deactivatedComment.isValid}
                                    className="multi-line-text-control"
                                />
                                <Form.Control.Feedback type="invalid">{deactivatedComment.message}</Form.Control.Feedback>
                            </Form.Group>

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

                    <div className="d-flex flex-column justify-content-center">
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
                    </div>
                </Form>
            </div>
        );
    }
}