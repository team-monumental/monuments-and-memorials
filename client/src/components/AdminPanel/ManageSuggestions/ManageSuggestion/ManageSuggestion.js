import * as React from 'react';
import './ManageSuggestion.scss';
import { Helmet } from 'react-helmet';
import CreateMonumentSuggestion from '../../../Suggestions/CreateMonumentSuggestions/CreateMonumentSuggestion/CreateMonumentSuggestion';
import ManagementButtonToolbar from '../../../Suggestions/ManagementButtonToolbar/ManagementButtonToolbar';

export default class ManageSuggestion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            reviewing: true
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.statusChangeSuccess && this.props.statusChangeSuccess !== prevProps.statusChangeSuccess) {
            this.setState({reviewing: false});
        }
    }

    renderManageCreateSuggestion() {
        const { suggestion, onApproveClick, onRejectClick } = this.props;
        const { reviewing } = this.state;

        return (
            <div className="manage-suggestion">
                <Helmet title={`Manage ${suggestion.title} | Monuments and Memorials`}/>
                <CreateMonumentSuggestion suggestion={suggestion} showIndex={false} showTitleAsLink={false}
                                          expandedByDefault={true} showCollapse={true} showCollapseLinks={false}/>
                {reviewing && <ManagementButtonToolbar onApproveClick={onApproveClick} onRejectClick={onRejectClick}/>}
                {suggestion.isApproved && <div className="approved">Approved</div>}
                {suggestion.isRejected && <div className="rejected">Rejected</div>}
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