import * as React from 'react';
import './CreateMonumentSuggestion.scss';
import { Card, Collapse } from 'react-bootstrap';
import { getUserFullName, prettyPrintDate, prettyPrintMonth } from '../../../../utils/string-util';
import Thumbnails from '../../../Monument/Images/Thumbnails/Thumbnails';
import { Link } from 'react-router-dom';
import SuggestionStatus from '../../../AdminPanel/ManageSuggestions/ManageSuggestion/SuggestionStatus/SuggestionStatus';

/**
 * Presentational component for displaying a CreateMonumentSuggestion
 */
export default class CreateMonumentSuggestion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: props.expandedByDefault || false
        };
    }

    handleCollapseLinkClick() {
        const { expanded } = this.state;
        this.setState({expanded: !expanded});
    }

    renderStringArray(array) {
        if (!array) {
            return 'None';
        }

        array = array.filter(string => string && string.length);

        if (array.length) {
            return (
                <ul className="mb-0">
                    {array.map(string => <li key={string}>{string}</li>)}
                </ul>
            );
        }
        else {
            return 'None';
        }
    }

    renderTags(areMaterials) {
        const { suggestion } = this.props;

        let tagArray;
        if (areMaterials) {
            const materials = JSON.parse(suggestion.materialsJson);
            const newMaterials = JSON.parse(suggestion.newMaterialsJson);
            tagArray = materials.concat(newMaterials);
        }
        else {
            const tags = JSON.parse(suggestion.tagsJson);
            const newTags = JSON.parse(suggestion.newTagsJson);
            tagArray = tags.concat(newTags);
        }

        return this.renderStringArray(tagArray);
    }

    renderSuggestionDetails() {
        const { suggestion, showCollapse=true, showCollapseLinks=true, displayStatus, isFromBulk } = this.props;
        const { expanded } = this.state;

        const parse = (field, isString) => field && (!isString || field.length) ? field : 'None';

        const artist = parse(suggestion.artist, true);
        const address = parse(suggestion.address, true);
        const city = parse(suggestion.city, true);
        const state = parse(suggestion.state, true);
        const latitude = parse(suggestion.latitude);
        const longitude = parse(suggestion.longitude);
        const description = parse(suggestion.description, true);
        const inscription = parse(suggestion.inscription, true);

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
            {showCollapse && <>
                <Collapse in={expanded}>
                    <div>
                        <div><strong>City:</strong> {city}</div>
                        <div><strong>State:</strong> {state}</div>
                        <div><strong>Latitude:</strong> {latitude}</div>
                        <div><strong>Longitude:</strong> {longitude}</div>
                        <div><strong>Description:</strong> {description}</div>
                        <div><strong>Inscription:</strong> {inscription}</div>
                        <div className="font-weight-bold">Contributors: </div> {this.renderStringArray(JSON.parse(suggestion.contributionsJson))}
                        <div className="font-weight-bold">References: </div> {this.renderStringArray(JSON.parse(suggestion.referencesJson))}
                        <div className="font-weight-bold">Materials: </div> {this.renderTags(true)}
                        <div className="font-weight-bold">Tags: </div> {this.renderTags(false)}
                        <div className="font-weight-bold">Images: </div>
                        {imageUrls.length > 0 && <>
                            <Thumbnails imageUrls={imageUrls}/>
                        </>}
                        {!imageUrls.length && <>
                            None
                        </>}
                    </div>
                </Collapse>

                {!expanded && showCollapseLinks && expandLink}
                {expanded && showCollapseLinks && hideLink}
            </>}
            {displayStatus &&
                <SuggestionStatus isApproved={suggestion.isApproved} isRejected={suggestion.isRejected}
                                  isFromBulk={isFromBulk}/>
            }
        </>);
    }

    render() {
        const { suggestion, index, showTitleAsLink, showIndex=true, showCreatedBy } = this.props;

        const titleText = showIndex ?
            `${index}. ${suggestion.title}` :
            `Create new record: ${suggestion.title}`;

        const manageUserLink = (
            <Link to={`/panel/manage/users/user/${suggestion.createdBy.id}`} key={suggestion.createdBy.id}>
                {getUserFullName(suggestion.createdBy)}
            </Link>
        );

        return (
            <Card className="create-suggestion">
                <Card.Header className="pt-0">
                    <Card.Title>
                        {
                            showTitleAsLink ?
                                <Link to={`/panel/manage/suggestions/suggestion/${suggestion.id}?type=create`}>{titleText}</Link> :
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
                <Card.Body className="pt-1 pb-2">
                    {this.renderSuggestionDetails()}
                </Card.Body>
            </Card>
        );
    }
}