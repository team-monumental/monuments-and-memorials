import * as React from 'react';
import { Card } from 'react-bootstrap';

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


    }

    render() {
        const { suggestion, oldMonument, index } = this.props;

        return (
            <Card className="update-suggestion">
                <Card.Header className="pt-0">
                    <Card.Title>
                        {`${index}. ${oldMonument.title}`}
                        <i className="material-icons">arrow_right_alt</i>
                        {suggestion.newTitle}
                    </Card.Title>
                </Card.Header>
                <Card.Body className="pt-1 pb-1">
                    {this.renderSuggestionDetails()}
                </Card.Body>
            </Card>
        );
    }
}