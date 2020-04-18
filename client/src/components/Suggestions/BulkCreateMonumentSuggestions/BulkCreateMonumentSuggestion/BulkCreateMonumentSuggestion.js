import * as React from 'react';
import './BulkCreateMonumentSuggestion.scss';
import { Card } from 'react-bootstrap';
import CreateMonumentSuggestions from '../../CreateMonumentSuggestions/CreateMonumentSuggestions';
import { Link, NavLink } from 'react-router-dom';
import { getUserFullName } from '../../../../utils/string-util';

/**
 * Presentational component for displaying a BulkCreateMonumentSuggestion
 */
export default class BulkCreateMonumentSuggestion extends React.Component {

    render() {
        const { suggestion, index, showTitleAsLink, showIndex=true, displayCreateMonumentStatuses,
            showCreateTitlesAsLinks, showCreatedBy } = this.props;

        const titleText = showIndex ?
            `${index}. ${suggestion.fileName}` :
            `Create many new records from: ${suggestion.fileName}`;

        const manageUserLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace(`/panel/manage/users/user/${suggestion.createdBy.id}`);
            }} to={`/panel/manage/users/user/${suggestion.createdBy.id}`} key={suggestion.createdBy.id}>{getUserFullName(suggestion.createdBy)}</NavLink>
        );

        return (
            <Card className="bulk-create-suggestion">
                <Card.Header className="bulk-create-suggestion-header pt-0">
                    <Card.Title>
                        {
                            showTitleAsLink ?
                                <Link to={`/panel/manage/suggestions/suggestion/${suggestion.id}?type=bulk`}>{titleText}</Link> :
                                titleText
                        }
                        {showCreatedBy &&
                            <div className="created-by-container">
                                Created By:&nbsp;
                                {manageUserLink} (<a href={`mailto:${suggestion.createdBy.email}`}>{suggestion.createdBy.email}</a>)
                            </div>
                        }
                    </Card.Title>
                </Card.Header>
                <Card.Body className="pt-1 pb-1">
                    {suggestion && suggestion.createSuggestions && <>
                        <CreateMonumentSuggestions suggestions={suggestion.createSuggestions} hideMoreThan={2}
                                                   expandedByDefault={true} showCollapseLinks={false}
                                                   displayStatuses={displayCreateMonumentStatuses} areFromBulk={true}
                                                   showTitlesAsLinks={showCreateTitlesAsLinks}
                                                   showCreatedBys={showCreatedBy}/>
                    </>}
                </Card.Body>
            </Card>
        );
    }
}