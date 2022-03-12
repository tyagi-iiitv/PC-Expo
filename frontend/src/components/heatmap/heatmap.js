import React, {Component} from 'react';
import styles from './heatmap.module.scss';
import * as d3 from 'd3';
import { margin } from '@mui/system';

export default class HeatMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            canvasDims: {width: 300, height: 300},
            margins: {top: 80, right: 25, bottom: 30, left: 40},
            data_rec: {},
        }
    }
    componentDidMount(){
        console.log("inside mount heatmap")
        fetch('defheatmapdata', {
            methods: 'GET'
        })
        .then(response => response.json())
        .then(response => {
            this.setState({data_rec: response}, ()=> 
                generateSVG(
                    this.state.canvasDims.width,
                    this.state.canvasDims.height,
                    this.state.margins,
                    this.state.data_rec,
                )
            )
        })
        
    }

    render(){
        return(
            <svg
                id="svg2"
                className={styles.svgComp}
                height={this.state.canvasDims.height}
                width={this.state.canvasDims.width}
            />
        )
    }
}

async function generateSVG(width, height, margins, data){
    d3.selectAll("#svg2 > *").remove();
    let svg = d3.select("#svg2");
    let cols = data[1];
    data = data[0];
    width = width - margins.left - margins.right;
    height = height - margins.top - margins.bottom; 
    let x_scale = d3.scaleBand()
        .domain(cols)
        .range([0, width])
        .padding(0.05)

    let y_scale = d3.scaleBand()
        .domain(cols)
        .range([height, 0])
        .padding(0.05)
    
    svg.selectAll()
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "rects")
        .attr("x", function(d) {

            return x_scale(d.col1) 
        })
        .attr("y", function(d) {
            return y_scale(d.col2)
        })
        .attr("width", x_scale.bandwidth())
        .attr("height", y_scale.bandwidth())
        .style("fill", "red")
        .style("stroke-width","1px") 
}