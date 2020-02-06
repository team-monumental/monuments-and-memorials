import React from 'react';
import './MoreInformation.scss';
import { Card } from 'react-bootstrap';

/**
 * Presentational component for displaying more information to the user on the Bulk Create form
 */
export default class MoreInformation extends React.Component {

    render() {
        return (
            <Card>
                <Card.Title>
                    Bulk Creation of Monuments and Memorials
                </Card.Title>
                <Card.Subtitle>
                    What is Bulk Creation?
                </Card.Subtitle>
                <Card.Body>
                    <p>
                        The Bulk Creation feature allows you to upload a Comma-Separated Values (CSV) file or a .zip file
                        to create many new Monument and Memorial records quickly.
                    </p>
                </Card.Body>
                <Card.Subtitle>
                    How do I use Bulk Creation?
                </Card.Subtitle>
                <Card.Body>
                    <p>
                        To use the Bulk Creation feature, simply upload a valid CSV file or .zip file and we'll
                        handle the rest!
                    </p>
                </Card.Body>
                <Card.Subtitle>
                    How do I format my CSV file?
                </Card.Subtitle>
                <Card.Body>
                    <div className="h7">
                        Header Row
                    </div>
                    <div className="subsection-information">
                        <p>
                            You do NOT need to have a header row in your CSV file. If you include one, an invalid record
                            will be created.
                        </p>
                    </div>
                    <div className="h7">
                        Columns
                    </div>
                    <div className="subsection-information">
                        The order of the columns in your CSV file should be:
                        <ol>
                            <li>
                                <div className="column-name">
                                    Submitted By:
                                </div>
                                <div className="column-explanation">
                                    The name of the contributor who gathered the data for this Monument or Memorial
                                    record.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Artist:
                                </div>
                                <div className="column-explanation">
                                    The name of the artist who created the Monument or Memorial.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Title:
                                </div>
                                <div className="column-explanation">
                                    The title of the Monument or Memorial.
                                </div>
                                <div className="column-explanation-notice">
                                    THIS IS A REQUIRED FIELD.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Date:
                                </div>
                                <div className="column-explanation">
                                    The date that the Monument or Memorial was created. The format of the date must be:
                                    "dd-MM-yyyy". For example: "24-08-1999" would be August 24th, 1999. If the day and
                                    month are unknown, simply use the format: "yyyy".
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Materials:
                                </div>
                                <div className="column-explanation">
                                    The material that the Monument or Memorial is made out of. To include more than one
                                    Material, simply separate them with a comma.
                                </div>
                                <div className="column-explanation-notice">
                                    THIS IS A REQUIRED FIELD.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Inscription:
                                </div>
                                <div className="column-explanation">
                                    Any text inscriptions that are written on the Monument or Memorial.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Latitude:
                                </div>
                                <div className="column-explanation">
                                    The latitude of the Monument or Memorial.
                                </div>
                                <div className="column-explanation-notice">
                                    SPECIFYING THIS FIELD AND "Longitude" OR SPECIFYING "Address" IS REQUIRED.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Longitude:
                                </div>
                                <div className="column-explanation">
                                    The longitude of the Monument or Memorial.
                                </div>
                                <div className="column-explanation-notice">
                                    SPECIFYING THIS FIELD AND "Latitude" OR SPECIFYING "Address" IS REQUIRED.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    City:
                                </div>
                                <div className="column-explanation">
                                    The city the Monument or Memorial is located in.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    State:
                                </div>
                                <div className="column-explanation">
                                    The state the Monument or Memorial is located in.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Address:
                                </div>
                                <div className="column-explanation">
                                    The address of the Monument or Memorial.
                                </div>
                                <div className="column-explanation-notice">
                                    SPECIFYING THIS FIELD OR SPECIFYING "Latitude" AND "Longitude" IS REQUIRED.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Tags:
                                </div>
                                <div className="column-explanation">
                                    Any words or phrases that categorize or describe the Monument or Memorial. To
                                    include more than one Tag, simply separate them with a comma.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Reference:
                                </div>
                                <div className="column-explanation">
                                    Any URL or link where more information can be found about the Monument or Memorial.
                                </div>
                            </li>
                            <li>
                                <div className="column-name">
                                    Image Filename:
                                </div>
                                <div className="column-explanation">
                                    The name of the image file that is associated with the Monument or Memorial.
                                </div>
                                <div className="column-explanation-notice">
                                    This column will only be used when a .zip file is uploaded!
                                </div>
                            </li>
                        </ol>
                    </div>
                </Card.Body>
                <Card.Subtitle>
                    What happens if my CSV file is not in the correct format?
                </Card.Subtitle>
                <Card.Body>
                    <p>
                        There are 2 ways that an uploaded CSV file can be incorrect:
                    </p>
                    <ol>
                        <li>
                            A column is missing from the CSV file. In this situation, the CSV file will be rejected and
                            no new Monuments/Memorials will be created.
                        </li>
                        <li>
                            Some of the rows of the CSV file have data in the wrong columns. In this situation,
                            the CSV file will NOT be rejected and the new Monuments/Memorials WILL be created.
                            Due to this, it is important that you are sure the CSV file you are providing is correct!
                        </li>
                    </ol>
                </Card.Body>
                <Card.Subtitle>
                    How do I format my .zip file?
                </Card.Subtitle>
                <Card.Body>
                    <p>
                        When a .zip file is uploaded, we expect a single CSV file to be present inside the .zip file. If
                        there is not exactly one CSV file, an error will occur.
                    </p>
                    <p>
                        The rest of the contents of the .zip file should be image files in .jpg or .png format. Any other
                        file formats will be ignored.
                    </p>
                </Card.Body>
                <Card.Subtitle>
                    What happens if my .zip file is not in the correct format?
                </Card.Subtitle>
                <Card.Body>
                    <p>
                        There are a few ways that an uploaded .zip file can be incorrect:
                    </p>
                    <ol>
                        <li>
                            As mentioned before, if there is not exactly one CSV file within the .zip file, an error
                            will occur.
                        </li>
                        <li>
                            Some of the rows of the CSV file have image filenames that do not correspond to any of the
                            image files in the .zip file. In this situation, the Monument or Memorial record will still
                            be created, but will not be associated with an image.
                        </li>
                        <li>
                            Some of the image files in the .zip file are not in the correct format. In this situation,
                            these image files will be ignored.
                        </li>
                        <li>
                            There are other files within the .zip file besides a CSV file and image files. In this
                            situation, these other files will be ignored.
                        </li>
                        <li>
                            The .zip file is too large. The largest .zip file upload size we support is 300MB. If your
                            file is larger than this, please split it up into multiple .zip files and perform multiple
                            Bulk Create operations.
                        </li>
                    </ol>
                </Card.Body>
            </Card>
        );
    }
}