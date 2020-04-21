import React from 'react';
import './NumberOfMonumentsByStateBarChart.scss';
import BarChart from '../../../Charts/BarChart/BarChart';

/**
 * Presentational component for the Number of Monuments by State Bar Chart shown on the About Page
 */
export default class NumberOfMonumentsByStateBarChart extends React.Component {

    /**
     * Builds the data Object used to populate the BarChart Component
     * Returns null if numberOfMonumentsByState is null
     */
    buildChartData() {
        const { numberOfMonumentsByState } = this.props;

        if (!numberOfMonumentsByState) {
            return null;
        }

        const dataLabels = [];
        const dataValues = [];

        for (const stateName in numberOfMonumentsByState) {
            if (numberOfMonumentsByState.hasOwnProperty(stateName)) {
                dataLabels.push(stateName);
                dataValues.push(numberOfMonumentsByState[stateName]);
            }
        }

        return {
            labels: dataLabels,
            datasets: [
                {
                    label: 'Number of Monuments',
                    data: dataValues,
                    backgroundColor: 'rgba(66, 184, 131, 1)',
                    hoverBackgroundColor: 'rgba(66, 220, 131, 1)'
                }
            ]
        };
    }

    render() {
        const { numberOfMonumentsByState } = this.props;

        const chartData = this.buildChartData();
        const chartOptions = {
            legend: {
                display: false
            }
        };

        const chartDisplay = (
            <div className="monuments-by-state-bar-chart-container">
                <BarChart
                    data={chartData}
                    options={chartOptions}
                />
            </div>
        );

        return (
            <div>
                {numberOfMonumentsByState && chartDisplay}
            </div>
        );
    }
}