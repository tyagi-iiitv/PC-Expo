import React from 'react';
import styles from './pcp.module.scss';
import * as d3 from 'd3';
import data from './cars.csv';

class GeneratePCP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasDims: { width: 1280, height: 960 },
        };
    }
    componentDidMount() {
        generateSVG(this.state.canvasDims.width, this.state.canvasDims.height);
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

async function generateSVG(width, boxHeight) {
    let svg = d3.select('svg');
    let y = {};
    let x, dimensions, lines, g, background;
    let height = boxHeight - 20;
    d3.csv(data)
        .then(function(data){
            // Extract the list of dimensions as keys and create a y scale for each.
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

        // Draw lines
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
                .on("end", brush))
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    })
    .catch(function (err) {
        console.error(err);
    });
    
    function line(d) {
        return d3.line()(dimensions.map(function (key) {
            return [x(key), y[key](d[key])];
        }));
    }
    
    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
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