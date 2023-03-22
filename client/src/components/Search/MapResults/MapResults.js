import React from 'react';
import './MapResults.scss';
import { Map, CircleMarker, Popup, TileLayer, Marker } from 'react-leaflet';
import Address from '../../Monument/Details/Address/Address';
import * as Leaflet from 'leaflet';
import { Link } from 'react-router-dom';
import { getMonumentSlug } from "../../../utils/regex-util";
import BulkEditPanel from '../../AdminPanel/BulkEdit/BulkEditPanel';

// Coordinates of the geographic center of the US, so that the map is centered on the US
const US_GEOGRAPHIC_CENTER = [39.8283, -98.5795];

export default class MapResults extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            selectedMarkerId: ''
        };
    }

    handleClick(id) {
        this.setState({ selectedMarkerId: id })
    }

    render() {
        const { monuments, useCircleMarkers, zoom, center } = this.props;
        const markers = [];
        const bounds = {
            north: null,
            east: null,
            south: null,
            west: null
        };
        for (let monument of monuments.filter(monument => monument.lat && monument.lon)) {

            // For any monuments with a positive longitude, move them 360 degrees west so that they render closer to
            // the United States. This is an issue in particular with Guam because monuments there would render
            // all the way across the map to the East, instead of in the Pacific to the West like Hawaii which
            // made them difficult to view
            if (monument.lon > 0) monument.lon = monument.lon - 360;

            if (bounds.north === null || bounds.north > monument.lat) bounds.north = monument.lat;
            if (bounds.east === null || bounds.east < monument.lon) bounds.east = monument.lon;
            if (bounds.south === null || bounds.south < monument.lat) bounds.south = monument.lat;
            if (bounds.west === null || bounds.west > monument.lon) bounds.west = monument.lon;

            // regular monuments color = blue, temporary monuments color = green selected color = red
            let color = "blue"
            if (monument.isTemporary) {
                color = "green"
            }
            if (this.state.selectedMarkerId == monument.id) {
                color = "red"
            }

            const slug = getMonumentSlug(monument)

            const popup = (
                <Popup>
                    <Link to={`/monuments/${monument.id}/${slug}`}>{monument.title}</Link>
                    <Address monument={monument} />
                </Popup>
            );
            if (useCircleMarkers) {
                const latLng = Leaflet.latLng(monument.lat, monument.lon);
                if (latLng) {
                    const newMarker =
                        <CircleMarker key={monument.id} center={latLng} radius="5" color={color} onClick={() => this.handleClick(monument.id)}>
                            {popup}
                        </CircleMarker>
                    markers.push(newMarker)
                }
            } else {
                // use green marker for temporary monuments, red for selected, default marker for others
                let newMarker = <Marker key={monument.id} position={[monument.lat, monument.lon]} icon={blueIcon} onClick={() => this.handleClick(monument.id)}>
                    {popup}
                </Marker>
                if (monument.isTemporary) {
                    newMarker = <Marker key={monument.id} position={[monument.lat, monument.lon]} icon={greenIcon} onClick={() => this.handleClick(monument.id)}>
                        {popup}
                    </Marker>
                } else if (monument.id == this.state.selectedMarkerId) {
                    newMarker = <Marker key={monument.id} position={[monument.lat, monument.lon]} icon={redIcon} onClick={() => this.handleClick(monument.id)}>
                        {popup}</Marker>
                }
                markers.push(newMarker);
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

const greenIcon = new Leaflet.Icon({
    iconUrl: '/marker-icon-2x-green.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new Leaflet.Icon({
    iconUrl: '/marker-icon-2x-red.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = new Leaflet.Icon({
    iconUrl: '/marker-icon-2x-blue.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

