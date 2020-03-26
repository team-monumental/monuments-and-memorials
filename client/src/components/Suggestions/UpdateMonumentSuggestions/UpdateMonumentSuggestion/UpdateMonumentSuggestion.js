import * as React from 'react';
import { Card } from 'react-bootstrap';
import AttributeChange from '../../../Monument/Update/AttributeChange/AttributeChange';
import { didAttributeChange } from '../../../../utils/update-util';

export default class UpdateMonumentSuggestion extends React.Component {

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

    renderSuggestionDetails() {
        const { suggestion, oldMonument } = this.props;
        const { expanded } = this.state;

        if (suggestion && oldMonument) {
            let changedAttributes = [];

            if (didAttributeChange(oldMonument.title, suggestion.newTitle)) {
                changedAttributes.push(<AttributeChange attributeLabel="Title" oldAttribute={oldMonument.title} newAttribute={suggestion.newTitle}/>);
            }
            if (didAttributeChange(oldMonument.artist, suggestion.newArtist)) {
                changedAttributes.push(<AttributeChange attributeLabel="Artist" oldAttribute={oldMonument.artist} newAttribute={suggestion.newArtist}/>);
            }
            if (didAttributeChange(oldMonument.artist, suggestion.newArtist)) {
                changedAttributes.push(<AttributeChange attributeLabel="Artist" oldAttribute={oldMonument.artist} newAttribute={suggestion.newArtist}/>);
            }
        }
    }

    render() {
        const { suggestion, oldMonument, index } = this.props;

        return (
            <Card className="update-suggestion">
                <Card.Header className="pt-0">
                    <Card.Title>
                        {`${index}. ${oldMonument.title}`}
                    </Card.Title>
                </Card.Header>
                <Card.Body className="pt-1 pb-1">
                    {this.renderSuggestionDetails()}
                </Card.Body>
            </Card>
        );
    }
}