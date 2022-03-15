import React, {Component} from 'react';
import styles from './localview.module.scss';
import * as d3 from 'd3';
import equal from 'fast-deep-equal';


export default class LocalView extends Component{
    constructor(props){
        super(props);
        this.state = {
            canvasDims: {width: 810, height: 300},
            correlation_pos: [],
            correlation_neg: [], 
            variance_pos: [],
            variance_neg: [],
            skewness_pos: [],
            skewness_neg: [],
            fan: [],
            neigh: [],
            clear_grouping: [],
            density_change: [],
            split_up: [],
            outliers: [],
            indices: [],
            window_size: 0,
        }
    }
    componentDidMount(){
        fetch('/getlocaldata', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              col1: this.props.local_cols[0],
              col2: this.props.local_cols[1],
              window_sliderval: this.props.window
            })
          })
          .then(response => response.json())
          .then(response => {
              this.setState({
                correlation_pos: response['pos_corr'],
                correlation_neg: response['neg_corr'],
                variance_pos: response['pos_var'],
                variance_neg: response['neg_var'],
                skewness_pos: response['pos_skew'],
                skewness_neg: response['neg_skew'],
                fan: response['fan'],
                neigh: response['neigh'],
                clear_grouping: response['clear_grouping'],
                density_change: response['density_change'],
                split_up: response['split_up'],
                outliers: response['outliers'],
                indices: response['indices'],
                window_size: response['window_size'],
              }, ()=> 
                generateSVG(
                    this.props.data,
                    this.props.local_cols,
                    this.state.canvasDims.width,
                    this.state.canvasDims.height,
                    this.state.correlation_pos,
                    this.state.correlation_neg,
                    this.state.variance_pos,
                    this.state.variance_neg,
                    this.state.skewness_pos,
                    this.state.skewness_neg,
                    this.state.fan,
                    this.state.neigh,
                    this.state.clear_grouping,
                    this.state.density_change,
                    this.state.split_up,
                    this.state.outliers,
                    this.state.indices,
                    this.state.window_size,
                    this.props.callbackFromParent
            )
              )
          })
    }

    componentDidUpdate(prevProps){
        if (!equal(this.props, prevProps)){
            fetch('/getlocaldata', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  col1: this.props.local_cols[0],
                  col2: this.props.local_cols[1],
                  window_sliderval: this.props.window
                })
              })
              .then(response => response.json())
              .then(response => {
                  this.setState({
                    correlation_pos: response['pos_corr'],
                    correlation_neg: response['neg_corr'],
                    variance_pos: response['pos_var'],
                    variance_neg: response['neg_var'],
                    skewness_pos: response['pos_skew'],
                    skewness_neg: response['neg_skew'],
                    fan: response['fan'],
                    neigh: response['neigh'],
                    clear_grouping: response['clear_grouping'],
                    density_change: response['density_change'],
                    split_up: response['split_up'],
                    outliers: response['outliers'],
                    indices: response['indices'],
                    window_size: response['window_size'],
                  }, ()=> 
                    generateSVG(
                        this.props.data,
                        this.props.local_cols,
                        this.state.canvasDims.width,
                        this.state.canvasDims.height,
                        this.state.correlation_pos,
                        this.state.correlation_neg,
                        this.state.variance_pos,
                        this.state.variance_neg,
                        this.state.skewness_pos,
                        this.state.skewness_neg,
                        this.state.fan,
                        this.state.neigh,
                        this.state.clear_grouping,
                        this.state.density_change,
                        this.state.split_up,
                        this.state.outliers,
                        this.state.indices,
                        this.state.window_size,
                        this.props.callbackFromParent
                )
                  )
              })
        }
    }

    render(){
        return(
            <svg
                id="svg3"
                className={styles.svgComp}
                height={this.state.canvasDims.height}
                width={this.state.canvasDims.width}
            />
        )
    }
}

async function generateSVG(data, local_cols, width, height, pos_corr, neg_corr, pos_var, neg_var, pos_skew, neg_skew, fan, neigh, clear_grouping, density_change, split_up, outliers, indices, window_size, callbackFromParent){
    d3.selectAll("#svg3 > *").remove();
    let svg = d3.select("#svg3");
    let colors = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0,1])
    height = height - 20;
    let y = {};
    let dimensions = local_cols.filter(function (key) {
        if (key !== "") {
            y[key] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return +d[key]; }))
                .range([height-30, 0]);
            return key;
        };
    });
    let x_para_offset = 700
    let dists = ['pos_corr', 'neg_corr', 'pos_var', 'neg_var', 'pos_skew', 'neg_skew', 'fan', 'neigh', 'clear_grouping', 'density_change', 'split_up', 'outliers']
    let offset = 100

    let x = d3.scalePoint()
    .domain(dimensions)
    .range([x_para_offset, width-50]);

    let xd = d3.scaleLinear()
    .domain([-1, 1])
    .range([0, 25]);

    let x_dist = d3.scalePoint()
    .domain(dists)
    .range([40, x_para_offset-offset])


    let yd = y[local_cols[0]]

    let background = svg.append("g")
        .attr("class", styles.background)
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", line);

    let lines = svg.append("g")
        .attr("class", styles.lines)
        .selectAll("path")
        .data(data).enter()
        .append("path")
        .attr("d", line);
        
    let g = svg.selectAll(".dimension")
        .data(dimensions).enter()
        .append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; });

    g.append("g")
        .attr("class", styles.axis)
        .each(function (d) {d3.select(this).call(d3.axisLeft().scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "12")
        .attr("y", height-5)
        .text(function (d) { return d; });
    
    g.append("g")
        .attr("class", "brush")
        .call(d3.brushY()
            .extent([[-10, 0], [10, height]])
            .on("start", brushstart)
            .on("brush", brush)
            .on("end", brushend))
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
    
    function line(d) {
        return d3.line()(dimensions.map(function (key) {
            // console.log(key, x(key), y[key](d[key]));
            return [x(key), y[key](d[key])];
        }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    function brushend(){
        if(!d3.brushSelection(this)){
            lines.style("display", null);
            return
        }

        // fetch('/getpoints', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify([y['bill_length_mm'].invert(d3.brushSelection(this)[0]), y['bill_length_mm'].invert(d3.brushSelection(this)[1])])
        //     // console.log(y['bill_length_mm'].invert(940))
        // })
        // .then(response => response.json())
        // .then(data => {
        //     callbackFromParent({dragdata: data})
        // })
    }
    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        // Get a set of dimensions with active brushes and their current extent.
        var actives = [];
        svg.selectAll(".brush")
            .filter(function (d) {
                return d3.brushSelection(this);
            })
            .each(function (key) {
                actives.push({
                    dimension: key,
                    extent: d3.brushSelection(this)
                });
            });
        // Change line visibility based on brush extent.
        if (actives.length === 0) {
            lines.style("display", null);
        } else {
            lines.style("display", function (d) {
                return actives.every(function (brushObj) {
                    return brushObj.extent[0] <= y[brushObj.dimension](d[brushObj.dimension]) && y[brushObj.dimension](d[brushObj.dimension]) <= brushObj.extent[1];
                }) ? null : "none";
            });
        }
    }

    d3.selectAll('.brushdist>.handle').remove();
    d3.selectAll('.brushdist>.overlay').remove();
    return svg.node();
}