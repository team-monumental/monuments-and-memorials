import React from 'react';

export default class Map extends React.Component {

    render() {
        const monument = this.props.monument;
        return (
            <div className="visit">
                <div className="map">
                    <iframe title="gmaps-iframe"
                            src={`https://maps.google.com/maps?q=${monument.address ? monument.address : monument.coordinatePointAsString}&z=16&output=embed`}
                            frameBorder="0"/>
                </div>
            </div>
        )
    }
}