import * as React from 'react';
import './BulkCreateMonumentSuggestions.scss';
import BulkCreateMonumentSuggestion from './BulkCreateMonumentSuggestion/BulkCreateMonumentSuggestion';
import { Collapse } from 'react-bootstrap';

export default class BulkCreateMonumentSuggestions extends React.Component {

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
            {suggestions && <div className="bulk-create-suggestions">
                {showingSuggestions.map((suggestion, index) => (
                    <BulkCreateMonumentSuggestion key={suggestion.id} suggestion={suggestion} index={index + 1}/>
                ))}
                {hiddenSuggestions && hiddenSuggestions.length > 0 && <>
                    <Collapse in={expanded}>
                        <div className="hidden-bulk-create-suggestions">
                            {hiddenSuggestions.map((suggestion) => {
                                hiddenSuggestionsStartIndex++;
                                return (
                                    <BulkCreateMonumentSuggestion key={suggestion.id} suggestion={suggestion} index={hiddenSuggestionsStartIndex + 1}/>
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