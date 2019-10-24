import React from 'react';
import './Monument.scss';
import { Redirect } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import * as slugify from 'slugify';
import * as moment from 'moment';
import { Helmet } from 'react-helmet';
import Gallery from '../Gallery/Gallery';
import Tags from '../Tags/Tags';
import request from '../../utils/request';

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
        console.log(this.props);
        const { match: { params: { monumentId } } } = this.props;

        let error;
        const results = await Promise.all([
            request(`/api/monument/${monumentId}`),
            request(`/api/contributions/?monumentId=${monumentId}`),
            request(`/api/images/?monumentId=${monumentId}`),
            request(`/api/references/?monumentId=${monumentId}`),
            request(`/api/tags/?monumentId=${monumentId}`)
        ]).catch(err => error = err);

        if (error) {
            console.error(error);
            this.setState({error: error});
            return;
        }

        const [monument, contributions, images, references, tags] = results;
        // TODO: Replace these images with the images array above
        this.setState({monument, contributions, images: [
                {id: 1, url: 'https://lh5.googleusercontent.com/p/AF1QipOvJE2czQBHI9rmkIXNqM8AKA6kZSxV8DpAN1Xr=s1016-k-no'},
                {id: 2, url: 'https://lh5.googleusercontent.com/p/AF1QipOwnKkvd1BHSv_I8FetfXLT7q01w1n6e3xPmzbn=w203-h270-k-no'},
                {id: 3, url: 'https://lh5.googleusercontent.com/p/AF1QipOvJE2czQBHI9rmkIXNqM8AKA6kZSxV8DpAN1Xr=s1016-k-no'},
                {id: 4, url: 'https://lh5.googleusercontent.com/p/AF1QipOwnKkvd1BHSv_I8FetfXLT7q01w1n6e3xPmzbn=w203-h270-k-no'},
                {id: 5, url: 'https://lh5.googleusercontent.com/p/AF1QipOvJE2czQBHI9rmkIXNqM8AKA6kZSxV8DpAN1Xr=s1016-k-no'},
                {id: 6, url: 'https://lh5.googleusercontent.com/p/AF1QipOwnKkvd1BHSv_I8FetfXLT7q01w1n6e3xPmzbn=w203-h270-k-no'}
            ], references, tags});
        this.setState({monument, contributions, images, references, tags});
        console.log(this.state);
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

    prettyPrintDate(date) {
        if (!date) return;
        date = moment(new Date(date));
        // Wednesday, October 16th, 2019 format
        return date.format('dddd, MMMM Do, YYYY');
    };

    render() {
        if (this.state.error) return this.renderError();

        const title = this.state.monument.title;

        return (
            <div className="page-container">
                <Helmet title={title + ' | Monuments and Memorials'}/>
                {this.redirectToSlug()}
                <div className="column related-monuments-column">
                    {this.renderSuggestChanges()}
                    {this.renderNearbyMonuments()}
                    {this.renderRelatedMonuments()}
                </div>
                <div className="column main-column">
                    {this.renderMain()}
                    <Gallery images={this.state.images}/>
                    {this.renderAbout()}
                </div>
                <div className="column visit-column">
                    {this.renderVisit()}
                </div>
            </div>
        )
    }

    renderMain() {
        const { monument, tags } = this.state;

        return (
            <div className="main">
                <div>
                    <div className="h5">
                        {monument.title}
                    </div>
                    <div>
                        <div className="fields">
                            <div className="field font-italic">{this.renderAddress()}</div>
                            <div className="field">{monument.description}</div>
                        </div>
                        <Tags tags={tags}/>
                    </div>
                </div>
            </div>
        )
    }

    renderSuggestChanges() {
        return (
            <Card>
                <Card.Title>
                    Suggest a Change
                </Card.Title>
                <Card.Body>
                    <p>We pride ourselves on keeping up to date and accurate information.</p>
                    <p>If you think something on this page is incorrect or outdated, please suggest a change. If your change is approved we'll send you an email to let you know, and you will be listed as a contributor on this page!</p>
                    <Button variant="primary">SUGGEST A CHANGE</Button>
                </Card.Body>
            </Card>
        )
    }

    renderVisit() {
        const monument = this.state.monument;

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

    renderAddress() {
        const monument = this.state.monument;
        if (monument.address) {
            return (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <i className="material-icons">room</i> {monument.address}
                </div>
            )
        } else return (
            <div>{[monument.city, monument.state].filter(str => str && str.trim()).join(', ')}</div>
        );
    }

    renderAbout() {
        const { monument, contributions, references } = this.state;

        let lastUpdated = (
            <div>
                <span className="detail-label">Last Updated:&nbsp;</span>
                {this.prettyPrintDate(monument.updatedDate)}
            </div>
        );

        let contributorsList;
        if (contributions && contributions.length) {
            contributorsList = (
                <div>
                    <span className="detail-label">Contributors:&nbsp;</span>
                    <ul>
                        {contributions.map(contribution => <li key={contribution.submittedBy}>{contribution.submittedBy}</li>)}
                    </ul>
                </div>
            )
        }

        let referencesList;
        if (references && references.length) {
            referencesList = (
                <div>
                    <span className="detail-label">References:&nbsp;</span>
                    <ul>
                        {references.map(reference => <li key={reference.url}><a className="text-break" href={reference.url}>{reference.url}</a></li>)}
                    </ul>
                </div>
            )
        }

        return (
            <Card>
                <Card.Title>About</Card.Title>
                <Card.Body>
                    <div className="detail-list">
                        {lastUpdated}
                        {contributorsList}
                        {referencesList}
                    </div>
                </Card.Body>
            </Card>
        )
    }

    renderNearbyMonuments() {
        return (
            <div className="nearby">
                <div className="h6">
                    Nearby Monuments or Memorials
                </div>
            </div>
        )
    }

    renderRelatedMonuments() {
        return (
            <div className="related">
                <div className="h6">
                    Related Monuments or Memorials
                </div>
            </div>
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