import React, {Component} from 'react';
import styles from './heatmap.module.scss';
import * as d3 from 'd3';

export default class HeatMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            canvasDims: {width: 300, height: 300},
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

async function generateSVG(width, height, data){
    d3.selectAll("#svg2 > *").remove();
    let svg = d3.select("#svg2");
    let cols = data[1];
    data = data[0];
    let x_scale = d3.scalePoint()
        .domain(cols)
        .range([10, width])
    let y_scale = d3.scalePoint()
        .domain(cols)
        .range([10, height])

    
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
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", "red")
        .style("stroke-width","1px") 
}