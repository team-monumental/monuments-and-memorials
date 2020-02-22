import React from 'react';
import './StatisticCard.scss';
import Card from 'react-bootstrap/Card';

/**
 * Presentational component for a Card that displays a statistic
 */
export default class StatisticCard extends React.Component {

    render() {
        const { statistic, description, statisticFontSize, link } = this.props;

        let statisticFontSizeClassName = 'large';

        if (statisticFontSize === 'small') {
            statisticFontSizeClassName = 'small';
        }

        let statisticWithLink;
        if (link) {
            statisticWithLink = (
                <a href={link}>
                    {statistic}
                </a>
            );
        }

        if (statistic && description) {
            return (
                <div className="statistic-card-container">
                    <Card>
                        <Card.Header>
                            <Card.Title className={statisticFontSizeClassName}>
                                {statisticWithLink ? statisticWithLink : statistic}
                            </Card.Title>
                        </Card.Header>
                        <Card.Footer>
                            {description}
                        </Card.Footer>
                    </Card>
                </div>
            );
        }
        else {
            return (
                <div/>
            );
        }
    }
}