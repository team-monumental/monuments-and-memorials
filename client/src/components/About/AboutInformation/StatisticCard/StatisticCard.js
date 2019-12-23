import React from 'react';
import './StatisticCard.scss';
import Card from 'react-bootstrap/Card';

/**
 * Presentational component for a Card that displays a statistic
 */
export default class StatisticCard extends React.Component {

    render() {
        const { statistic, description } = this.props;

        if (statistic && description) {
            return (
                <Card>
                    <Card.Title>
                        {statistic}
                    </Card.Title>
                    <Card.Footer>
                        {description}
                    </Card.Footer>
                </Card>
            );
        }
        else {
            return (
                <div/>
            );
        }
    }
}