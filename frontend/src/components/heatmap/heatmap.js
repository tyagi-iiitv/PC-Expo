import React, {Component} from 'react';
import * as d3 from 'd3';
import equal from 'fast-deep-equal';

export default class HeatMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            canvasDims: {width: 400, height: 300},
            margins: {top: 0, right: 100, bottom: 0, left: 0},
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

    componentDidUpdate(prevProps){
        if(!equal(this.props, prevProps)){
            generateSVG(
                this.state.canvasDims.width,
                this.state.canvasDims.height,
                this.state.margins,
                this.props.heatmap_data,
                )
        }
    }

    render(){
        return(
            <svg
                id="svg2"
                // className={styles.svgComp}
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
    
    let colors = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([-1,1])
    
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

    // Adding diagonal labels
    svg.selectAll('.texts')
        .data(cols)
        .enter()
        .append('text')
        .attr('class', 'texts')
        // .attr('text-anchor', 'end')
        .attr('x', function(d){return x_scale(d)+x_scale.bandwidth()+10;})
        .attr('y', function(d){return y_scale(d)+y_scale.bandwidth()/1.5;})
        .attr('font-size', y_scale.bandwidth()/2)
        .text(function(d){return d;})
}