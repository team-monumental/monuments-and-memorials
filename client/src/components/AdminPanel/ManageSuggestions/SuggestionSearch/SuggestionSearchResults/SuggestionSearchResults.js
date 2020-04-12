import * as React from 'react';
import './SuggestionSearchResults.scss';
import CreateMonumentSuggestions from '../../../../Suggestions/CreateMonumentSuggestions/CreateMonumentSuggestions';
import UpdateMonumentSuggestions from '../../../../Suggestions/UpdateMonumentSuggestions/UpdateMonumentSuggestions';
import BulkCreateMonumentSuggestions from '../../../../Suggestions/BulkCreateMonumentSuggestions/BulkCreateMonumentSuggestions';

export default class SuggestionSearchResults extends React.Component {

    render() {
        const { suggestions } = this.props;

        if (suggestions) {
            return (
                <div className="suggestion-search-results">
                    {suggestions.createSuggestions && suggestions.createSuggestions.length > 0 && <>
                        <h5>New Monument or Memorial Suggestion Results</h5>
                        <CreateMonumentSuggestions suggestions={suggestions.createSuggestions} hideMoreThan={3}
                                                   showSuggestionCollapse={false}
                                                   showTitlesAsLinks={true}/>
                    </>}
                    {suggestions.updateSuggestions && suggestions.updateSuggestions.length > 0 && <>
                        <h5 className="mt-4">Update Monument or Memorial Suggestion Results</h5>
                        <UpdateMonumentSuggestions suggestions={suggestions.updateSuggestions} hideMoreThan={3}
                                                   showTitlesAsLinks={true}/>
                    </>}
                    {suggestions.bulkCreateSuggestions && suggestions.bulkCreateSuggestions.length > 0 && <>
                        <h5 className="mt-4">Bulk New Monument or Memorial Suggestion Results</h5>
                        <BulkCreateMonumentSuggestions suggestions={suggestions.bulkCreateSuggestions} hideMoreThan={3}
                                                       showTitlesAsLinks={true}/>
                    </>}
                </div>
            );
        }
        else {
            return (
                <div className="mt-4 text-center">No search results were found. Try broadening your search.</div>
            );
        }
    }
}