import React from 'react';
import { Card } from 'react-bootstrap';
import { prettyPrintDate } from '../../../../utils/string-util';
import moment from 'moment';
import ExportToCsvButton from '../../../Export/ExportToCsvButton/ExportToCsvButton';

/**
 * Renders meta-info about a Monument, such as when it was last updated,
 * who has contributed to it, and the references used
 */
export default class About extends React.Component {

    buildCsvExportFields() {
        return ['Title', 'Artist', 'Date', 'City', 'State', 'Address', 'Coordinates', 'Materials', 'Tags',
            'Description', 'Inscription', 'Contributors', 'References', 'Last Updated'];
    }

    buildCsvExportData() {
        const { monument, contributions, references } = this.props;

        let materialsList = '';
        let tagsList = '';
        if (monument.monumentTags && monument.monumentTags.length) {
            const materialNames = [];
            const tagNames = [];
            for (const monumentTag of monument.monumentTags) {
                if (monumentTag.tag.isMaterial) {
                    materialNames.push(monumentTag.tag.name);
                }
                else {
                    tagNames.push(monumentTag.tag.name);
                }
            }
            materialsList = materialNames.join(',');
            tagsList = tagNames.join(',');
        }

        let contributionsList = '';
        if (contributions && contributions.length) {
            const contributors = contributions.map(contribution => contribution.submittedBy);
            contributionsList = contributors.join(',');
        }

        let referencesList = '';
        if (references && references.length) {
            const referenceUrls = references.map(reference => reference.url);
            referencesList = referenceUrls.join(',');
        }

        return [{
            'Title': monument.title,
            'Artist': monument.artist ? monument.artist : '',
            'Date': monument.date ? prettyPrintDate(monument.date) : '',
            'City': monument.city ? monument.city : '',
            'State': monument.state ? monument.state : '',
            'Address': monument.address ? monument.address : '',
            'Coordinates': monument.coordinates ?
                `${monument.coordinates.coordinates[1]}, ${monument.coordinates.coordinates[0]}` :
                '',
            'Materials' : materialsList,
            'Tags': tagsList,
            'Description': monument.description ? monument.description : '',
            'Inscription': monument.inscription ? monument.inscription : '',
            'Contributors': contributionsList,
            'References': referencesList,
            'Last Updated': monument.updatedDate ? prettyPrintDate(monument.updatedDate) : ''
        }];
    }

    render() {

        const { monument, contributions, references } = this.props;

        let title;
        if (monument.title) {
            title = (
                <div>
                    <span className="detail-label">Title:&nbsp;</span>
                    {monument.title}
                </div>
            );
        }

        let artist;
        if (monument.artist) {
            artist = (
                <div>
                    <span className="detail-label">Artist:&nbsp;</span>
                    {monument.artist}
                </div>
            );
        }

        let date;
        if (monument.date) {
            date = (
                <div>
                    <span className="detail-label">Date:&nbsp;</span>
                    {prettyPrintDate(monument.date)}
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

        let materialsList;
        if (monument.materials && monument.materials.length) {
            materialsList = (
                <div>
                    <span className="detail-label">Materials:&nbsp;</span>
                    <ul>
                        {monument.materials.map(material => <li key={material.id}>{material.name}</li>)}
                    </ul>
                </div>
            );
        }

        let tagsList;
        if (monument.tags && monument.tags.length) {
            tagsList = (
                <div>
                    <span className="detail-label">Tags:&nbsp;</span>
                    <ul>
                        {monument.tags.map(tag => <li key={tag.id}>{tag.name}</li>)}
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
            contributorsList = (
                <div>
                    <span className="detail-label">Contributors:&nbsp;</span>
                    <ul>
                        {contributions.map(contribution => <li key={contribution.id}>{contribution.submittedBy}</li>)}
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

        return (
            <Card className="mt-4">
                <Card.Header>
                    <Card.Title>About</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="detail-list">
                        {title}
                        {artist}
                        {date}
                        {city}
                        {state}
                        {address}
                        {coordinates}
                        {materialsList}
                        {tagsList}
                        {contributorsList}
                        {referencesList}
                        {lastUpdated}
                    </div>
                    <ExportToCsvButton className="mt-2" fields={this.buildCsvExportFields()} data={this.buildCsvExportData()}
                                       exportTitle={`${monument.title} Data ${moment().format('YYYY-MM-DD hh:mm')}`}/>
                </Card.Body>
            </Card>
        )
    }
}