import React from 'react';
import './Monument.scss';
import { Redirect } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import * as slugify from 'slugify';

export default class Monument extends React.Component {

    constructor(props) {
        super(props);
        this.state = {monument: {}, monumentProperties: []};
    }

    async componentDidMount() {
        const { match: { params: { monumentId, slug } } } = this.props;
        const response = await fetch(`/api/monument/${monumentId}`);
        const monument = await response.json();
        console.log(monument);
        const monumentProperties = [];
        for (let prop in monument) {
            if (!monument.hasOwnProperty(prop)) continue;
            monumentProperties.push({name: prop, value: monument[prop]});
        }
        this.setState({monument, monumentProperties, slug});
    }

    /**
     * This function encapsulates the logic to add the slug at the end of the url if it's not present
     */
    redirectToSlug() {
        const monument = this.state.monument;
        const slug = this.state.slug;
        // Wait for the monument to be loaded in from the API
        // If there's no title, slugify will throw an error, so only proceed if there's a title
        if (!monument || !monument.title) return;
        // Slugify the monument's title
        const newSlug = slugify(monument.title);
        // Don't redirect if the correct slug is already present
        if (slug !== newSlug) {
            // Redirect via React Router
            return <Redirect to={`/monuments/${monument.id}/${newSlug}`}/>;
        }
    }

    render() {
        return (
            <div className="page-container">
                {this.redirectToSlug()}
                <div className="fields">
                    <Card>
                        <Card.Body>
                            {this.state.monumentProperties.map(prop =>
                                <div key={prop.name}>
                                    <span style={{fontWeight: 'bold'}}>{prop.name}:&nbsp;</span>
                                    <span>{prop.value}</span>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className="map">
                    <iframe title="gmaps-iframe"
                            src={`https://maps.google.com/maps?q=${this.state.monument.coordinatePointAsString}&z=16&output=embed`}
                            frameBorder="0"/>
                </div>
            </div>
        )
    }
}