import React from 'react';

/**
 * Renders the Monument's address or city, state if there's no address
 */
export default class Address extends React.Component {

    render() {
        const monument = this.props.monument;
        if (monument.address) {
            return (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <i className="material-icons">room</i> {monument.address}
                </div>
            )
        } else return (
            <div>{[monument.city, monument.state].filter(str => str && str.trim()).join(', ')}</div>
        );
    }
}