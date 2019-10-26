import React from 'react';

export default class TextSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: props.value,
            searchPlaceholder: ''
        };
        this.animateSearchPlaceholder();
    }

    render() {
        const { searchPlaceholder, searchQuery } = this.state;
        const { className, onKeyDown } = this.props;
        return (
            <input type="text"
                   value={searchQuery}
                   onChange={event => this.setState({searchQuery: event.target.value})}
                   placeholder={searchPlaceholder}
                   className={className}
                   onKeyDown={onKeyDown}/>
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