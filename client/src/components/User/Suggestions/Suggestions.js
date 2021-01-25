import * as React from 'react';
import './Suggestions.scss';
import Spinner from '../../Spinner/Spinner';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Role } from '../../../utils/authentication-util';
import CreateMonumentSuggestions from '../../Suggestions/CreateMonumentSuggestions/CreateMonumentSuggestions';
import UpdateMonumentSuggestions from '../../Suggestions/UpdateMonumentSuggestions/UpdateMonumentSuggestions';
import BulkCreateMonumentSuggestions from '../../Suggestions/BulkCreateMonumentSuggestions/BulkCreateMonumentSuggestions';

/**
 * Presentational component for displaying a list of Suggestions on the User page
 */
export default class Suggestions extends React.Component {

    filterPendingSuggestions() {
        const { suggestions } = this.props;
        const pendingSuggestions = {};

        if (suggestions && suggestions.createSuggestions) {
            pendingSuggestions['create'] = suggestions.createSuggestions.filter(suggestion => !suggestion.isApproved && !suggestion.isRejected);
        }

        if (suggestions && suggestions.updateSuggestions) {
            pendingSuggestions['update'] = suggestions.updateSuggestions.filter(suggestion => !suggestion.isApproved && !suggestion.isRejected);
        }

        if (suggestions && suggestions.bulkCreateSuggestions) {
            pendingSuggestions['bulk'] = suggestions.bulkCreateSuggestions.filter(suggestion => !suggestion.isApproved && !suggestion.isRejected);
        }

        return pendingSuggestions;
    }

    filterApprovedSuggestions() {
        const { suggestions } = this.props;
        const approvedSuggestions = {};

        if (suggestions && suggestions.createSuggestions) {
            approvedSuggestions['create'] = suggestions.createSuggestions.filter(suggestion => suggestion.isApproved);
        }

        if (suggestions && suggestions.updateSuggestions) {
            approvedSuggestions['update'] = suggestions.updateSuggestions.filter(suggestion => suggestion.isApproved);
        }

        if (suggestions && suggestions.bulkCreateSuggestions) {
            approvedSuggestions['bulk'] = suggestions.bulkCreateSuggestions.filter(suggestion => suggestion.isApproved);
        }

        return approvedSuggestions;
    }

    filterRejectedSuggestions() {
        const { suggestions } = this.props;
        const rejectedSuggestions = {};

        if (suggestions && suggestions.createSuggestions) {
            rejectedSuggestions['create'] = suggestions.createSuggestions.filter(suggestion => suggestion.isRejected);
        }

        if (suggestions && suggestions.updateSuggestions) {
            rejectedSuggestions['update'] = suggestions.updateSuggestions.filter(suggestion => suggestion.isRejected);
        }

        if (suggestions && suggestions.bulkCreateSuggestions) {
            rejectedSuggestions['bulk'] = suggestions.bulkCreateSuggestions.filter(suggestion => suggestion.isRejected);
        }

        return rejectedSuggestions;
    }

    renderSuggestions(suggestions, type, researcherOrAbove) {
        const { role, error } = this.props;
        const createText = researcherOrAbove ? 'create' : 'suggest'
        const updateText = researcherOrAbove ? 'make' : 'suggest'

        const createPageLink = (
            <Link to="/create" key="create">clicking here</Link>
        );

        const bulkCreatePageLink = (
            <Link to="/panel/bulk" key="bulk">clicking here</Link>
        );

        return (<>
            <h6>New Monument or Memorial Suggestions</h6>
            {(!suggestions.create || suggestions.create.length === 0) && !error && <>
                You don't have any {type} new monument or memorial suggestions yet. You can {createText} a new monument or
                memorial by {createPageLink}.
            </>}
            {suggestions.create && suggestions.create.length > 0 && <>
                <CreateMonumentSuggestions suggestions={suggestions.create}/>
            </>}
            <h6 className="mt-4">Update Monument or Memorial Suggestions</h6>
            {(!suggestions.update || suggestions.update.length === 0) && !error && <>
                You don't have any {type} update monument or memorial suggestions yet. You can {updateText} an update to an
                existing monument or memorial by clicking
                the "<span className="font-weight-bold">{updateText.toUpperCase()} A CHANGE</span>" button while viewing the
                monument or memorial page you want to update.
            </>}
            {suggestions.update && suggestions.update.length > 0 && <>
                <UpdateMonumentSuggestions suggestions={suggestions.update}/>
            </>}
            {role.toUpperCase() === Role.PARTNER && <>
                <h6 className="mt-4">Bulk New Monument or Memorial Suggestions</h6>
                {(!suggestions.bulk || suggestions.bulk.length === 0) && !error && <>
                    You don't have any {type} bulk new monument or memorial suggestions yet. You can {createText} bulk
                    new monuments or memorials by {bulkCreatePageLink}.
                </>}
                {suggestions.bulk && suggestions.bulk.length > 0 && <>
                    <BulkCreateMonumentSuggestions suggestions={suggestions.bulk}/>
                </>}
            </>}
            {error && <>
                Oops! Something went wrong while getting your {type} suggestions.
            </>}
        </>);
    }

    render() {
        const { pending, role } = this.props;
        const researcherOrAbove = role && Role.RESEARCHER_OR_ABOVE.includes(role.toUpperCase())

        return (<>
            <Spinner show={pending}/>
            <Card className="suggestions mt-4">
                <Card.Header>
                    <Card.Title>Your Suggestions</Card.Title>
                </Card.Header>
                <Card.Body>
                    {researcherOrAbove &&
                    <>
                        <p>
                            <span className="font-weight-bold">NOTE:</span>  Because your role is{' '}
                            <span className="font-weight-bold red">{role.toLowerCase()}</span>,
                            your suggestions are automatically approved.
                        </p>
                    </>
                    }
                    <Tabs defaultActiveKey="approved" id="suggestions-tabs">
                        <Tab title="Approved" eventKey="approved">
                            {this.renderSuggestions(this.filterApprovedSuggestions(), 'approved', researcherOrAbove)}
                        </Tab>
                        <Tab title="Pending" eventKey="pending">
                            {this.renderSuggestions(this.filterPendingSuggestions(), 'pending', researcherOrAbove)}
                        </Tab>
                        <Tab title="Not Approved" eventKey="rejected">
                            {this.renderSuggestions(this.filterRejectedSuggestions(), 'rejected', researcherOrAbove)}
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </>);
    }
}