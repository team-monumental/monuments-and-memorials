import React from 'react';
import { Card } from 'react-bootstrap';
import {DateFormat, getUserFullName, prettyPrintDate} from '../../../../utils/string-util';
import ExportButtons from '../../../Export/ExportButtons/ExportButtons';

/**
 * Renders meta-info about a Monument, such as when it was last updated,
 * who has contributed to it, and the references used
 */
export default class About extends React.Component {

    render() {
        const { monument, contributions, references, header, showHiddenFields, hideExport, hideTitle, images } = this.props;
        let title;
        if (!hideTitle && monument.title) {
            title = (
                <div>
                    <span className="detail-label">Title:&nbsp;</span>
                    {monument.title}
                </div>
            );
        }

        let artist;
        if (monument.artist == null) {
            artist = (
                <div>
                    <span className="detail-label">Artist:&nbsp;</span>
                    {String("Not Provided")}
                </div>
            );
        }
        else if (monument.artist) {
            artist = (
                <div>
                    <span className="detail-label">Artist:&nbsp;</span>
                    {monument.artist}
                </div>
            );
        }

        let date;
        if (monument.dateFormat === DateFormat.UNKNOWN){
            date = (
                <div>
                    <span className="detail-label">Date:&nbsp;</span>
                    {String("Date of creation is Unknown")}
                </div>
            );
        }
        else if (monument.date == null) {
            date = (
                <div>
                    <span className="detail-label">Date:&nbsp;</span>
                    {String("Not Provided")}
                </div>
            );
        }
        else if (monument.date) {
            date = (
                <div>
                    <span className="detail-label">Date:&nbsp;</span>
                    {prettyPrintDate(monument.date, monument.dateFormat)}
                </div>
            );
        }

        let deactivatedDate;
        if (monument.deactivatedDateFormat === DateFormat.UNKNOWN) {
            deactivatedDate = (
                <div>
                    <span className="detail-label">Un-installed Date:&nbsp;</span>
                    {String("Date of deactivation is Unknown")}
                </div>
            )
        }
        else if (monument.deactivatedDate) {
            deactivatedDate = (
                <div>
                    <span className="detail-label">Un-installed Date:&nbsp;</span>
                    {prettyPrintDate(monument.deactivatedDate, monument.deactivatedDateFormat)}
                </div>
            );
        }

        let deactivatedComment;
        if (monument.deactivatedComment) {
            deactivatedComment = (
                <div>
                    <span className="detail-label">Un-installed Reason:&nbsp;</span>
                    {monument.deactivatedComment}
                </div>
            );
        }

        let city;
        if (monument.city) {
            city = (
                <div>
                    <span className="detail-label">City:&nbsp;</span>
                    {monument.city}
                </div>
            );
        }

        let state;
        if (monument.state) {
            state = (
                <div>
                    <span className="detail-label">State:&nbsp;</span>
                    {monument.state}
                </div>
            );
        }

        let address;
        if (monument.address) {
            address = (
                <div>
                    <span className="detail-label">Address:&nbsp;</span>
                    {monument.address}
                </div>
            )
        }

        let coordinates;
        if (monument.coordinates) {
            coordinates = (
                <div>
                    <span className="detail-label">Coordinates:&nbsp;</span>
                    {monument.coordinates.coordinates[1]}, {monument.coordinates.coordinates[0]}
                </div>
            );
        }

        let tagsList;
        if (monument.monumentTags && monument.monumentTags.length) {
            tagsList = (
                <div>
                    <span className="detail-label">Tags:&nbsp;</span>
                    <ul>
                        {monument.monumentTags.map(tag => <li key={tag.tag.id}>{tag.tag.name}</li>)}
                    </ul>
                </div>
            );
        }

        let lastUpdated;
        if (monument.updatedDate) {
            lastUpdated = (
                <div>
                    <span className="detail-label">Last Updated:&nbsp;</span>
                    {prettyPrintDate(monument.updatedDate)}
                </div>
            );
        }

        let contributorsList;
        if (contributions && contributions.length) {
            let contributors = contributions.map(contribution => {
                if (contribution.submittedByUser) {
                    contribution.submittedBy = getUserFullName(contribution.submittedByUser);
                }
                return contribution.submittedBy;
            });
            // Remove any duplicates
            contributors = contributors.filter((contributor, index) => contributors.indexOf(contributor) === index);
            contributorsList = (
                <div>
                    <span className="detail-label">Contributors:&nbsp;</span>
                    <ul>
                        {contributors.map(contributor => (<li key={contributor}>{contributor}</li>))}
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
                        {references.map(reference => <li key={reference.id}><a className="text-break" href={reference.url}>{reference.url}</a></li>)}
                    </ul>
                </div>
            )
        }

        let isActive;
        if (showHiddenFields) {
            isActive = (
                <div>
                    <span className="detail-label">Is Active:&nbsp;</span>
                    {monument.isActive ? 'Yes' : 'No'}
                </div>
            )
        }

        return (
            <Card className="mt-4">
                <Card.Header>
                    <Card.Title>{header || 'About'}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="detail-list">
                        {title}
                        {artist}
                        {date}
                        {deactivatedDate}
                        {deactivatedComment}
                        {city}
                        {state}
                        {address}
                        {coordinates}
                        {tagsList}
                        {contributorsList}
                        {referencesList}
                        {lastUpdated}
                        {isActive}
                    </div>
                    <div className="d-flex">
                        {!hideExport &&
                            <span>
                                <ExportButtons className="mt-2"
                                               monuments={[monument]}
                                               title={monument.title}
                                               images={images}/>
                            </span>
                        }
                    </div>
                </Card.Body>
            </Card>
        )
    }
}
