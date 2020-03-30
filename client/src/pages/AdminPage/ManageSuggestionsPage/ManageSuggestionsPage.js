import * as React from 'react';
import { connect } from 'react-redux';
import { fetchBulkCreateSuggestion, fetchCreateSuggestion, fetchUpdateSuggestion } from '../../../actions/suggestions';
import Spinner from '../../../components/Spinner/Spinner';
import ManageSuggestions from '../../../components/AdminPanel/ManageSuggestions/ManageSuggestions';

class ManageSuggestionsPage extends React.Component {

    static mapStateToProps(state) {
        return {
            fetchCreateSuggestion: state.fetchCreateSuggestion,
            fetchUpdateSuggestion: state.fetchUpdateSuggestion,
            fetchBulkCreateSuggestion: state.fetchBulkCreateSuggestion
        };
    }

    componentDidMount() {
        this.fetchSuggestionIfIdAndTypeExists();
    }

    fetchSuggestionIfIdAndTypeExists() {
        const { dispatch, match: { params: { suggestionId, type } } } = this.props;

        if (suggestionId && type) {
            try {
                if (!isNaN(parseInt(suggestionId))) {
                    switch (type) {
                        case 'create':
                            dispatch(fetchCreateSuggestion(suggestionId));
                            break;
                        case 'update':
                            dispatch(fetchUpdateSuggestion(suggestionId));
                            break;
                        case 'bulk':
                            dispatch(fetchBulkCreateSuggestion(suggestionId));
                            break;
                        default:
                            break;
                    }
                }
            } catch (err) {}
        }
    }

    render() {
        const { mode, fetchCreateSuggestion, fetchUpdateSuggestion, fetchBulkCreateSuggestion } = this.props;

        const suggestion = fetchCreateSuggestion.result || fetchUpdateSuggestion.result || fetchBulkCreateSuggestion.result;

        return (<>
            <Spinner show={fetchCreateSuggestion.pending || fetchUpdateSuggestion.pending || fetchBulkCreateSuggestion.pending}/>
            <ManageSuggestions mode={mode} suggestion={suggestion}/>
        </>);
    }
}

export default connect(ManageSuggestionsPage.mapStateToProps)(ManageSuggestionsPage);