import * as React from 'react';
import './BulkCreateMonumentSuggestion.scss';
import { Card } from 'react-bootstrap';
import CreateMonumentSuggestions from '../../CreateMonumentSuggestions/CreateMonumentSuggestions';
import { Link } from 'react-router-dom';

/**
 * Presentational component for displaying a BulkCreateMonumentSuggestion
 */
export default class BulkCreateMonumentSuggestion extends React.Component {

    render() {
        const { suggestion, index, showTitleAsLink, showIndex=true, displayCreateMonumentStatuses,
            showCreateTitlesAsLinks } = this.props;

        const titleText = showIndex ?
            `${index}. ${suggestion.fileName}` :
            `Create many new records from: ${suggestion.fileName}`;

        return (
            <Card className="bulk-create-suggestion">
                <Card.Header className="bulk-create-suggestion-header pt-0">
                    <Card.Title>
                        {
                            showTitleAsLink ?
                                <Link to={`/panel/manage/suggestions/suggestion/${suggestion.id}?type=bulk`}>{titleText}</Link> :
                                titleText
                        }
                    </Card.Title>
                </Card.Header>
                <Card.Body className="pt-1 pb-1">
                    {suggestion && suggestion.createSuggestions && <>
                        <CreateMonumentSuggestions suggestions={suggestion.createSuggestions} hideMoreThan={2}
                                                   expandedByDefault={true} showCollapseLinks={false}
                                                   displayStatuses={displayCreateMonumentStatuses} areFromBulk={true}
                                                   showTitlesAsLinks={showCreateTitlesAsLinks}/>
                    </>}
                </Card.Body>
            </Card>
        );
    }
}