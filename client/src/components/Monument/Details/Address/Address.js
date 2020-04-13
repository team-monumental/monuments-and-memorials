import React from 'react';
import './Address.scss';

/**
 * Renders the Monument's address or city, state if there's no address
 */
export default class Address extends React.Component {

    render() {
        const monument = this.props.monument;
        const locationIcon = (
            <i className="material-icons">room</i>
        );

        const address = monument.address || [monument.city, monument.state].filter(str => str && str.trim()).join(', ');
        if (address) {
            return (
                <div className="address-container font-italic">
                    {locationIcon}
                    <span className="address">{address}</span>
                </div>
            );
        }
        else {
            return (
                <div/>
            );
        }
    }
}