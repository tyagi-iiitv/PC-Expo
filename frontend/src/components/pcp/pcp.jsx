import React from 'react';
import styles from './pcp.module.scss';
import * as d3 from 'd3';
import data from './penguins_num.csv';
import equal from 'fast-deep-equal';

class GeneratePCP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasDims: { width: 500, height: 500 },
            data_rec: {},
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
                    this.state.data_rec
                )
            )
            })
    }

    componentDidUpdate(prevProps){
        if(!equal(this.props, prevProps)){
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
                        this.state.data_rec
                    )
                )
            })
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

async function generateSVG(width, boxHeight, corr, variance, skew, neigh, split, fan, callbackFromParent, data_rec){
    d3.selectAll("svg > *").remove();
    let svg = d3.select('svg');
    let y = {};
    let x, dimensions, lines, g, background, corrlines, varlines, skewlines, neighlines, splitlines, fanlines;
    let corr_demo = [[32.1, 0.24916235830768624], [35.15555555555556, 0.15790483479646897], [38.21111111111111, -0.41686431587717243], [41.266666666666666, -0.32359645446001584], [44.32222222222222, 0.1962084716392814], [47.37777777777778, 0.5301388342487361], [50.43333333333334, 0.07711069339350457], [53.48888888888889, -0.29910392213669773], [56.544444444444444, -0.9999999999999954], [59.6, 0]]
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

    // Create our x axis scale.
    x = d3.scalePoint()
    .domain(dimensions)
    .range([0, width]);

    let xd = d3.scaleLinear()
    .domain([-1, 1])
    .range([0, 200]);


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
    var density = corr_demo;
    console.log(density)
    
    svg.append("path")
      .attr("class", "mypath")
      .datum(density)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { console.log(d[1], x('bill_length_mm')+xd(d[1])); return x('bill_length_mm')+xd(d[1]); })
          .y(function(d) { console.log(y['bill_length_mm'](d[0])); return y['bill_length_mm'](d[0]); })
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
            console.log(key, x(key), y[key](d[key]));
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
                console.log(d3.brushSelection(this));
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