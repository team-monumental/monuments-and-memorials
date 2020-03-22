import * as React from 'react';
import { Card } from 'react-bootstrap';
import { prettyPrintDate, prettyPrintMonth } from '../../../../utils/string-util';

export default class CreateMonumentSuggestion extends React.Component {

    renderSuggestionDetails() {
        const { suggestion } = this.props;

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

        return (<>
            <span className="font-weight-bold">Artist: </span> {artist}
            <span className="font-weight-bold">Date: </span> {date}
            <span className="font-weight-bold">Address: </span> {address}
            <span className="font-weight-bold">City: </span> {city}
            <span className="font-weight-bold">State: </span> {state}
            <span className="font-weight-bold">Latitude: </span> {latitude}
            <span className="font-weight-bold">Longitude: </span> {longitude}
            <span className="font-weight-bold">Description: </span> {description}
            <span className="font-weight-bold">Inscription: </span> {inscription}
        </>);
    }

    render() {
        const { suggestion } = this.props;

        return (
            <Card>
                <Card.Header>
                    <Card.Title>{suggestion.title}</Card.Title>
                </Card.Header>
                <Card.Body>
                    {this.renderSuggestionDetails()}
                </Card.Body>
            </Card>
        );
    }
}