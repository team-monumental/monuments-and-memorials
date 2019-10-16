import React from 'react';
import './Monument.scss';
import { Redirect } from 'react-router-dom';
import { Button, Card, Collapse } from 'react-bootstrap';
import * as slugify from 'slugify';
import * as moment from 'moment';

export default class Monument extends React.Component {

    constructor(props) {
        super(props);
        this.state = {monument: {}, monumentProperties: [], detailsOpen: false};
    }

    async componentDidMount() {
        const { match: { params: { monumentId, slug } } } = this.props;
        const response = await fetch(`/api/monument/${monumentId}`);
        const monument = await response.json();
        console.log(monument);
        if (monument.errors) {
            console.error(monument.errors);
            this.setState({error: monument.errors[0]});
            return;
        }
        this.setState({monument, slug});
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
        if (this.state.error) return this.renderError();

        return (
            <div className="page-container container">
                <div class="row">
                    {this.redirectToSlug()}
                    <div className="col"/>
                    <div className="col d-flex justify-content-center">
                        {this.renderMainCard()}
                    </div>
                    <div className="col d-flex justify-content-center">
                        {this.renderVisitCard()}
                    </div>
                </div>
            </div>
        )
    }

    renderMainCard() {
        const monument = this.state.monument;

        const capitalize = (word) => word ? word.charAt(0).toUpperCase() + word.slice(1).trim() : word;
        const parseState = (state) => {
            if (!state) return state;
            if (state.toLowerCase() === 'dc') state = 'd.c.';
            return state.toUpperCase().trim();
        };
        const prettyPrintDate = (date) => {
            if (!date) return;
            date = moment(new Date(date));
            // Wednesday, October 16th, 2019 format
            return date.format('dddd, MMMM Do, YYYY');
        };

        return (
            <div className="main">
                <Card>
                    <Card.Title>
                        {monument.title}
                    </Card.Title>
                    <Card.Body>
                        <div className="fields">
                            <div className="field font-italic">{capitalize(monument.city)}, {parseState(monument.state)}</div>
                            <div className="field">{monument.title} is a {monument.material} monument{monument.date ? ' dedicated on ' + prettyPrintDate(monument.date) : ''}.</div>
                        </div>
                        <span className="tag">{monument.material}</span>
                        <div className="details">
                            <Button variant="link" onClick={() => this.setState({open: !this.state.open})}>
                                {this.state.open ? 'Hide details' : 'More details'}
                            </Button>
                            <Collapse in={this.state.open}>
                                <div>
                                    <div>
                                        <span className="detail-label">Contributors:&nbsp;</span>
                                        {monument.submittedBy}
                                    </div>
                                    <div>
                                        <span className="detail-label">Last Updated:&nbsp;</span>
                                        {prettyPrintDate(monument.updatedDate)}
                                    </div>
                                </div>
                            </Collapse>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    renderVisitCard() {
        const monument = this.state.monument;

        return (
            <div className="visit">
                <Card>
                    <Card.Title>
                        Visit
                    </Card.Title>
                    <Card.Body>
                        {this.renderAddress()}
                        <div className="map">
                            <iframe title="gmaps-iframe"
                                    src={`https://maps.google.com/maps?q=${monument.address ? monument.address : monument.coordinatePointAsString}&z=16&output=embed`}
                                    frameBorder="0"/>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    renderAddress() {
        const monument = this.state.monument;
        if (monument.address) {
            return (
                <div>
                    <i className="fa fas fa-map-marker-alt text-primary"></i> {monument.address}
                </div>
            )
        } else return (<div/>);
    }

    // TODO: Make this pretty
    renderError() {
        const error = this.state.error;
        return (
            <div className="page-container">
                <span>An error occurred: "{error.message}"</span>
            </div>
        )
    }
}