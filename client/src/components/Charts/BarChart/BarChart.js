import React from 'react';
import './BarChart.scss';
import Chart from 'chart.js';

Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontStyle = 'bold';

/**
 * Reusable presentational component that wraps around Chart.js Bar charts
 */
export default class BarChart extends React.Component {
    chartRef = React.createRef();

    componentDidMount() {
        const { data, options } = this.props;
        const myChartRef = this.chartRef.current.getContext('2d');

        new Chart(myChartRef, {
            type: 'bar',
            data: data,
            options: options
        });
    }

    render() {
        return (
            <div className="bar-chart-container">
                <canvas
                    id="bar-chart"
                    ref={this.chartRef}
                />
            </div>
        );
    }
}