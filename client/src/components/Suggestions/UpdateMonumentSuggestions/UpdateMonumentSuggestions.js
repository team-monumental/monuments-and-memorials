import * as React from 'react';
import './UpdateMonumentSuggestions.scss';
import UpdateMonumentSuggestion from './UpdateMonumentSuggestion/UpdateMonumentSuggestion';

export default class UpdateMonumentSuggestions extends React.Component {

    render() {
        const { suggestions } = this.props;

        return (<>
            {suggestions && <div className="update-suggestions">
                {suggestions.map((suggestion, index) => (
                    <UpdateMonumentSuggestion key={suggestion.id} suggestion={suggestion} index={index + 1}/>
                ))}
            </div>}
        </>);
    }
}