import React from 'react';
import './CreateForm.scss';
import { Form, Button, ButtonToolbar, Collapse } from 'react-bootstrap';
import ImageUploader from 'react-images-upload';
import { Formik } from 'formik';
import * as yup from 'yup';
import TagsSearch from '../Search/TagsSearch/TagsSearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Presentational component for the Form for creating a new Monument
 */
export default class CreateForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingAdvancedInformation: false,
            dateSelectValue: 'year',
            datePickerCurrentDate: new Date(),
            numberOfReferences: 1
        };

        //this.materialsSearch = React.createRef();
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
        console.log(date);
        this.setState({datePickerCurrentDate: date});
    }

    handleSubmit(values) {
        console.log(values);
    }

    render() {
        const { showingAdvancedInformation } = this.state;

        const advancedInformationLink = (
            <div className='advanced-information-link' onClick={() => this.handleShowAdvancedInformationClick()}>Show Advanced Information</div>
        );

        const hideAdvancedInformationLink = (
            <div className='advanced-information-link' onClick={() => this.handleHideAdvancedInformationClick()}>Hide Advanced Information</div>
        );

        const addressOrCoordinatesRequiredTestOptions = {
            name: 'addressOrCoordinatesRequired',
            message: 'Address OR Coordinates are required',
            test: function(item) {
                return (this.parent.address || (this.parent.latitude && this.parent.longitude));
            }
        };

        const dateYearTestOptions = {
            name: 'dateYearValidTest',
            message: 'Year must be valid',
            test: function(item) {
                const currentYear = new Date().getFullYear();

                return (
                    this.parent.dateYear > 0 && this.parent.dateYear <= currentYear
                );
            }
        };

        /*const materialsTestOptions = {
            name: 'atLeastOneMaterialTest',
            message: 'At least one Material is required',
            test: function(item) {
                const currentMaterialsSearch = this.materialsSearch.current;
                console.log(currentMaterialsSearch.selectedTags);

                return (
                    currentMaterialsSearch.selectedTags && currentMaterialsSearch.selectedTags.size
                );
            }
        };*/

        // Taken from https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
        const latitudeRegex = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;

        // Taken from: https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
        const longitudeRegex = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;

        const createSchema = yup.object({
            title: yup.string().required('Title is required'),
            materials: yup.array()
                .of(yup.string())
                .required(),
            address: yup.string()
                .test(addressOrCoordinatesRequiredTestOptions),
            latitude: yup.string()
                .matches(
                    latitudeRegex,
                    'Latitude must be valid'
                )
                .test(addressOrCoordinatesRequiredTestOptions),
            longitude: yup.string()
                .matches(
                    longitudeRegex,
                    'Longitude must be valid'
                )
                .test(addressOrCoordinatesRequiredTestOptions),
            artist: yup.string(),
            dateYear: yup.string()
                .test(dateYearTestOptions),
            dateMonth: yup.string(),
            description: yup.string(),
            inscription: yup.string(),
            references: yup.array()
                .of(yup.string().url('Reference must be a valid URL'))
        });

        const initialValues = {
            title: '',
            materials: '',
            address: '',
            latitude: '',
            longitude: '',
            artist: '',
            dateYear: '',
            dateMonth: '1',
            description: '',
            inscription: '',
            references: []
        };

        return (
            <div className='create-form-container'>
                <div className='h5'>
                    Create a new Monument or Memorial
                </div>

                <Formik
                    validationSchema={createSchema}
                    onSubmit={(values) => this.handleSubmit(values)}
                    initialValues={initialValues}>
                    {({
                          handleSubmit,
                          handleChange,
                          values,
                          touched,
                          errors,
                          resetForm
                    }) => {
                        const { dateSelectValue, datePickerCurrentDate, references } = this.state;
                        let dateInput;

                        const dateYearInput = (
                            <Form.Group>
                                <Form.Label>Year:</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='dateYear'
                                    value={values.dateYear}
                                    placeholder='YYYY'
                                    className='text-control-small'
                                    isInvalid={touched.dateYear && errors.dateYear}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type='invalid'>{errors.dateYear}</Form.Control.Feedback>
                            </Form.Group>
                        );

                        switch(dateSelectValue) {
                            case 'year':
                                dateInput = dateYearInput;
                                break;
                            case 'month-year':
                                dateInput = (
                                    <Form.Row>
                                        <Form.Group>
                                            <Form.Label>Month:</Form.Label>
                                            <Form.Control
                                                as='select'
                                                name='dateMonth'
                                                value={values.dateMonth}
                                                className='select-control mr-2'
                                                onChange={handleChange}
                                            >
                                                <option value='1'>January</option>
                                                <option value='2'>February</option>
                                                <option value='3'>March</option>
                                                <option value='4'>April</option>
                                                <option value='5'>May</option>
                                                <option value='6'>June</option>
                                                <option value='7'>July</option>
                                                <option value='8'>August</option>
                                                <option value='9'>September</option>
                                                <option value='10'>October</option>
                                                <option value='11'>November</option>
                                                <option value='12'>December</option>
                                            </Form.Control>
                                        </Form.Group>

                                        {dateYearInput}
                                    </Form.Row>
                                );
                                break;
                            case 'exact-date':
                                dateInput = (
                                    <Form.Group>
                                        <Form.Label>Choose a Date:</Form.Label>
                                        <DatePicker
                                            selected={datePickerCurrentDate}
                                            onChange={(date) => this.handleDatePickerChange(date)}
                                        />
                                    </Form.Group>
                                );
                                break;
                        }

                        return (
                            <Form noValidate onSubmit={handleSubmit}>
                                {/* Title */}
                                <Form.Group controlId='create-form-title'>
                                    <Form.Label>Title:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='title'
                                        value={values.title}
                                        placeholder='Title'
                                        className='text-control'
                                        isInvalid={touched.title && errors.title}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback type='invalid'>{errors.title}</Form.Control.Feedback>
                                </Form.Group>

                                {/* Materials */}
                                <Form.Group controlId='create-form-materials'>
                                    <Form.Label>Materials:</Form.Label>
                                    <TagsSearch
                                        variant='materials'
                                        searchAfterTagSelect={false}
                                    />
                                    <Form.Control.Feedback type='invalid'>{errors.materials}</Form.Control.Feedback>
                                </Form.Group>

                                <div className='address-coordinates-container'>
                                    <span className='font-weight-bold'>Please specify one of the following:</span>

                                    {/* Address */}
                                    <Form.Group controlId='create-form-address'>
                                        <Form.Label>Address:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            name='address'
                                            value={values.address}
                                            placeholder='Address'
                                            className='text-control'
                                            isInvalid={touched.address && errors.address}
                                            onChange={handleChange}
                                        />
                                        <Form.Control.Feedback type='invalid'>{errors.address}</Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Coordinates */}
                                    <Form.Group controlId='create-form-coordinates'>
                                        <Form.Label>Coordinates:</Form.Label>
                                        <Form.Row>
                                            <Form.Control
                                                type='text'
                                                name='latitude'
                                                value={values.latitude}
                                                placeholder='Latitude'
                                                className='text-control-small mr-2'
                                                isInvalid={touched.latitude && errors.latitude}
                                                onChange={handleChange}
                                            />
                                            <Form.Control.Feedback type='invalid'>{errors.latitude}</Form.Control.Feedback>
                                            <Form.Control
                                                type='text'
                                                name='longitude'
                                                value={values.longitude}
                                                placeholder='Longitude'
                                                className='text-control-small'
                                                isInvalid={touched.longitude && errors.longitude}
                                                onChange={handleChange}
                                            />
                                            <Form.Control.Feedback type='invalid'>{errors.longitude}</Form.Control.Feedback>
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
                                                name='artist'
                                                value={values.artist}
                                                placeholder='Artist'
                                                className='text-control'
                                                isInvalid={touched.artist && errors.artist}
                                                onChange={handleChange}
                                            />
                                            <Form.Control.Feedback type='invalid'>{errors.artist}</Form.Control.Feedback>
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
                                                value={values.description}
                                                placeholder='Description'
                                                className='multi-line-text-control'
                                                isInvalid={touched.description && errors.description}
                                                onChange={handleChange}
                                            />
                                            <Form.Control.Feedback type='invalid'>{errors.description}</Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Inscription */}
                                        <Form.Group controlId='create-form-inscription'>
                                            <Form.Label>Inscription:</Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                rows='3'
                                                name='inscription'
                                                value={values.inscription}
                                                placeholder='Inscription'
                                                className='multi-line-text-control'
                                                isInvalid={touched.inscription && errors.inscription}
                                                onChange={handleChange}
                                            />
                                            <Form.Control.Feedback type='invalid'>{errors.inscription}</Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Tags */}
                                        <Form.Group controlId='create-form-tags'>
                                            <Form.Label>Tags:</Form.Label>
                                            <TagsSearch variant='tags' searchAfterTagSelect={false}/>
                                        </Form.Group>

                                        {/* References */}
                                        {
                                            references.map((value, index) => {
                                                return (
                                                    <Form.Group controlId={'create-form-references-' + index}>
                                                        <Form.Label>Reference:</Form.Label>
                                                        <Form.Control
                                                            type='url'
                                                            name='references'
                                                            value={values.references}
                                                            placeholder='Reference URL'
                                                            className='text-control'
                                                            isInvalid={touched.references && errors.references}
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Control.Feedback type='invalid'>{errors.references}</Form.Control.Feedback>
                                                    </Form.Group>
                                                );
                                            })
                                        }
                                    </div>
                                </Collapse>

                                {!showingAdvancedInformation && advancedInformationLink}
                                {showingAdvancedInformation && hideAdvancedInformationLink}

                                <ButtonToolbar>
                                    <Button variant='primary' type='submit' className='mr-4 mt-1'>
                                        Submit
                                    </Button>

                                    <Button
                                        variant='secondary'
                                        type='button'
                                        className='mr-4 mt-1'
                                        onClick={() => resetForm(initialValues)}
                                    >
                                        Clear
                                    </Button>

                                    <Button variant='danger' type='button' className='mt-1'>
                                        Cancel
                                    </Button>
                                </ButtonToolbar>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        );
    }
}