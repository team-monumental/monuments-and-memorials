import * as React from 'react';
import './ManageSuggestions.scss';
import { withRouter } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import SuggestionSearchPage from '../../../pages/AdminPage/ManageSuggestionsPage/SuggestionSearchPage/SuggestionSearchPage';
import ManageSuggestion from './ManageSuggestion/ManageSuggestion';
import UpdateMonumentSuggestions from '../../Suggestions/UpdateMonumentSuggestions/UpdateMonumentSuggestions';

class ManageSuggestions extends React.Component {

    render() {
        const { mode, history, suggestion, onApproveClick, onRejectClick, type } = this.props;

        let otherPendingForMonument;
        if (type === 'update' && suggestion && suggestion.allPendingForMonument) {
            otherPendingForMonument = suggestion.allPendingForMonument.filter(pending => pending.id !== suggestion.suggestion.id);
        }

        return (
            <div className="manage-suggestions-container">
                <div className="manage-suggestions">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <Card.Title>
                                Manage Suggestions
                            </Card.Title>
                            {mode === 'suggestion' && <>
                                <Button variant="light" className="h-100" onClick={() => history.goBack()}>Back</Button>
                            </>}
                        </Card.Header>
                        <Card.Body>
                            {(!mode || mode === 'search') &&
                                <SuggestionSearchPage showSearchResults={mode === 'search'}/>
                            }
                            {(mode === 'suggestion' && suggestion) && <>
                                <ManageSuggestion type={type} suggestion={suggestion} onApproveClick={onApproveClick}
                                                  onRejectClick={onRejectClick}/>
                            </>}
                        </Card.Body>
                    </Card>
                </div>
                {otherPendingForMonument && otherPendingForMonument.length > 0 &&
                    <div className="other-pending-update-suggestions-container">
                        <h5>Other Pending Updates To Record</h5>
                        <UpdateMonumentSuggestions suggestions={otherPendingForMonument} showTitlesAsLinks={true}/>
                    </div>
                }
        </div>);
    }
}

export default withRouter(ManageSuggestions);