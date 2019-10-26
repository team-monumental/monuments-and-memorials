import React from 'react';
import { Card } from 'react-bootstrap';
import * as moment from 'moment';

export default class About extends React.Component {

    render() {

        const { monument, contributions, references } = this.props;

        let lastUpdated = (
            <div>
                <span className="detail-label">Last Updated:&nbsp;</span>
                {this.prettyPrintDate(monument.updatedDate)}
            </div>
        );

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
                <Card.Title>About</Card.Title>
                <Card.Body>
                    <div className="detail-list">
                        {lastUpdated}
                        {contributorsList}
                        {referencesList}
                    </div>
                </Card.Body>
            </Card>
        )
    }

    prettyPrintDate(date) {
        if (!date) return;
        date = moment(new Date(date));
        // Wednesday, October 16th, 2019 format
        return date.format('dddd, MMMM Do, YYYY');
    };
}