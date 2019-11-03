import React from 'react';
import './MapResults.scss';
import { Map, CircleMarker, Popup, TileLayer, Marker } from 'react-leaflet';
import * as leaflet from 'leaflet';
import Address from '../../Monument/Details/Address/Address';

// Coordinates of the geographic center of the US, so that the map is centered on the US
const US_GEOGRAPHIC_CENTER = [39.8283, -98.5795];

export default class MapResults extends React.Component {

    render() {
        const { monuments, useCircleMarkers, zoom } = this.props;
        const markers = [];
        for (let monument of monuments) {
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
        return (
            <Map center={US_GEOGRAPHIC_CENTER} zoom={zoom}>
                <TileLayer
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> &copy; <ahref=&quot;http://cartodb.com/attributions&quot;>CartoDB</a>"
                />
                {markers}
            </Map>
        );
    }
}