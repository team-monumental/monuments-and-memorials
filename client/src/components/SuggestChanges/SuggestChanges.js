import React from 'react';
import { Button, Card } from 'react-bootstrap';

/**
 * Prompts users to suggest changes to a Monument on its record page
 */
export default class SuggestChanges extends React.Component {

    handleButtonClick() {
        const { onButtonClick } = this.props;
        if (onButtonClick) {
            onButtonClick();
        }
    }

    render() {
        const { mode = 'update' } = this.props;
        const isUpdate = mode === 'update';
        return (
            <Card>
                <Card.Header>
                    <Card.Title>
                        Suggest a {isUpdate ? 'Change' : 'New Monument or Memorial'}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {isUpdate && <>
                        <p>We pride ourselves on keeping up to date and accurate information.</p>
                        <p>If you think something on this page is incorrect or outdated, please suggest a change. If your change is approved we'll send you an email to let you know, and you will be listed as a contributor on this page!</p>
                        <Button variant="primary" onClick={() => this.handleButtonClick()}>SUGGEST A CHANGE</Button>
                    </>}
                    {!isUpdate && <>
                        <p>Contributions help us to expand our database of Monuments and Memorials.</p>
                        <p>Your suggestion will be reviewed by our team and then published for the public to see. Your contribution will be credited on the monument or memorial's page.</p>
                        <Button variant="primary" onClick={() => this.handleButtonClick()}>SUGGEST NEW</Button>
                    </>}
                </Card.Body>
            </Card>
        );
    }
}