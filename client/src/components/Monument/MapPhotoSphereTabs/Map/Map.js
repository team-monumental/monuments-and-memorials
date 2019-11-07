import React from 'react';

/**
 * Displays a Google Maps iframe of a Monument's location
 */
export default class Map extends React.Component {

    render() {
        const monument = this.props.monument;

        let q = monument.address;
        if (!q && monument.lat && monument.lon) q = [monument.lat, monument.lon].join(',');

        return (
            <iframe title="gmaps-iframe"
                    src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
                    frameBorder="0"/>
        )
    }
}