import React from 'react';
import styles from './pcp.module.scss';
import * as d3 from 'd3';
import equal from 'fast-deep-equal';

class GeneratePCP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasDims: { width: 1400, height: 500 },
            data_rec: {},
            correlation_pos: [],
            correlation_neg: [], 
            variance_pos: [],
            variance_neg: [],
            skewness_pos: [],
            skewness_neg: [],
            convergence: [],
            indices: [],

        };
    }
    componentDidMount() {
        fetch('/getjsondata', {
            methods: 'GET',
            })
            .then(response => response.json())
            .then(response => {
                this.setState({data_rec: response}, ()=> 
                generateSVG(
                    this.state.canvasDims.width, 
                    this.state.canvasDims.height,
                    this.props.corr, 
                    this.props.var, 
                    this.props.skew, 
                    this.props.neigh, 
                    this.props.split, 
                    this.props.fan,
                    this.props.callbackFromParent,
                    this.state.data_rec,
                    this.state.correlation_pos,
                    this.state.correlation_neg, 
                    this.state.variance_pos,
                    this.state.variance_neg, 
                    this.state.skewness_pos,
                    this.state.skewness_neg,
                    this.state.convergence,
                    this.state.indices
                )
            )
            })
    }

    componentDidUpdate(prevProps){
        if(!equal(this.props, prevProps)){
            generateSVG(
                        this.state.canvasDims.width, 
                        this.state.canvasDims.height,
                        this.props.corr, 
                        this.props.var, 
                        this.props.skew, 
                        this.props.neigh, 
                        this.props.split, 
                        this.props.fan,
                        this.props.callbackFromParent,
                        this.state.data_rec, 
                        this.props.pcpdata[0],
                        this.props.pcpdata[1], 
                        this.props.pcpdata[2],
                        this.props.pcpdata[3],
                        this.props.pcpdata[4],
                        this.props.pcpdata[5], 
                        this.props.pcpdata[6],
                        this.props.pcpdata[7],
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

async function generateSVG(width, 
    boxHeight, 
    corr, 
    variance, 
    skew, 
    neigh, 
    split, 
    fan, 
    callbackFromParent, 
    data_rec, 
    corr_rec, corr_rec_neg, 
    var_rec, var_rec_neg, 
    skew_rec, skew_rec_neg,
    convergence, 
    indices){

    d3.selectAll("svg > *").remove();
    let svg = d3.select('svg');
    let y = {};
    let x, dimensions, lines, g, background, corrlines, varlines, skewlines, neighlines, splitlines, fanlines;
    let height = boxHeight - 20;
    let data = data_rec
    dimensions = d3.keys(data[0]).filter(function (key) {
        if (key !== "") {
            y[key] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return +d[key]; }))
                .range([height, 0]);
            return key;
        };
    });
    let x_para_offset = 1000
    let dists = ['corr_pos', 'corr_neg', 'var_pos', 'var_neg', 'skew_pos', 'skew_neg', 'convergence']
    let offset = 50
    // Create our x axis scale.
    x = d3.scalePoint()
    .domain(dimensions)
    .range([x_para_offset, width-50]);

    let xd = d3.scaleLinear()
    .domain([-1, 1])
    .range([0, 25]);

    let x_dist = d3.scalePoint()
    .domain(dists)
    .range([10, x_para_offset-offset])


    let yd = y['bill_length_mm']

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", styles.background)
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", line);

    lines = svg.append("g")
        .attr("class", styles.lines)
        .selectAll("path")
        .data(data).enter()
        .append("path")
        .attr("d", line);

        
    // var kde = kernelDensityEstimator(kernelEpanechnikov(7),yd.ticks(10))
    // var density =  kde( corr_demo.map(function(d){  return d; }) )  

    svg.append("path")
      .attr("class", "mypath")
      .datum(corr_rec)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x_dist('corr_pos')+xd(d);})
          .y(function(d,i) { return y['bill_length_mm'](indices[i]); })
      );

      svg.append("path")
      .attr("class", "mypath")
      .datum(corr_rec_neg)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x_dist('corr_neg')+xd(d);})
          .y(function(d,i) { return y['bill_length_mm'](indices[i]); })
      );

      svg.append("path")
      .attr("class", "mypath")
      .datum(var_rec)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x_dist('var_pos')+xd(d);})
          .y(function(d,i) { return y['bill_length_mm'](indices[i]); })
      );

      svg.append("path")
      .attr("class", "mypath")
      .datum(var_rec_neg)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x_dist('var_neg')+xd(d);})
          .y(function(d,i) { return y['bill_length_mm'](indices[i]); })
      );

      svg.append("path")
      .attr("class", "mypath")
      .datum(skew_rec)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x_dist('skew_pos')+xd(d);})
          .y(function(d,i) { return y['bill_length_mm'](indices[i]); })
      );

      svg.append("path")
      .attr("class", "mypath")
      .datum(skew_rec_neg)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x_dist('skew_neg')+xd(d);})
          .y(function(d,i) { return y['bill_length_mm'](indices[i]); })
      );

      svg.append("path")
      .attr("class", "mypath")
      .datum(convergence)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x_dist('convergence')+xd(d);})
          .y(function(d,i) { return y['bill_length_mm'](indices[i]); })
      );

    //   x(key), y[key](d[key]
    // Add a group element for each dimension.
    g = svg.selectAll(".dimension")
        .data(dimensions).enter()
        .append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", styles.axis)
        .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "12")
        .attr("y", -9)
        .text(function (d) { return d; });

    // Add and store a brush for each axis.
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
        fetch('/getpoints', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([y['bill_length_mm'].invert(d3.brushSelection(this)[0]), y['bill_length_mm'].invert(d3.brushSelection(this)[1])])
            // console.log(y['bill_length_mm'].invert(940))
        })
        .then(response => response.json())
        .then(data => {
            callbackFromParent({pcpdata: data})
        })
    }
    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        // Get a set of dimensions with active brushes and their current extent.
        var actives = [];
        svg.selectAll(".brush")
            .filter(function (d) {
                // console.log(d3.brushSelection(this));
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

    function kernelDensityEstimator(kernel, X) {
        return function(V) {
          return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
          });
        };
      }
      function kernelEpanechnikov(k) {
        return function(v) {
          return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }
    
    return svg.node();
}

export default GeneratePCP;