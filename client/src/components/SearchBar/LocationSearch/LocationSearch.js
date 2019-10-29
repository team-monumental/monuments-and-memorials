import React from 'react';

/**
 * Used to search the Monument coordinates field by location
 */
export default class LocationSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: props.value
        };
    }

    handleChange(event) {
        const { onSearchChange } = this.props;
        const newSearchQuery = event.target.value;

        this.setState({searchQuery: newSearchQuery});
        onSearchChange(newSearchQuery);
    }

    render() {
        const { searchQuery } = this.state;
        const { className, onKeyDown } = this.props;
        return (
            <input type="text"
                   value={searchQuery}
                   onChange={event => this.handleChange(event)}
                   placeholder="Near..."
                   className={className}
                   onKeyDown={onKeyDown}/>
        )
    }
}