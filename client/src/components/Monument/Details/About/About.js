import React from 'react';
import { Card } from 'react-bootstrap';
import { getUserFullName, prettyPrintDate } from '../../../../utils/string-util';
import moment from 'moment';
import ExportToCsvButton from '../../../Export/ExportToCsvButton/ExportToCsvButton';

/**
 * Renders meta-info about a Monument, such as when it was last updated,
 * who has contributed to it, and the references used
 */
export default class About extends React.Component {

    csvExportFields = ['Title', 'Artist', 'Date', 'City', 'State', 'Address', 'Coordinates', 'Materials', 'Tags',
        'Description', 'Inscription', 'Contributors', 'References', 'Last Updated'];

    buildCsvExportData() {
        const { monument, contributions, references } = this.props;

        let materialsList = '';
        let tagsList = '';
        if (monument.monumentTags && monument.monumentTags.length) {
            materialsList = monument.monumentTags.filter(monumentTag => monumentTag.tag.isMaterial)
                .map(monumentTag => monumentTag.tag.name).join(',');
            tagsList = monument.monumentTags.filter(monumentTag => !monumentTag.tag.isMaterial)
                .map(monumentTag => monumentTag.tag.name).join(',');
        }

        const prepareArray = (array=[], field) => {
            return array.map(el => el[field]).join(',');
        };

        const contributionsList = prepareArray(contributions, 'submittedBy');
        const referencesList = prepareArray(references, 'url');

        return [{
            'Title': monument.title,
            'Artist': monument.artist || '',
            'Date': monument.date ? prettyPrintDate(monument.date) : '',
            'City': monument.city || '',
            'State': monument.state || '',
            'Address': monument.address || '',
            'Coordinates': monument.coordinates ?
                `${monument.coordinates.coordinates[1]}, ${monument.coordinates.coordinates[0]}` :
                '',
            'Materials' : materialsList,
            'Tags': tagsList,
            'Description': monument.description || '',
            'Inscription': monument.inscription || '',
            'Contributors': contributionsList,
            'References': referencesList,
            'Last Updated': monument.updatedDate ? prettyPrintDate(monument.updatedDate) : ''
        }];
    }

    render() {
        const { monument, contributions, references, header, showHiddenFields, hideExportToCSV, hideTitle } = this.props;

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
                        {city}
                        {state}
                        {address}
                        {coordinates}
                        {materialsList}
                        {tagsList}
                        {contributorsList}
                        {referencesList}
                        {lastUpdated}
                        {isActive}
                    </div>
                    <div className="d-flex">
                        {!hideExportToCSV &&
                            <ExportToCsvButton className="mt-2" fields={this.csvExportFields}
                                               data={this.buildCsvExportData()}
                                               exportTitle={`${monument.title} Data ${moment().format('YYYY-MM-DD hh:mm')}`}/>
                        }
                    </div>
                </Card.Body>
            </Card>
        )
    }
}