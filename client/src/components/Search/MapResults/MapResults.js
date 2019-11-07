import React from 'react';
import './MapResults.scss';
import { Map, CircleMarker, Popup, TileLayer, Marker } from 'react-leaflet';
import * as leaflet from 'leaflet';
import Address from '../../Monument/Details/Address/Address';
import * as Leaflet from 'leaflet';

// Coordinates of the geographic center of the US, so that the map is centered on the US
const US_GEOGRAPHIC_CENTER = [39.8283, -98.5795];

export default class MapResults extends React.Component {

    render() {
        const { monuments, useCircleMarkers, zoom, center } = this.props;
        const markers = [];
        const bounds = {
            north: null,
            east: null,
            south: null,
            west: null
        };
        for (let monument of monuments) {

            if (bounds.north === null || bounds.north > monument.lat) bounds.north = monument.lat;
            if (bounds.east === null || bounds.east < monument.lon) bounds.east = monument.lon;
            if (bounds.south === null || bounds.south < monument.lat) bounds.south = monument.lat;
            if (bounds.west === null || bounds.west > monument.lon) bounds.west = monument.lon;

            const popup = (
                <Popup>
                    <a href={'/monuments/' + monument.id}>{monument.title}</a>
                    <Address monument={monument}/>
                </Popup>
            );
            if (useCircleMarkers) {
                markers.push((
                    <CircleMarker key={monument.id} center={leaflet.latLng(monument.lat, monument.lon)} radius="5">
                        {popup}
                    </CircleMarker>
                ));
            } else {
                markers.push((
                    <Marker key={monument.id} position={[monument.lat, monument.lon]}>
                        {popup}
                    </Marker>
                ));
            }
        }

        // If there is more than one marker, we can create a bounding rectangle around them, using the most extreme
        // latitudes and longitudes to create corners
        const options = {};
        if (bounds.north && bounds.east && bounds.north !== bounds.south && bounds.east !== bounds.west) {
            // To give some padding, we offset by 0.1 degree. This is obviously not scaled with zoom so it's not perfect
            const padding = 0.1;
            options.bounds = Leaflet.latLngBounds([[bounds.north - padding, bounds.west - padding], [bounds.south + padding, bounds.east + padding]]);
        }

        return (
            <Map center={center || US_GEOGRAPHIC_CENTER} zoom={zoom} {...options}>
                <TileLayer
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> &copy; <ahref=&quot;http://cartodb.com/attributions&quot;>CartoDB</a>"
                />
                {markers}
            </Map>
        );
    }
}