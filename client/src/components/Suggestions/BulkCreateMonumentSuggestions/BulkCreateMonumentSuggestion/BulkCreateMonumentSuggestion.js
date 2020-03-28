import * as React from 'react';
import './BulkCreateMonumentSuggestion.scss';
import { Card } from 'react-bootstrap';
import CreateMonumentSuggestions from '../../CreateMonumentSuggestions/CreateMonumentSuggestions';

/**
 * Presentational component for displaying a BulkCreateMonumentSuggestion
 */
export default class BulkCreateMonumentSuggestion extends React.Component {

    render() {
        const { suggestion, index } = this.props;

        return (
            <Card className="bulk-create-suggestion">
                <Card.Header className="bulk-create-suggestion-header pt-0">
                    <Card.Title>{`${index}. ${suggestion.fileName}`}</Card.Title>
                </Card.Header>
                <Card.Body className="pt-1 pb-1">
                    {suggestion && suggestion.createSuggestions && <>
                        <CreateMonumentSuggestions suggestions={suggestion.createSuggestions} hideMoreThan={2}/>
                    </>}
                </Card.Body>
            </Card>
        );
    }
}