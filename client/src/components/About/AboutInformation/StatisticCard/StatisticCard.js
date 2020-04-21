import React from 'react';
import './StatisticCard.scss';

/**
 * Presentational component for a Card that displays a statistic
 */
export default class StatisticCard extends React.Component {

    render() {
        const { statistic, description, statisticFontSize, link, iconName } = this.props;

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
                <div className="stat">
                    <div className="icon-container">
                        <i className="material-icons">{iconName}</i>
                    </div>
                    <div className="stat-body">
                        <div className={`stat-title ${statisticFontSizeClassName}`}>
                            {statisticWithLink ? statisticWithLink : statistic}
                        </div>
                        <div className="stat-description">
                            {description}
                        </div>
                    </div>
                </div>
            );
        }
        return (<></>);
    }
}