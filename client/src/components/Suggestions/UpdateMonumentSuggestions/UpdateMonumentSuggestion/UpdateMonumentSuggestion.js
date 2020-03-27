import * as React from 'react';
import { Card } from 'react-bootstrap';
import MonumentUpdate from '../../../Monument/Update/MonumentUpdate';

export default class UpdateMonumentSuggestion extends React.Component {

    determineDateTypeForUpdate() {
        const { suggestion } = this.props;

        if (suggestion.newDate) {
            return 'exact-date';
        }

        if (suggestion.newMonth) {
            return 'month-year';
        }

        return 'year';
    }

    buildUpdate() {
        const { suggestion } = this.props;

        return {
            ...suggestion,
            date: {
                type: this.determineDateTypeForUpdate(),
                newYear: suggestion.newYear,
                newMonth: suggestion.newMonth,
                newDate: suggestion.newDate
            },
            newMaterials: JSON.parse(suggestion.newMaterialsJson),
            newTags : JSON.parse(suggestion.newTagsJson),
            deletedReferenceIds: JSON.parse(suggestion.deletedReferenceIdsJson),
            updatedReferenceUrlsById: JSON.parse(suggestion.updatedReferenceUrlsByIdJson),
            newReferenceUrls: JSON.parse(suggestion.newReferenceUrlsJson),
            addedImages: JSON.parse(suggestion.newImageUrlsJson),
            deletedImageIds: JSON.parse(suggestion.deletedImageIds)
        };
    }

    render() {
        const { oldMonument, index } = this.props;

        return (
            <Card className="update-suggestion">
                <Card.Header className="pt-0">
                    <Card.Title>
                        {`${index}. ${oldMonument.title}`}
                    </Card.Title>
                </Card.Header>
                <Card.Body className="pt-1 pb-1">
                    <MonumentUpdate oldMonument={oldMonument} update={this.buildUpdate()}/>
                </Card.Body>
            </Card>
        );
    }
}