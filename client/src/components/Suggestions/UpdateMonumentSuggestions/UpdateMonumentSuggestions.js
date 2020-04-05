import * as React from 'react';
import './UpdateMonumentSuggestions.scss';
import UpdateMonumentSuggestion from './UpdateMonumentSuggestion/UpdateMonumentSuggestion';
import { Collapse } from 'react-bootstrap';

export default class UpdateMonumentSuggestions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    handleCollapseLinkClick() {
        const { expanded } = this.state;
        this.setState({expanded: !expanded});
    }

    renderExpandLink() {
        return (
            <div className="collapse-link pt-3" onClick={() => this.handleCollapseLinkClick()}>
                Show All Suggestions
            </div>
        );
    }

    renderHideLink() {
        return (
            <div className="collapse-link pt-3" onClick={() => this.handleCollapseLinkClick()}>
                Hide All Suggestions
            </div>
        );
    }

    render() {
        const { suggestions, hideMoreThan } = this.props;
        const { expanded } = this.state;

        let showingSuggestions = suggestions;
        let hiddenSuggestions;
        let hiddenSuggestionsStartIndex;
        if (hideMoreThan && suggestions.length > hideMoreThan) {
            showingSuggestions = suggestions.slice(0, hideMoreThan);
            hiddenSuggestions = suggestions.slice(hideMoreThan);
            hiddenSuggestionsStartIndex = showingSuggestions.length - 1;
        }

        return (<>
            {suggestions && <div className="update-suggestions">
                {showingSuggestions.map((suggestion, index) => (
                    <UpdateMonumentSuggestion key={suggestion.id} suggestion={suggestion} index={index + 1}/>
                ))}
                {hiddenSuggestions && hiddenSuggestions.length > 0 && <>
                    <Collapse in={expanded}>
                        <div className="hidden-update-suggestions">
                            {hiddenSuggestions.map((suggestion) => {
                                hiddenSuggestionsStartIndex++;
                                return (
                                    <UpdateMonumentSuggestion key={suggestion.id} suggestion={suggestion} index={hiddenSuggestionsStartIndex + 1}/>
                                );
                            })}
                        </div>
                    </Collapse>

                    {!expanded && this.renderExpandLink()}
                    {expanded && this.renderHideLink()}
                </>}
            </div>}
        </>);
    }
}