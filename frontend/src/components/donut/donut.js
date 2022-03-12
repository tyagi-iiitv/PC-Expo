import { Component } from 'react';
import Chart from 'react-apexcharts';
import equal from 'fast-deep-equal';


export default class Donut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [
                this.props.clear_grouping,
                this.props.split_up,
                this.props.density_change,
                this.props.neigh,
                this.props.fan,
                this.props.outliers,
                this.props.pos_corr,
                this.props.neg_corr,
                this.props.pos_var,
                this.props.neg_var,
                this.props.pos_skew,
                this.props.neg_skew
            ],
            options: {
            labels: ['Clear Grouping', 'Split Up', 'Density Change', 'Neighborhood', 'Fan', 'Outliers', 'Pos Correlation', 'Neg Correlation', 'Pos Variance', 'Neg Variance', 'Pos Skewness', 'Neg Skewness'],
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

    componentDidUpdate(prevProps){
        if(!equal(this.props, prevProps)){
            this.setState({
                series: [
                    this.props.clear_grouping,
                    this.props.split_up,
                    this.props.density_change,
                    this.props.neigh,
                    this.props.fan,
                    this.props.outliers,
                    this.props.pos_corr,
                    this.props.neg_corr,
                    this.props.pos_var,
                    this.props.neg_var,
                    this.props.pos_skew,
                    this.props.neg_skew
                ]
            })
        }
    }

    render() {
        return (
            <div id="chart">
                <Chart options={this.state.options} series={this.state.series} labels={this.state.labels} type="donut" width={380} />
            </div>
        )
    }
}