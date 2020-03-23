import * as React from 'react';
import { Card } from 'react-bootstrap';

export default class UpdateMonumentSuggestion extends React.Component {

    render() {
        const { suggestion, index } = this.props;

        return (
            <Card className="update-suggestion">
                <Card.Header>

                </Card.Header>
            </Card>
        );
    }
}