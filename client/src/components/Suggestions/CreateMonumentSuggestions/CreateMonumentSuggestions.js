import * as React from 'react';
import './CreateMonumentSuggestions.scss';
import CreateMonumentSuggestion from './CreateMonumentSuggestion/CreateMonumentSuggestion';
import { Collapse } from 'react-bootstrap';

export default class CreateMonumentSuggestions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: props.expandedByDefault || false
        }
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
        const { suggestions, hideMoreThan, showSuggestionCollapse, showTitlesAsLinks,
            showCollapseLinks=true, displayStatuses, areFromBulk } = this.props;
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
            {suggestions && <div className="create-suggestions">
                {showingSuggestions.map((suggestion, index) => (
                    <CreateMonumentSuggestion key={suggestion.id} suggestion={suggestion} index={index + 1}
                                              showCollapse={showSuggestionCollapse}
                                              showTitleAsLink={showTitlesAsLinks} displayStatus={displayStatuses}
                                              isFromBulk={areFromBulk} showCollapseLinks={showCollapseLinks}/>
                ))}
                {hiddenSuggestions && hiddenSuggestions.length > 0 && <>
                    <Collapse in={expanded}>
                        <div className="hidden-create-suggestions">
                            {hiddenSuggestions.map((suggestion) => {
                                hiddenSuggestionsStartIndex++;
                                return (
                                    <CreateMonumentSuggestion key={suggestion.id} suggestion={suggestion}
                                                              index={hiddenSuggestionsStartIndex + 1}
                                                              showCollapse={showSuggestionCollapse}
                                                              showTitleAsLink={showTitlesAsLinks}
                                                              displayStatus={displayStatuses}
                                                              isFromBulk={areFromBulk}
                                                              showCollapseLinks={showCollapseLinks}
                                    />
                                );
                            })}
                        </div>
                    </Collapse>

                    {!expanded && showCollapseLinks && this.renderExpandLink()}
                    {expanded && showCollapseLinks && this.renderHideLink()}
                </>}
            </div>}
        </>);
    }
}