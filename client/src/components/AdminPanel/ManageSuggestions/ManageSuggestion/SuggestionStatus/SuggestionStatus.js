import * as React from 'react';
import './SuggestionStatus.scss';
import { Button } from 'react-bootstrap';

/**
 * Presentational component that displays the current status of a Suggestion
 */
export default class SuggestionStatus extends React.Component {

    renderStatusButtons() {
        const { onApproveClick, onRejectClick, isBulk } = this.props;

        return (
            <div className="buttons mt-3">
                <Button variant="primary" onClick={onApproveClick} className="mr-1">
                    {isBulk ? 'Approve All' : 'Approve'}
                </Button>
                <Button variant="danger" onClick={onRejectClick} className="ml-1">
                    {isBulk ? 'Reject All' : 'Reject'}
                </Button>
            </div>
        );
    }

    render() {
        const { isApproved, isRejected, isFromBulk } = this.props;

        const isPending = !isApproved && !isRejected;

        if (isPending && !isFromBulk) {
            return this.renderStatusButtons();
        }

        let statusDisplay;
        if (isPending && isFromBulk) {
            statusDisplay = <span className="status pending">Pending</span>
        }
        else if (isApproved) {
            statusDisplay = <span className="status approved">Approved</span>
        }
        else if (isRejected) {
            statusDisplay = <span className="status rejected">Rejected</span>
        }

        return (
            <div className="status-container">
                Status:&nbsp;{statusDisplay}
            </div>
        );
    }
}