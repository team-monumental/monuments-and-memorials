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

    combineJsonListStrings(string1, string2) {
        if (!string1.replace('[', '').replace(']', '').length) {
            return string2;
        }

        if (!string2.replace('[', '').replace(']','').length) {
            return string1;
        }

        return string1.replace(']', ',') + string2.replace('[', '');
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

        stringList = stringList.filter(string => string.length);

        if (stringList.length) {
            return (
                <ul className="mb-0">
                    {stringList.map(string => <li key={string}>{string}</li>)}
                </ul>
            );
        }

        return 'None';
    }

    renderTags(areMaterials) {
        const { suggestion } = this.props;

        let combinedJsonString;
        if (areMaterials) {
            combinedJsonString = this.combineJsonListStrings(suggestion.materialsJson, suggestion.newMaterialsJson);
        }
        else {
            combinedJsonString = this.combineJsonListStrings(suggestion.tagsJson, suggestion.newTagsJson);
        }

        return this.renderJsonStringList(combinedJsonString);
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
            <div><strong>Artist:</strong> {artist}</div>
            <div><strong>Date:</strong> {date}</div>
            <div><strong>Address:</strong> {address}</div>
            <Collapse in={expanded}>
                <div>
                    <div><strong>City:</strong> {city}</div>
                    <div><strong>State:</strong> {state}</div>
                    <div><strong>Latitude:</strong> {latitude}</div>
                    <div><strong>Longitude:</strong> {longitude}</div>
                    <div><strong>Description:</strong> {description}</div>
                    <div><strong>Inscription:</strong> {inscription}</div>
                    <div className="font-weight-bold">Contributors: </div> {this.renderJsonStringList(suggestion.contributionsJson)}
                    <div className="font-weight-bold">References: </div> {this.renderJsonStringList(suggestion.referencesJson)}
                    <div className="font-weight-bold">Materials: </div> {this.renderTags(true)}
                    <div className="font-weight-bold">Tags: </div> {this.renderTags(false)}
                    <div className="font-weight-bold">Images: </div>
                    {imageUrls.length > 0 && <>
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
                <Card.Header className="pt-0">
                    <Card.Title>{`${index}. ${suggestion.title}`}</Card.Title>
                </Card.Header>
                <Card.Body className="pt-1 pb-1">
                    {this.renderSuggestionDetails()}
                </Card.Body>
            </Card>
        );
    }
}