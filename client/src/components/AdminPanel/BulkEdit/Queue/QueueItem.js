import React, {useState} from 'react'
import {Card, Form, ListGroup} from "react-bootstrap";
import DatePicker from "react-datepicker";

import './QueuePanel.scss'
import "react-datepicker/dist/react-datepicker.css";

const QueueItem = ({title, artist, city, address, coordinates, contributions, references, createdDate}) => {
    const [startDate, setStartDate] = useState(new Date())

    return (
        <Card className="queue-item">
            {/* TODO: Implement multiple images (carousel?) */}
            <Card.Img alt="placeholder img"/>
            <Card.Body>
                <Form>
                    {/* Title */}
                    <Form.Group>
                        <Form.Label>Placeholder</Form.Label>
                        <Form.Control type="text" placeholder="placeholder text"/>
                    </Form.Group>

                    {/* Artist */}
                    <Form.Group>
                        <Form.Label>Placeholder</Form.Label>
                        <Form.Control type="text" placeholder="placeholder text"/>
                    </Form.Group>

                    {/* Created Date */}
                    {/* TODO: Handle date formats */}
                    <Form.Group>
                        <Form.Label>Placeholder</Form.Label>
                        <br/>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/>
                    </Form.Group>

                    {/* City */}
                    <Form.Group>
                        <Form.Label>Placeholder</Form.Label>
                        <Form.Control type="text" placeholder="placeholder text"/>
                    </Form.Group>

                    {/* State */}
                    {/* TODO: Convert to select */}
                    <Form.Group>
                        <Form.Label>Placeholder</Form.Label>
                        <Form.Control type="text" placeholder="placeholder text"/>
                    </Form.Group>

                    {/* Address */}
                    <Form.Group>
                        <Form.Label>Placeholder</Form.Label>
                        <Form.Control type="text" placeholder="placeholder text"/>
                    </Form.Group>

                    {/* Coordinates */}
                    <Form.Group>
                        <Form.Label>Placeholder</Form.Label>
                        <Form.Control type="text" placeholder="placeholder text"/>
                    </Form.Group>

                    {/* Contributors */}
                    <Form.Group>
                        <Form.Label>Placeholder</Form.Label>
                        <Form.Control type="text" placeholder="placeholder text"/>
                    </Form.Group>

                    {/* References */}
                    <Form.Group>
                        <Form.Label>Placeholder</Form.Label>
                        <Form.Control type="text" placeholder="placeholder text"/>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default QueueItem
