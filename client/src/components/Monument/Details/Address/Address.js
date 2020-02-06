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

        if (monument.address) {
            return (
                <div style={{display: 'flex', alignItems: 'center'}} className="address-container font-italic">
                    {locationIcon} {monument.address}
                </div>
            )
        } else if (monument.city && monument.state) {
            return (
                <div className="address-container font-italic">
                    {locationIcon}
                    <span className="city-state">{[monument.city, monument.state].filter(str => str && str.trim()).join(', ')}</span>
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