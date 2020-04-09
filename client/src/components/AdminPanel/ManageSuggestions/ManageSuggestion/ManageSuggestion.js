import * as React from 'react';
import './ManageSuggestion.scss';
import { Helmet } from 'react-helmet';
import CreateMonumentSuggestion from '../../../Suggestions/CreateMonumentSuggestions/CreateMonumentSuggestion/CreateMonumentSuggestion';
import ManagementButtonToolbar from '../../../Suggestions/ManagementButtonToolbar/ManagementButtonToolbar';
import UpdateMonumentSuggestion from '../../../Suggestions/UpdateMonumentSuggestions/UpdateMonumentSuggestion/UpdateMonumentSuggestion';
import { Alert } from 'react-bootstrap';

export default class ManageSuggestion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alertDismissed: false
        };
    }

    renderSuggestionStatus() {
        const { suggestion, onApproveClick, onRejectClick } = this.props;

        let isPending;
        if (suggestion.suggestion) {
            isPending = !suggestion.suggestion.isApproved && !suggestion.suggestion.isRejected;
        }
        else {
            isPending = !suggestion.isApproved && !suggestion.isRejected;
        }

        let isApproved;
        if (suggestion.suggestion) {
            isApproved = suggestion.suggestion.isApproved;
        }
        else {
            isApproved = suggestion.isApproved;
        }

        let isRejected;
        if (suggestion.suggestion) {
            isRejected = suggestion.suggestion.isRejected;
        }
        else {
            isRejected = suggestion.isRejected;
        }

        return (<>
            {isPending && <ManagementButtonToolbar onApproveClick={onApproveClick} onRejectClick={onRejectClick}/>}
            {isApproved && <div className="status approved">Approved</div>}
            {isRejected && <div className="status rejected">Rejected</div>}
        </>);
    }

    renderUpdateNotice() {
        const { suggestion } = this.props;
        const { alertDismissed } = this.state;

        return (
            <>
                {suggestion && suggestion.suggestion && suggestion.suggestion.monument &&
                suggestion.suggestion.monument.lastModifiedDate > suggestion.suggestion.createdDate &&
                !alertDismissed &&
                    <Alert variant="danger" onClose={() => this.setState({alertDismissed: true})} dismissible>
                        <i className="material-icons mr-2">warning</i>
                        <span>
                            This record has been updated since this suggestion was created. Approving this suggestion
                            may overwrite those changes.
                        </span>
                    </Alert>
                }
            </>
        );
    }

    renderManageCreateSuggestion() {
        const { suggestion } = this.props;

        return (
            <div className="manage-suggestion">
                <Helmet title={`Manage ${suggestion.title} | Monuments and Memorials`}/>
                <CreateMonumentSuggestion suggestion={suggestion} showIndex={false} showTitleAsLink={false}
                                          expandedByDefault={true} showCollapse={true} showCollapseLinks={false}/>
                {this.renderSuggestionStatus()}
            </div>
        );
    }

    renderManageUpdateSuggestion() {
        const { suggestion } = this.props;

        let title;
        if (suggestion.suggestion && suggestion.suggestion.monument && suggestion.suggestion.monument.title) {
            title = suggestion.suggestion.monument.title;
        }
        else if (suggestion && suggestion.monument && suggestion.monument.title) {
            title = suggestion.monument.title;
        }

        return (
            <div className="manage-suggestion">
                <Helmet title={`Manage ${title} | Monuments and Memorials`}/>
                {this.renderUpdateNotice()}
                <UpdateMonumentSuggestion suggestion={suggestion.suggestion || suggestion} showIndex={false}
                                          showTitleAsLink={false} expandedByDefault={true}
                                          showCollapseLinks={false}/>
                {this.renderSuggestionStatus()}
            </div>
        );
    }

    renderManageBulkSuggestion() {
        return <div/>;
    }

    render() {
        const { type } = this.props;

        switch (type) {
            case 'create':
                return this.renderManageCreateSuggestion();
            case 'update':
                return this.renderManageUpdateSuggestion();
            case 'bulk':
                return this.renderManageBulkSuggestion();
            default:
                return <div/>;
        }
    }
}