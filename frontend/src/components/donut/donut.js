import { Component } from 'react';
import Chart from 'react-apexcharts';

export default class Donut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [30,30,60],
            options: {
            labels: ['Clear Grouping', 'Split Up', 'Density Change'],
            chart: {
                width: 380,
                type: 'donut',
            },
            plotOptions: {
                pie: {
                startAngle: -90,
                endAngle: 270
                }
            },
            dataLabels: {
                enabled: true
            },
            fill: {
                type: 'gradient',
            },
            title: {
                text: 'Property Weights'
            },
            responsive: [{
                breakpoint: 480,
                options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
                }
            }]
            },
        
        
        };
    }

        

    render() {
        return (
            <div id="chart">
                <Chart options={this.state.options} series={this.state.series} labels={this.state.labels} type="donut" width={380} />
            </div>
        )
    }
}