import React from 'react';
import styles from './pcp.module.scss';
import * as d3 from 'd3';
import equal from 'fast-deep-equal';

class GeneratePCP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasDims: { width: 1650, height: 500 },
            data_rec: {},
            correlation_pos: [],
            correlation_neg: [], 
            variance_pos: [],
            variance_neg: [],
            skewness_pos: [],
            skewness_neg: [],
            convergence: [],
            para: [],
            indices: [],
            window_size: 0,
            p_vals: []
        };
    }
    componentDidMount() {
        generateSVG(
            this.state.canvasDims.width, 
            this.state.canvasDims.height,
            this.props.data, 
            this.props.selectedList,
        )
    }

    componentDidUpdate(prevProps){
        if(!equal(this.props, prevProps)){
            generateSVG(
                        this.state.canvasDims.width, 
                        this.state.canvasDims.height,
                        this.props.data, 
                        this.props.selectedList,
                    )
            }
    }

    render() {
        return (
            <svg
                id="svg1"
                className={styles.svgComp}
                height={this.state.canvasDims.height}
                width={this.state.canvasDims.width}
            />
        );
    }


}

async function generateSVG(
    width, 
    boxHeight, 
    data_rec, 
    selectedList){
    d3.selectAll("#svg1 > *").remove();
    let svg = d3.select('#svg1');
    let y = {};
    let x, dimensions, lines, g;
    let height = boxHeight - 70;
    let data = data_rec
    let selectedCols = selectedList.map(o => o.name)
    dimensions = selectedCols.filter(function (key) {
        if (key !== "") {
            y[key] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return +d[key]; }))
                .range([height-30, 0]);
            return key;
        };
    });
    let x_para_offset = 100
    let x_para_right_offset = 150
    let dists = ['corr_pos', 'corr_neg', 'var_pos', 'var_neg', 'skew_pos', 'skew_neg', 'fan', 'neighborhood']
    let offset = 100
    // Create our x axis scale.
    x = d3.scalePoint()
    .domain(dimensions)
    .range([x_para_offset, width-x_para_right_offset]);

    let xd = d3.scaleLinear()
    .domain([-1, 1])
    .range([0, 25]);

    let x_dist = d3.scalePoint()
    .domain(dists)
    .range([40, x_para_offset-offset])


    
    // Add grey background lines for context.
    let background = svg.append("g")
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

    // // Add a group element for each dimension and dist
    g = svg.selectAll(".dimension")
        .data(dimensions).enter()
        .append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; });
    
    // // // Add axis labels and title.
    g.append("g")
        .attr("class", styles.axis)
        .each(function (d) {d3.select(this).call(d3.axisLeft().scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "12")
        .attr("y", height-5)
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
        if(!d3.brushSelection(this)){
            lines.style("display", null);
            return
        }
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
    return svg.node();
}

export default GeneratePCP;