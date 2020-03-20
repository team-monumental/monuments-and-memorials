import React from 'react';

/**
 * Used to search text fields such as title, artist, and description
 * Has a placeholder animation that shows users what kind of things they can search for
 */
export default class TextSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: props.value,
            searchPlaceholder: props.placeholder || ''
        };
        if (!props.disableAnimation) this.animateSearchPlaceholder();
    }

    handleChange(event) {
        const { onSearchChange } = this.props;
        const newSearchQuery = event.target.value;

        this.setState({searchQuery: newSearchQuery});
        onSearchChange(newSearchQuery);
    }

    handleClear() {
        const { onClear } = this.props;
        this.setState({searchQuery: ''});
        onClear();
    }

    render() {
        const { searchPlaceholder, searchQuery } = this.state;
        const { className, onKeyDown } = this.props;
        return (
            <div className="text-search position-relative">
                <input type="text"
                       value={searchQuery}
                       onChange={(event) => this.handleChange(event)}
                       placeholder={searchPlaceholder}
                       className={className}
                       onKeyDown={onKeyDown}/>
                {searchQuery && <i className="material-icons search-clear" onClick={() => this.handleClear()}>clear</i>}
            </div>
        )
    }

    /**
     * Controls the animation for showing examples in the search placeholder
     */
    async animateSearchPlaceholder() {
        const placeholderBase = 'Search';
        const placeholderExamples = ['monuments', 'memorials', 'artists'];
        for (let i = 0; i < 2; i ++) {
            for (let exampleIndex = 0; exampleIndex < placeholderExamples.length; exampleIndex++) {
                let placeholderAddition = ' ' + placeholderExamples[exampleIndex] + '...';
                // Type in the current example
                await this.typeForward(placeholderBase, placeholderAddition);
                // Let it sit for a couple seconds
                await new Promise(resolve => window.setTimeout(resolve, 2000));
                // Backspace it out
                await this.typeBackward(placeholderBase, placeholderAddition);
            }
        }

        await this.typeForward(placeholderBase, ' ' + placeholderExamples.join(', ') + '...');
    }

    /**
     * Animates typing out an example in the search placeholder
     * @param placeholderBase       The existing text for the search bar i.e. "Search"
     * @param placeholderAddition   The text to type into the search bar i.e. " monuments..."
     */
    async typeForward(placeholderBase, placeholderAddition) {
        for (let i = 0; i < placeholderAddition.length; i++) {
            // A promise wraps the timeout function here so that we can await the end of the timeout
            await new Promise(resolve => {
                // There is some slight randomness to the typing speed to make it feel a little more natural
                let timeout = Math.max(100, Math.random() * 200);
                // For the ellipsis the same 100ms is always used since you would be typing it quickly
                if (placeholderAddition.substring(i, i +1) === '.') timeout = 100;
                // Calling the resolve function says that our promise has succeeded and anything awaiting it can move forward
                window.setTimeout(() => {
                    this.setState({searchPlaceholder: placeholderBase + placeholderAddition.substring(0, i + 1)});
                    resolve();
                }, timeout);
            });
        }
    }

    /**
     * Animates backspacing out an example in the search placeholder
     * @param placeholderBase       The text to return to, i.e. "Search"
     * @param placeholderAddition   The starting text in the search bar after the base, i.e. " monument..."
     */
    async typeBackward(placeholderBase, placeholderAddition) {
        for (let i = placeholderAddition.length; i >= 0; i--) {
            // A promise wraps the timeout function here so that we can await the end of the timeout
            await new Promise(resolve => {
                window.setTimeout(() => {
                    this.setState({searchPlaceholder: placeholderBase + placeholderAddition.substring(0, i)});
                    // Calling the resolve function says that our promise has succeeded and anything awaiting it can move forward
                    resolve();
                }, 100);
            });
        }
    }
}