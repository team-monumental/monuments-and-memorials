import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import SuggestionSearchPage from '../../../pages/AdminPage/ManageSuggestionsPage/SuggestionSearchPage/SuggestionSearchPage';

class ManageSuggestions extends React.Component {

    render() {
        const { mode, history, suggestion } = this.props;

        return (
            <div className="manage-suggestions">
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <Card.Title>
                            Manage Suggestions
                        </Card.Title>
                        {mode === 'suggestion' && <>
                            <Button variant="light" className="h-75" onClick={() => history.goBack()}>Back</Button>
                        </>}
                    </Card.Header>
                    <Card.Body>
                        {(!mode || mode === 'search') &&
                            <SuggestionSearchPage showSearchResults={mode === 'search'}/>
                        }
                        {(mode === 'suggestion' && suggestion) &&
                            <ManageSuggestion suggestion={suggestion}/>
                        }
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default withRouter(ManageSuggestions);