import * as React from 'react';
import './ManageSuggestion.scss';
import {Helmet} from 'react-helmet';
import CreateMonumentSuggestion
    from '../../../Suggestions/CreateMonumentSuggestions/CreateMonumentSuggestion/CreateMonumentSuggestion';
import UpdateMonumentSuggestion
    from '../../../Suggestions/UpdateMonumentSuggestions/UpdateMonumentSuggestion/UpdateMonumentSuggestion';
import {Alert} from 'react-bootstrap';
import BulkCreateMonumentSuggestion
    from '../../../Suggestions/BulkCreateMonumentSuggestions/BulkCreateMonumentSuggestion/BulkCreateMonumentSuggestion';
import SuggestionStatus from './SuggestionStatus/SuggestionStatus';

export default class ManageSuggestion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alertDismissed: false
        };
    }

    renderUpdateNotice() {
        let {suggestion} = this.props;
        const {alertDismissed} = this.state;

        if (suggestion.suggestion) {
            suggestion = suggestion.suggestion;
        }

        const isPending = !suggestion.isApproved && !suggestion.isRejected;

        return (
            <>
                {suggestion && isPending && suggestion.monument && suggestion.monument.lastModifiedDate > suggestion.createdDate &&
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
        const {suggestion, onApproveClick, onRejectClick} = this.props;

        return (
            <div className="manage-suggestion">
                <Helmet title={`Manage ${suggestion.title} | Monuments and Memorials`}/>
                <CreateMonumentSuggestion suggestion={suggestion} showIndex={false} showTitleAsLink={false}
                                          expandedByDefault={true} showCollapse={true} showCollapseLinks={false}
                                          showCreatedBy={true}/>
                <SuggestionStatus isApproved={suggestion.isApproved} isRejected={suggestion.isRejected}
                                  onApproveClick={onApproveClick} onRejectClick={onRejectClick}/>
            </div>
        );
    }

    renderManageUpdateSuggestion() {
        let {suggestion, onApproveClick, onRejectClick} = this.props;

        if (suggestion.suggestion) {
            suggestion = suggestion.suggestion;
        }

        let title;
        if (suggestion && suggestion.monument && suggestion.monument.title) {
            title = suggestion.monument.title;
        }

        return (
            <div className="manage-suggestion">
                <Helmet title={`Manage ${title} | Monuments and Memorials`}/>
                {this.renderUpdateNotice()}
                <UpdateMonumentSuggestion suggestion={suggestion} showIndex={false}
                                          showTitleAsLink={false} expandedByDefault={true}
                                          showCollapseLinks={false} showCreatedBy={true}/>
                <SuggestionStatus isApproved={suggestion.isApproved} isRejected={suggestion.isRejected}
                                  onApproveClick={onApproveClick} onRejectClick={onRejectClick}/>
            </div>
        );
    }

    renderManageBulkSuggestion() {
        const {suggestion, onApproveClick, onRejectClick} = this.props;

        return (
            <div className="manage-suggestion">
                <Helmet title={`Manage ${suggestion.fileName} | Monuments and Memorials`}/>
                <BulkCreateMonumentSuggestion suggestion={suggestion} showIndex={false} showTitleAsLink={false}
                                              displayCreateMonumentStatuses={true} showCreateTitlesAsLinks={true}
                                              showCreatedBy={true}/>
                <SuggestionStatus isApproved={suggestion.isApproved} isRejected={suggestion.isRejected}
                                  onApproveClick={onApproveClick} onRejectClick={onRejectClick}
                                  isBulk={true}/>
            </div>
        );
    }

    render() {
        const {type} = this.props;

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