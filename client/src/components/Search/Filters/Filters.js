import * as React from 'react';
import './Filters.scss';
import { Form } from 'react-bootstrap';

export default class Filters extends React.Component {

    render() {
        return (
            <div className="filters">
                <Form.Control as="select" style={{width: 'min-content'}} className="py-1 px-2" defaultValue="25">
                    <option value="10">Within 10 miles</option>
                    <option value="15">Within 15 miles</option>
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                    <option value="100">Within 100 miles</option>
                </Form.Control>
            </div>
        );
    }
}