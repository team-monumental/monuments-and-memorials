import * as React from 'react';
import CreateMonumentSuggestion from './CreateMonumentSuggestion/CreateMonumentSuggestion';

export default class CreateMonumentSuggestions extends React.Component {

    render() {
        const { suggestions } = this.props;

        return (<>
            {suggestions && <>
                {suggestions.map((suggestion, index) => (
                    <CreateMonumentSuggestion key={suggestion.id} suggestion={suggestion} index={index + 1}/>
                ))}
            </>}
        </>);
    }
}