import * as React from 'react';
import Spinner from '../../Spinner/Spinner';
import { Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Role } from'../../../utils/authentication-util';
import CreateMonumentSuggestions from '../../Suggestions/CreateMonumentSuggestions/CreateMonumentSuggestions';

/**
 * Presentational component for displaying a list of Suggestions on the User page
 */
export default class Suggestions extends React.Component {

    render() {
        const { createSuggestions, updateSuggestions, bulkCreateSuggestions, pending, error, role } = this.props;

        const createPageNavLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace('/create');
            }} to="/create" key="create">clicking here</NavLink>
        );

        const bulkCreatePageNavLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace('/panel/bulk');
            }} to="/panel/bulk" key="bulk">clicking here</NavLink>
        );

        return (<>
            <Spinner show={pending}/>
            <Card className="suggestions mt-4">
                <Card.Header>
                    <Card.Title>Your Suggestions</Card.Title>
                </Card.Header>
                <Card.Body>
                    <h6>New Monument or Memorial Suggestions</h6>
                    {(!createSuggestions || !createSuggestions.length) && !error && <>
                        You don't have any new monument or memorial suggestions yet. You can suggest a new monument or
                        memorial by {createPageNavLink}.
                    </>}
                    {createSuggestions && createSuggestions.length && <>
                        <CreateMonumentSuggestions suggestions={createSuggestions}/>
                    </>}
                    <h6 className="mt-2">Update Monument or Memorial Suggestions</h6>
                    {(!updateSuggestions || !updateSuggestions.length) && !error && <>
                        You don't have any update monument or memorial suggestions yet. You can suggest an update to an
                        existing monument or memorial by clicking
                        the "<span className="font-weight-bold">SUGGEST A CHANGE</span>" button while viewing the
                        monument or memorial page you want to update.
                    </>}
                    {role.toUpperCase() === Role.PARTNER && <>
                        <h6 className="mt-2">Bulk New Monument or Memorial Suggestions</h6>
                        {(!bulkCreateSuggestions || !bulkCreateSuggestions.length) && !error && <>
                            You don't have any bulk new monument or memorial suggestions yet. You can suggest bulk
                            new monuments or memorials by {bulkCreatePageNavLink}.
                        </>}
                    </>}
                    {error && <>
                        Oops! Something went wrong while getting your suggestions.
                    </>}
                </Card.Body>
            </Card>
        </>);
    }
}