import * as React from 'react';
import './CreateMonumentSuggestions.scss';
import CreateMonumentSuggestion from './CreateMonumentSuggestion/CreateMonumentSuggestion';

export default class CreateMonumentSuggestions extends React.Component {

    render() {
        const { suggestions } = this.props;

        return (<>
            {suggestions && <div className="create-suggestions">
                {suggestions.map((suggestion, index) => (
                    <CreateMonumentSuggestion key={suggestion.id} suggestion={suggestion} index={index + 1}/>
                ))}
            </div>}
        </>);
    }
}