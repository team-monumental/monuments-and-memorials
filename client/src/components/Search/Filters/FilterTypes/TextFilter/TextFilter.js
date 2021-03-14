import React from 'react';
import './TextFilter.scss';

/**
 * Used to search text fields such as title, artist, and description
 * Has a placeholder animation that shows users what kind of things they can search for
 */
export default class TextFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: props.value,
            searchPlaceholder: props.placeholder || 'Search monuments...'
        };

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value) {
            this.setState({searchQuery: this.props.value});
        }
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
            <div className="text-filter position-relative">
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

}