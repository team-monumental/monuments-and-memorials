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
                        The Bulk Creation feature allows you to upload a Comma-Separated Values (CSV) file to create
                        many new Monument and Memorial records quickly.
                    </p>
                </Card.Body>
                <Card.Subtitle>
                    How do I use Bulk Creation?
                </Card.Subtitle>
                <Card.Body>
                    <p>
                        To use the Bulk Creation feature, simply upload a valid CSV file and we'll handle the rest!
                    </p>
                </Card.Body>
                <Card.Subtitle>
                    How do I format my CSV file?
                </Card.Subtitle>
                <Card.Body>
                    <div className='h7'>
                        Header Row
                    </div>
                    <p>
                        You do NOT need to have a header row in your CSV file. If you include one, an invalid record
                        will be created.
                    </p>
                    <div className='h7'>

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
                            The headers of the CSV file are out of order OR a column is missing. In this situation,
                            the CSV file will be rejected and no new Monuments/Memorials will be created.
                        </li>
                        <li>
                            Some of the rows of the CSV file have data in the wrong columns. In this situation,
                            the CSV file will NOT be rejected and the new Monuments/Memorials WILL be created.
                            Due to this, it is important that you are sure the CSV file you are providing is correct!
                        </li>
                    </ol>
                </Card.Body>
            </Card>
        );
    }
}