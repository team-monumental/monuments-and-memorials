import React from 'react';
import './Monument.scss';
import { Redirect } from 'react-router-dom';
import { Button, Card, Collapse, Modal } from 'react-bootstrap';
import * as slugify from 'slugify';
import * as moment from 'moment';

export default class Monument extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            monument: {},
            contributions: [],
            images: [],
            tags: [],
            references: [],
            detailsOpen: false,
            modalOpen: false,
            modalImage: null
        };
    }

    async componentDidMount() {
        const { match: { params: { monumentId, slug } } } = this.props;

        let error;
        const [ monument, contributions, images, references, tags ] = await Promise.all([
            this.callEndpoint(`/api/monument/${monumentId}`),
            this.callEndpoint(`/api/contributions/?monumentId=${monumentId}`),
            this.callEndpoint(`/api/images/?monumentId=${monumentId}`),
            this.callEndpoint(`/api/references/?monumentId=${monumentId}`),
            this.callEndpoint(`/api/tags/?monumentId=${monumentId}`)
        ]).catch(err => error = err);

        if (error) {
            console.error(error);
            this.setState({error: error});
            return;
        }

        this.setState({monument, contributions, images, references, tags});
        console.log(this.state);
    }

    async callEndpoint(endpoint) {
        const response = await fetch(endpoint);
        const parsed = await response.json();
        if (parsed.errors) {
            throw(parsed.errors[0]);
        }
        return parsed;
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
            <div className="page-container">
                {this.redirectToSlug()}
                <div className="column related-monuments-column">
                    {this.renderRelatedMonumentsCard()}
                </div>
                <div className="column main-column">
                    {this.renderMainCard()}
                </div>
                <div className="column visit-column">
                    {this.renderVisitCard()}
                </div>
            </div>
        )
    }

    renderMainCard() {
        const { monument, contributions, references, images, tags } = this.state;

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
                            <div className="field">{monument.description}</div>
                        </div>
                        <div className="tags">
                            <span className="tag">{monument.material}</span>
                            {tags.map(tag => {
                                return (
                                    <span key={tag.name} className="tag">{tag.name}</span>
                                )
                            })}
                        </div>
                        {images && images.length > 0 ?
                            /* TODO: Move this to a separate component */
                            (<div className="image-container" onClick={() => this.setState({modalOpen: true, modalImage: images[0].url})}>
                                <div className="image-wrapper">
                                    <img src={images[0].url}/>
                                </div>
                                <div className="overlay">
                                    <div className="icon-wrapper">
                                        <i className="material-icons">
                                            open_in_new
                                        </i>
                                    </div>
                                </div>
                                <div onClick={e => e.stopPropagation()}>
                                    <Modal show={this.state.modalOpen} onHide={() => this.setState({modalOpen: false, modalImage: null})}>
                                        <Modal.Header closeButton/>
                                        <Modal.Body>
                                            <img src={this.state.modalImage}/>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </div>)
                        : <div/>}
                        <div className="details">
                            <Button variant="link" onClick={() => this.setState({detailsOpen: !this.state.detailsOpen})}>
                                {this.state.detailsOpen ? 'Hide details' : 'More details'}
                            </Button>
                            <Collapse in={this.state.detailsOpen}>
                                <div>
                                    <div>
                                        <span className="detail-label">Last Updated:&nbsp;</span>
                                        {prettyPrintDate(monument.updatedDate)}
                                    </div>
                                    <div>
                                        <span className="detail-label">Contributors:&nbsp;</span>
                                        <ul>
                                            {contributions.map(contribution => <li key={contribution.submittedBy}>{contribution.submittedBy}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="detail-label">References:&nbsp;</span>
                                        <ul>
                                            {references.map(reference => <li key={reference.url}><a href={reference.url}>{reference.url}</a></li>)}
                                        </ul>
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
                    <i className="material-icons">room</i> {monument.address}
                </div>
            )
        } else return (<div/>);
    }

    renderRelatedMonumentsCard() {
        return (
            <Card>
                <Card.Title>
                    Related Monuments
                </Card.Title>
                <Card.Body/>
            </Card>
        )
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