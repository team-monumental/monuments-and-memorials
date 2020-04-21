import * as React from 'react';
import './UpdateMonumentSuggestion.scss';
import { Card } from 'react-bootstrap';
import MonumentUpdate from '../../../Monument/Update/MonumentUpdate';
import { Link } from 'react-router-dom';
import { getUserFullName } from '../../../../utils/string-util';

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
            newLatitude: (suggestion.newLatitude || '').toString(),
            newLongitude: (suggestion.newLongitude || '').toString(),
            newMaterials: suggestion.newMaterialsJson && JSON.parse(suggestion.newMaterialsJson),
            newTags : suggestion.newTagsJson && JSON.parse(suggestion.newTagsJson),
            deletedReferenceIds: suggestion.deletedReferenceIdsJson && JSON.parse(suggestion.deletedReferenceIdsJson),
            updatedReferenceUrlsById: suggestion.updatedReferenceUrlsByIdJson && JSON.parse(suggestion.updatedReferenceUrlsByIdJson),
            newReferenceUrls: suggestion.newReferenceUrlsJson && JSON.parse(suggestion.newReferenceUrlsJson),
            addedImages: suggestion.newImageUrlsJson && JSON.parse(suggestion.newImageUrlsJson).map(url => ({url})),
            addedPhotoSphereImages: suggestion.newPhotoSphereImageUrlsJson && JSON.parse(suggestion.newPhotoSphereImageUrlsJson).map(url => ({url})),
            deletedImageUrls: suggestion.deletedImageUrlsJson && JSON.parse(suggestion.deletedImageUrlsJson),
            deletedPhotoSphereImageUrls: suggestion.deletedPhotoSphereImageUrlsJson && JSON.parse(suggestion.deletedPhotoSphereImageUrlsJson),
            displayDeletedImageNames: false
        };
    }

    render() {
        const { suggestion, index, showTitleAsLink, showIndex=true, expandedByDefault, showCollapseLinks,
            showCreatedBy } = this.props;

        let titleText;
        if (suggestion && suggestion.monument && suggestion.monument.title) {
            titleText = showIndex ?
                `${index}. ${suggestion.monument.title}` :
                `Update to record: ${suggestion.monument.title}`;
        }

        const manageUserLink = (
            <Link to={`/panel/manage/users/user/${suggestion.createdBy.id}`}>
                {getUserFullName(suggestion.createdBy)}
            </Link>
        );

        return (
            <Card className="update-suggestion">
                <Card.Header className="pt-0">
                    <Card.Title>
                        {
                            showTitleAsLink ?
                                <Link to={`/panel/manage/suggestions/suggestion/${suggestion.id}?type=update`}>{titleText}</Link> :
                                titleText
                        }
                        {showCreatedBy &&
                            <div className="created-by-container">
                                Created By:&nbsp;
                                {manageUserLink} (<a href={`mailto:${suggestion.createdBy.email}`}>{suggestion.createdBy.email}</a>)
                            </div>
                        }
                    </Card.Title>
                </Card.Header>
                <Card.Body className="pt-1 pb-1">
                    <MonumentUpdate oldMonument={suggestion.monument} update={this.buildUpdate()}
                                    showUnchangedAttributes={false} showAllChangedAttributes={false}
                                    expandedByDefault={expandedByDefault} showCollapseLinks={showCollapseLinks}
                    />
                </Card.Body>
            </Card>
        );
    }
}