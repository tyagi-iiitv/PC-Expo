import React from 'react';
import styles from './pcp.module.scss';
import * as d3 from 'd3';
import data from './penguins_num.csv';

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
    let x, dimensions, lines, g, background, corrlines, varlines, skewlines, neighlines, splitlines, fanlines;


    let height = boxHeight - 20;
    d3.csv(data)
        .then(function(data){
            let newdata = [];
            let corrdata = [];
            let vardata = [];
            let skewdata = [];
            let neighdata = [];
            let splitdata = [];
            let fandata = [];
            let otherdata = [];
            let enter = false;
            for(let i=0; i<data.length; i++){
                newdata[i] = {'bill_length_mm': data[i]['bill_length_mm'], 
                              'bill_depth_mm': data[i]['bill_depth_mm']}
                if(data[i]['correlation'] == 'true'){
                    corrdata.push({'bill_length_mm': data[i]['bill_length_mm'], 
                    'bill_depth_mm': data[i]['bill_depth_mm']});
                    enter = true;
                }
                if(data[i]['variance'] == 'true'){
                    vardata.push({'bill_length_mm': data[i]['bill_length_mm'], 
                    'bill_depth_mm': data[i]['bill_depth_mm']});
                    enter = true;
                }
                if(data[i]['skewness'] == 'true'){
                    skewdata.push({'bill_length_mm': data[i]['bill_length_mm'], 
                    'bill_depth_mm': data[i]['bill_depth_mm']});
                    enter = true;
                }
                if(data[i]['neigh'] == 'true'){
                    neighdata.push({'bill_length_mm': data[i]['bill_length_mm'], 
                    'bill_depth_mm': data[i]['bill_depth_mm']});
                    enter = true;
                }
                if(data[i]['split_up'] == 'true'){
                    splitdata.push({'bill_length_mm': data[i]['bill_length_mm'], 
                    'bill_depth_mm': data[i]['bill_depth_mm']});
                    enter = true;
                }
                if(data[i]['fan'] == 'true'){
                    fandata.push({'bill_length_mm': data[i]['bill_length_mm'], 
                    'bill_depth_mm': data[i]['bill_depth_mm']});
                    enter = true;
                }
                if(enter == false){
                    otherdata.push({'bill_length_mm': data[i]['bill_length_mm'], 
                    'bill_depth_mm': data[i]['bill_depth_mm']});
                }
            };
            data = newdata
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
        corrlines = svg.append("g")
            .attr("class", styles.correlation)
            .selectAll("path")
            .data(corrdata).enter()
            .append("path")
            .attr("d", line);

        varlines = svg.append("g")
            .attr("class", styles.variance)
            .selectAll("path")
            .data(vardata).enter()
            .append("path")
            .attr("d", line);

        skewlines = svg.append("g")
            .attr("class", styles.skewness)
            .selectAll("path")
            .data(skewdata).enter()
            .append("path")
            .attr("d", line);

        neighlines = svg.append("g")
            .attr("class", styles.neigh)
            .selectAll("path")
            .data(neighdata).enter()
            .append("path")
            .attr("d", line);
        
        splitlines = svg.append("g")
            .attr("class", styles.split)
            .selectAll("path")
            .data(splitdata).enter()
            .append("path")
            .attr("d", line);

        fanlines = svg.append("g")
            .attr("class", styles.fan)
            .selectAll("path")
            .data(fandata).enter()
            .append("path")
            .attr("d", line);

        lines = svg.append("g")
            .attr("class", styles.lines)
            .selectAll("path")
            .data(otherdata).enter()
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