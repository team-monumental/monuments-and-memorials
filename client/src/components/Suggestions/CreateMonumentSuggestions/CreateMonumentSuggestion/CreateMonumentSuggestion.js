import * as React from 'react';
import './CreateMonumentSuggestion.scss';
import { Card, Collapse } from 'react-bootstrap';
import { prettyPrintDate, prettyPrintMonth } from '../../../../utils/string-util';
import Gallery from '../../../Monument/Gallery/Gallery';

export default class CreateMonumentSuggestion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    handleCollapseLinkClick() {
        const { expanded } = this.state;
        this.setState({expanded: !expanded});
    }

    renderJsonStringList(json) {
        let stringList = [];
        if (json) {
            stringList = JSON.parse(json);
        }

        if (stringList.length) {
            return (
                <ul>
                    {stringList.map(string => <li key={string}>{string}</li>)}
                </ul>
            );
        }

        return 'None';
    }

    renderSuggestionDetails() {
        const { suggestion } = this.props;
        const { expanded } = this.state;

        const artist = (suggestion.artist && suggestion.artist.length) ? suggestion.artist : 'None';
        const address = (suggestion.address && suggestion.address.length) ? suggestion.address : 'None';
        const city = (suggestion.city && suggestion.city.length) ? suggestion.city : 'None';
        const state = (suggestion.state && suggestion.state.length) ? suggestion.state : 'None';
        const latitude = suggestion.latitude ? suggestion.latitude : 'None';
        const longitude = suggestion.longitude ? suggestion.longitude : 'None';
        const description = (suggestion.description && suggestion.description.length) ? suggestion.description : 'None';
        const inscription = (suggestion.inscription && suggestion.inscription.length) ? suggestion.inscription : 'None';

        let date = 'None';
        if (suggestion.date && suggestion.date.length) {
            date = prettyPrintDate(new Date(suggestion.date));
        }
        else if (suggestion.month && suggestion.month.length) {
            date = `${prettyPrintMonth(suggestion.month)}, ${suggestion.year}`;
        }
        else if (suggestion.year && suggestion.year.length) {
            date = suggestion.year;
        }

        let imageUrls = [];
        if (suggestion.imagesJson) {
            imageUrls = JSON.parse(suggestion.imagesJson);
        }

        const expandLink = (
            <div className="collapse-link" onClick={() => this.handleCollapseLinkClick()}>
                Show More
            </div>
        );

        const hideLink = (
            <div className="collapse-link" onClick={() => this.handleCollapseLinkClick()}>
                Show Less
            </div>
        );

        return (<>
            <span><strong>Artist:</strong> {artist}</span>&nbsp;
            <span><strong>Date:</strong> {date}</span>&nbsp;
            <span><strong>Address:</strong> {address}</span>&nbsp;
            <span><strong>City:</strong> {city}</span>&nbsp;
            <span><strong>State:</strong> {state}</span>&nbsp;
            <span><strong>Latitude:</strong> {latitude}</span>&nbsp;
            <span><strong>Longitude:</strong> {longitude}</span>&nbsp;
            <span><strong>Description:</strong> {description}</span>&nbsp;
            <span><strong>Inscription:</strong> {inscription}</span>&nbsp;
            <Collapse in={expanded}>
                <div>
                    <div className="font-weight-bold">Contributors: </div> {this.renderJsonStringList(suggestion.contributionsJson)}
                    <div className="font-weight-bold">References: </div> {this.renderJsonStringList(suggestion.referencesJson)}
                    <div className="font-weight-bold">Materials: </div> {this.renderJsonStringList(suggestion.materialsJson)}
                    {this.renderJsonStringList(suggestion.newMaterialsJson)}
                    <div className="font-weight-bold">Tags: </div> {this.renderJsonStringList(suggestion.tagsJson)}
                    {this.renderJsonStringList(suggestion.newTagsJson)}
                    <div className="font-weight-bold">Images: </div>
                    {imageUrls.length && <>
                        <Gallery images={imageUrls.map(imageUrl => {return {url: imageUrl}})}/>
                    </>}
                    {!imageUrls.length && <>
                        None
                    </>}
                </div>
            </Collapse>

            {!expanded && expandLink}
            {expanded && hideLink}
        </>);
    }

    render() {
        const { suggestion, index } = this.props;

        return (
            <Card className="create-suggestion">
                <Card.Header>
                    <Card.Title>{`${index}. ${suggestion.title}`}</Card.Title>
                </Card.Header>
                <Card.Body>
                    {this.renderSuggestionDetails()}
                </Card.Body>
            </Card>
        );
    }
}