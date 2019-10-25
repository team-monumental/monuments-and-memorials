import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default class SuggestChanges extends React.Component {

    render() {
        return (
            <Card>
                <Card.Title>
                    Suggest a Change
                </Card.Title>
                <Card.Body>
                    <p>We pride ourselves on keeping up to date and accurate information.</p>
                    <p>If you think something on this page is incorrect or outdated, please suggest a change. If your change is approved we'll send you an email to let you know, and you will be listed as a contributor on this page!</p>
                    <Button variant="primary">SUGGEST A CHANGE</Button>
                </Card.Body>
            </Card>
        );
    }
}