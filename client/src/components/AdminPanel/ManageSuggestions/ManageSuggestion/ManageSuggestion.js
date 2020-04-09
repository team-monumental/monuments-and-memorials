import * as React from 'react';
import './ManageSuggestion.scss';
import { Helmet } from 'react-helmet';
import CreateMonumentSuggestion from '../../../Suggestions/CreateMonumentSuggestions/CreateMonumentSuggestion/CreateMonumentSuggestion';
import ManagementButtonToolbar from '../../../Suggestions/ManagementButtonToolbar/ManagementButtonToolbar';
import UpdateMonumentSuggestion from '../../../Suggestions/UpdateMonumentSuggestions/UpdateMonumentSuggestion/UpdateMonumentSuggestion';
import UpdateMonumentSuggestions from "../../../Suggestions/UpdateMonumentSuggestions/UpdateMonumentSuggestions";

export default class ManageSuggestion extends React.Component {

    renderSuggestionStatus() {
        const { suggestion, onApproveClick, onRejectClick } = this.props;

        const isPending = !suggestion.isApproved && !suggestion.isRejected;

        return (<>
            {isPending && <ManagementButtonToolbar onApproveClick={onApproveClick} onRejectClick={onRejectClick}/>}
            {suggestion.isApproved && <div className="status approved">Approved</div>}
            {suggestion.isRejected && <div className="status rejected">Rejected</div>}
        </>);
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
        if (suggestion && suggestion.monument && suggestion.monument.title) {
            title = suggestion.monument.title;
        }

        const otherPendingForMonument = suggestion.allPendingForMonument.filter(pending => pending.id !== suggestion.suggestion.id);

        return (
            <div className="manage-suggestion update">
                <Helmet title={`Manage ${title} | Monuments and Memorials`}/>
                <div>
                    <UpdateMonumentSuggestion suggestion={suggestion.suggestion} showIndex={false}
                                              showTitleAsLink={false} expandedByDefault={true}
                                              showCollapseLinks={false}/>
                    {this.renderSuggestionStatus()}
                </div>
                <div>
                    {otherPendingForMonument && otherPendingForMonument.length > 0 && <>
                        <UpdateMonumentSuggestions suggestions={otherPendingForMonument}/>
                    </>}
                </div>
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