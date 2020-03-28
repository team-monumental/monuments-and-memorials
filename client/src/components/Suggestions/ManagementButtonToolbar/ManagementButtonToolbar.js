import * as React from 'react';
import './ManageButtonToolbar.scss';
import { Button } from 'react-bootstrap';

/**
 * Presentational component for displaying the approval and reject buttons on a Suggestion
 */
export default class ManagementButtonToolbar extends React.Component {

    render() {
        const { onApproveClick, onRejectClick } = this.props;

        return (
            <div className="buttons mt-3">
                <Button variant="primary" onClick={onApproveClick} className="mr-1">
                    Approve
                </Button>
                <Button variant="danger" onClick={onRejectClick} className="ml-1">
                    Reject
                </Button>
            </div>
        );
    }
}