import * as React from 'react';
import './ManageSuggestion.scss';
import { Helmet } from 'react-helmet';
import CreateMonumentSuggestion from '../../../Suggestions/CreateMonumentSuggestions/CreateMonumentSuggestion/CreateMonumentSuggestion';
import ManagementButtonToolbar from '../../../Suggestions/ManagementButtonToolbar/ManagementButtonToolbar';

export default class ManageSuggestion extends React.Component {

    renderManageCreateSuggestion() {
        const { suggestion, onApproveClick, onRejectClick } = this.props;

        const isPending = !suggestion.isApproved && !suggestion.isRejected;

        return (
            <div className="manage-suggestion">
                <Helmet title={`Manage ${suggestion.title} | Monuments and Memorials`}/>
                <CreateMonumentSuggestion suggestion={suggestion} showIndex={false} showTitleAsLink={false}
                                          expandedByDefault={true} showCollapse={true} showCollapseLinks={false}/>
                {isPending && <ManagementButtonToolbar onApproveClick={onApproveClick} onRejectClick={onRejectClick}/>}
            </div>
        );
    }

    renderManageUpdateSuggestion() {
        return <div/>;
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