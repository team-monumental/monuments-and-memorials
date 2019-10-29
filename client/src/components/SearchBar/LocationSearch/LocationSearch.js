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

    render() {
        const { searchQuery } = this.state;
        const { className, onKeyDown, onSearch } = this.props;
        return (
            <input type="text"
                   value={searchQuery}
                   onChange={event => this.setState({searchQuery: event.target.value})}
                   placeholder="Near..."
                   className={className}
                   onKeyDown={onKeyDown}
                   onInput={() => onSearch("Location:" + searchQuery)}/>
        )
    }
}