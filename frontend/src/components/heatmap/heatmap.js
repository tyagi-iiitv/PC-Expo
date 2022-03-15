import React, {Component} from 'react';
import * as d3 from 'd3';
import styles from './heatmap.module.scss';
import equal from 'fast-deep-equal';
import { tooltipClasses } from '@mui/material';

export default class HeatMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            canvasDims: {width: 300, height: 300},
            margins: {top: 0, right: 0, bottom: 0, left: 0},
            data_rec: {},
            svg_x: 430,
            svg_y: 580,
        }
    }
    componentDidMount(){
        fetch('defheatmapdata', {
            methods: 'GET'
        })
        .then(response => response.json())
        .then(response => {
            this.setState({
                data_rec: response, 
            }, ()=> 
                generateSVG(
                    this.state.canvasDims.width,
                    this.state.canvasDims.height,
                    this.state.margins,
                    this.state.data_rec,
                    this.props.callbackFromParent,
                    this.state.svg_x,
                    this.state.svg_y
                )
            )
        })
        
    }

    componentDidUpdate(prevProps){
        if(!equal(this.props, prevProps)){
            generateSVG(
                this.state.canvasDims.width,
                this.state.canvasDims.height,
                this.state.margins,
                this.props.heatmap_data,
                this.props.callbackFromParent,
                this.state.svg_x,
                this.state.svg_y
                )
        }
    }

    render(){
        return(
            <div id="div2">
                <svg
                    id="svg2"
                    className={styles.svgComp}
                    height={this.state.canvasDims.height}
                    width={this.state.canvasDims.width}
                />    
            </div>
            
        )
    }
}

async function generateSVG(width, height, margins, data, callbackFromParent, svg_x, svg_y){
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
    
    let colors = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0,1])
    
    let mouseclick = function(d){
        callbackFromParent({local_cols: [d.col1, d.col2]})
    }

    let tooltip = d3.select('#div2')
        .append('div')
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        
    
    // Three function that change the tooltip when user hover / move / leave a cell
    let mouseover = function(e,d) {
        tooltip
          .style("opacity", 1)
          .html(e.col1 + " : " + e.col2)
          .style("left", (svg_x) + "px")
          .style("top", (svg_y) + "px")
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
    }

    let mousemove = function(e,d) {
        tooltip
          .html(e.col1 + " : " + e.col2)
          .style("left", (d3.mouse(this)[0]+svg_x) + "px")
          .style("top", (d3.mouse(this)[1]+svg_y) + "px")
    }
    let mouseleave = function(d) {
        tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
    }

    // Adding rects for the heatmap
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
        .style("fill", function(d){return colors(d.val)})
        .style("stroke-width","1px")
        .style('opacity', 0.8)
    .on('click', mouseclick) 
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave)
    // .on('mousemove', mousemove)

    // Adding diagonal labels
    svg.selectAll('.texts')
        .data(cols)
        .enter()
        .append('text')
        .attr('class', 'texts')
        // .attr('text-anchor', 'end')
        .attr('x', function(d){return x_scale(d)+x_scale.bandwidth()/100;})
        .attr('y', function(d){return y_scale(d)+y_scale.bandwidth()/1.5;})
        .attr('font-size', y_scale.bandwidth()/4)
        .text(function(d){return d;})
}