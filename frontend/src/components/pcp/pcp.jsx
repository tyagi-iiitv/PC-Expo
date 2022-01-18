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
    return svg.node();
}

export default GeneratePCP;