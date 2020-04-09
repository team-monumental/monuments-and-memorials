import * as React from 'react';
import './ManageSuggestion.scss';
import { Helmet } from 'react-helmet';
import CreateMonumentSuggestion from '../../../Suggestions/CreateMonumentSuggestions/CreateMonumentSuggestion/CreateMonumentSuggestion';
import ManagementButtonToolbar from '../../../Suggestions/ManagementButtonToolbar/ManagementButtonToolbar';
import UpdateMonumentSuggestion from '../../../Suggestions/UpdateMonumentSuggestions/UpdateMonumentSuggestion/UpdateMonumentSuggestion';

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

        console.log(suggestion);

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