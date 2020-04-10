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

        return (<>
            {isPending && !isFromBulk && this.renderStatusButtons()}
            {isPending && isFromBulk && <div className="status pending">Pending</div>}
            {isApproved && <div className="status approved">Approved</div>}
            {isRejected && <div className="status rejected">Rejected</div>}
        </>);
    }
}