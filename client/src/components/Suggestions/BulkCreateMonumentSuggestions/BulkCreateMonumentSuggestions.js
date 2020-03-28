import * as React from 'react';
import './BulkCreateMonumentSuggestions.scss';
import BulkCreateMonumentSuggestion from './BulkCreateMonumentSuggestion/BulkCreateMonumentSuggestion';

export default class BulkCreateMonumentSuggestions extends React.Component {

    render() {
        const { suggestions } = this.props;

        return (<>
            {suggestions && <div className="bulk-create-suggestions">
                {suggestions.map((suggestion, index) => (
                    <BulkCreateMonumentSuggestion key={suggestion.id} suggestion={suggestion} index={index + 1}/>
                ))}
            </div>}
        </>);
    }
}