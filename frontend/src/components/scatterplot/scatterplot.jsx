import React, {Component} from 'react';
import * as d3 from 'd3';
import equal from 'fast-deep-equal';
import styles from './scatterplot.module.scss'



export default class ScatterplotPlotly extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasDims: { width: 300, height: 500 },
            data: {},
        };
    }
    componentDidMount() {
        fetch('/readdata', {
            methods: 'GET',
            })
            .then(response => response.json())
            .then(response => {
                this.setState({data: response}, ()=> 
                generateSVG(
                    this.state.data,
                    this.props.dragdata,
                    this.state.canvasDims.height,
                    this.state.canvasDims.width
                )
            )
            })
    }

    componentDidUpdate(prevProps){
        if(!equal(this.props, prevProps)){
            generateSVG(
                        this.state.data,
                        this.props.dragdata,
                        this.state.canvasDims.height,
                        this.state.canvasDims.width
                    )
            }
    }

    render() {
        return (
            <svg
                id="svg"
                className={styles.svgComp}
                height={this.state.canvasDims.height}
                width={this.state.canvasDims.width}
            />
        );
    }
}

async function generateSVG(data, dragdata, height, width){
    console.log(data, dragdata)
    d3.selectAll("svg > *").remove();
    let svg = d3.select('svg');
    height = height - 20;
    return svg.node();
}