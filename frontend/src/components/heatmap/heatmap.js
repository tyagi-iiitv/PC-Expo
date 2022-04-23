import React, {Component} from 'react';
import * as d3 from 'd3';
import styles from './heatmap.module.scss';
import equal from 'fast-deep-equal';

export default class HeatMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            canvasDims: {width: 300, height: 300},
            margins: {top: 0, right: 5, bottom: 3, left: 0},
            data_rec: {},
            svg_x: 430,
            svg_y: 580,
        }
    }
    componentDidMount(){
        fetch('/defheatmapdata', {
            methods: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: this.props.session_id,
            })
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
                    this.state.svg_y,
                    this.props.click_seq,
                    this.props.dimensions,
                    this.props.selected_list
                )
            )
        })
        
    }

    componentDidUpdate(prevProps){
        if(!equal(this.props.heatmap_data, prevProps.heatmap_data)){
            this.setState({data_rec: this.props.heatmap_data}, ()=> {
                generateSVG(
                    this.state.canvasDims.width,
                    this.state.canvasDims.height,
                    this.state.margins,
                    this.state.data_rec,
                    this.props.callbackFromParent,
                    this.state.svg_x,
                    this.state.svg_y,
                    this.props.click_seq,
                    this.props.dimensions,
                    this.props.selected_list
                )
            })
        }
        else if(this.props.change){
            generateSVG(
                this.state.canvasDims.width,
                this.state.canvasDims.height,
                this.state.margins,
                this.state.data_rec,
                this.props.callbackFromParent,
                this.state.svg_x,
                this.state.svg_y,
                this.props.click_seq,
                this.props.dimensions,
                this.props.selected_list
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

async function generateSVG(width, height, margins, data, callbackFromParent, svg_x, svg_y, click_seq, org_dimensions, org_selected_list){
    d3.selectAll("#svg2 > *").remove();
    d3.selectAll('#tooltip').remove();
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
        .interpolator(d3.interpolateBlues)
        .domain([0,1])
    
    let mouseclick = function(d){
        callbackFromParent({local_cols: [d.col1, d.col2], change_heatmap: false})
    }

    let tooltip = d3.select('#div2')
        .append('div')
        .style("opacity", 0)
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        
    
    let prev_opacity = 0.8
    // Three function that change the tooltip when user hover / move / leave a cell
    let mouseover = function(e,d) {
        prev_opacity = d3.select(this).style('opacity')
        tooltip
          .style("opacity", 1)
          .html(e.col1 + " : " + e.col2)
          .style("left", (svg_x) + "px")
          .style("top", (svg_y) + "px")
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
    }

    let mouseleave = function(d) {
        tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", function(d){
            if(click_seq.length > 0){
                if((click_seq[click_seq.length-1] === d.col1) && (click_seq.indexOf(d.col2) === -1))
                    return "2px"
                else
                    return "0px"
            }
            return "0px"
          })
          .style("opacity", prev_opacity)
    }

    let doubleclick = function(d){
        if(click_seq.length === 0){
            click_seq.push(d.col1)
            click_seq.push(d.col2)
            let new_selected_list = []
            for(let i=0;i<org_dimensions.length;i++){
                if(org_dimensions[i].name === d.col2){
                    new_selected_list.push(org_dimensions[i])
                }
                else if(org_dimensions[i].name === d.col1){
                    new_selected_list.unshift(org_dimensions[i])
                }
            }
            callbackFromParent({click_seq: click_seq, change_heatmap: true, selectedList: new_selected_list});
        }
        else{
            click_seq.push(d.col2)
            let select_list_clone = [...org_selected_list]
            for(let i=0;i<org_dimensions.length;i++){
                if(org_dimensions[i].name === d.col2){
                    select_list_clone.push(org_dimensions[i]);
                    break;
                }
            }
            callbackFromParent({click_seq: click_seq, change_heatmap: true, selectedList: select_list_clone});
        }
    }

    let rightclick = function(d,i){
        d3.event.preventDefault();
        click_seq = []
        callbackFromParent({click_seq: click_seq, change_heatmap: true})
    }

    // Adding selectable rects for the heatmap
    svg.selectAll()
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d) {
            if(click_seq.length > 0){
                if((click_seq[click_seq.length-1] === d.col1) && (click_seq.indexOf(d.col2) === -1))
                    return "rects"
                else
                    return "hide_rects"
            }
            return "rects"
        })
        .attr("x", function(d) {
            return x_scale(d.col1) 
        })
        .attr("y", function(d) {
            return y_scale(d.col2)
        })
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width", x_scale.bandwidth())
        .attr("height", y_scale.bandwidth())
        .style("fill", function(d){
             return colors(d.val)
        })
        .style("stroke", "black")
        .style("stroke-width",function(d){
            if(click_seq.length > 0){
                if((click_seq[click_seq.length-1] === d.col1) && (click_seq.indexOf(d.col2) === -1))
                    return "2px"
                else
                    return "0px"
            }
            return "0px"
        })
        .style('opacity', function(d){
            if(click_seq.length > 0){
                if((click_seq[click_seq.length-1] === d.col1) && (click_seq.indexOf(d.col2) === -1))
                    return 0.8
                else
                    return 0.2
            }
            return 0.8
        })
    .on('click', mouseclick) 
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave)
    .on('contextmenu', rightclick)

    svg.selectAll('.rects')
        .on('dblclick', doubleclick)

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
        .attr('font-weight', 700)
        .text(function(d){return d;})
}