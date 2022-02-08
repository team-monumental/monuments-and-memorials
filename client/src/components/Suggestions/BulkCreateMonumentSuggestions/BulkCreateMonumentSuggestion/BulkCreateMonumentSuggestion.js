import * as React from 'react';
import './BulkCreateMonumentSuggestion.scss';
import {connect} from 'react-redux';
import {Card} from 'react-bootstrap';
import CreateMonumentSuggestions from '../../CreateMonumentSuggestions/CreateMonumentSuggestions';
import {Link} from 'react-router-dom';
import {getUserFullName} from '../../../../utils/string-util';
import {Role} from '../../../../utils/authentication-util';

/**
 * Presentational component for displaying a BulkCreateMonumentSuggestion
 */
class BulkCreateMonumentSuggestion extends React.Component {

    static mapStateToProps(state) {
        return {
            session: state.session
        };
    }

    render() {
        const {
            suggestion, index, showTitleAsLink, showIndex = true, displayCreateMonumentStatuses,
            showCreateTitlesAsLinks, showCreatedBy, session
        } = this.props;

        const titleText = showIndex ?
            `${index}. ${suggestion.fileName}` :
            `Create many new records from: ${suggestion.fileName}`;

        const manageUserLink = (
            session.user.role === Role.ADMIN && suggestion.createdBy ?
                <Link to={`/panel/manage/users/user/${suggestion.createdBy.id}`} key={suggestion.createdBy.id}>
                    {getUserFullName(suggestion.createdBy)}
                </Link> :
                <span>
                    {getUserFullName(suggestion.createdBy)}
                </span>
        );

        return (
            <Card className="bulk-create-suggestion">
                <Card.Header className="bulk-create-suggestion-header pt-0">
                    <Card.Title>
                        <span className="pr-3">
                            {
                                showTitleAsLink ?
                                    <Link
                                        to={`/panel/manage/suggestions/suggestion/${suggestion.id}?type=bulk`}>{titleText}</Link> :
                                    titleText
                            }
                        </span>
                        {showCreatedBy &&
                            <div className="created-by-container">
                                Created By:&nbsp;
                                {manageUserLink} ({suggestion.createdBy &&
                                <a href={`mailto:${suggestion.createdBy.email}`}>{suggestion.createdBy.email}</a>})
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

export default connect(BulkCreateMonumentSuggestion.mapStateToProps)(BulkCreateMonumentSuggestion);