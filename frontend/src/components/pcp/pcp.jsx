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
            para: [],
            indices: [],
            window_size: 0,
            p_vals: []
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
                    this.state.para,
                    this.state.indices,
                    this.state.window_size,
                    this.state.p_vals,
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
                        this.props.data, 
                        this.props.pcpdata[0],
                        this.props.pcpdata[1], 
                        this.props.pcpdata[2],
                        this.props.pcpdata[3],
                        this.props.pcpdata[4],
                        this.props.pcpdata[5], 
                        this.props.pcpdata[6],
                        this.props.pcpdata[7],
                        this.props.pcpdata[8],
                        this.props.pcpdata[9],
                        this.props.pcpdata[10],
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
    para,
    indices,
    window_size,
    p_vals){
    d3.selectAll("#svg1 > *").remove();
    let svg = d3.select('#svg1');
    let y = {};
    let x, dimensions, lines, g, background, corrlines, varlines, skewlines, neighlines, splitlines, fanlines;
    let colors = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0,1])
    
    let colors_pvals = d3.scaleSequential()
        .interpolator(d3.interpolateGreys)
        .domain([0,1])
    
    let height = boxHeight - 20;
    let data = data_rec
    let clicked_node = null;
    dimensions = d3.keys(data[0]).filter(function (key) {
        if (key !== "") {
            y[key] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return +d[key]; }))
                .range([height-30, 0]);
            return key;
        };
    });
    console.log(data_rec)
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
    
    // svg.append("g")
    //     .attr("class", styles.hists)
    //     .selectAll("rect")
    //     .data(corr_rec)
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) {return x_dist('corr_pos')+20})
    //         .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //         .attr("width", 25)
    //         .attr("height", 32)
    //         .style("fill", function(d) {return colors(d)})
    // svg.append("g")
    //     .attr("class", styles.hists)
    //     .selectAll("rect")
    //     .data(p_vals)
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) {return x_dist('corr_pos')+50})
    //         .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //         .attr("width", 25)
    //         .attr("height", 32)
    //         .style("fill", function(d) {return colors_pvals(d)})
    //         .style("stroke", "black")
    //         .style("stroke-width", 1)
      

    // svg.append("g")
    // .attr("class", styles.hists)
    // .selectAll("rect")
    // .data(corr_rec_neg)
    // .enter()
    // .append("rect")
    //     .attr("x", function(d) {return x_dist('corr_neg')+20})
    //     .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //     .attr("width", 25)
    //     .attr("height", 32)
    //     .style("fill", function(d) {return colors(d)})
    // svg.append("g")
    //     .attr("class", styles.hists)
    //     .selectAll("rect")
    //     .data(p_vals)
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) {return x_dist('corr_neg')+50})
    //         .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //         .attr("width", 25)
    //         .attr("height", 32)
    //         .style("fill", function(d) {return colors_pvals(d)})
    //         .style("stroke", "black")
    //         .style("stroke-width", 1)

    // svg.append("g")
    // .attr("class", styles.hists)
    // .selectAll("rect")
    // .data(var_rec)
    // .enter()
    // .append("rect")
    //     .attr("x", function(d) {return x_dist('var_pos')+20})
    //     .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //     .attr("width", 25)
    //     .attr("height", 32)
    //     .style("fill", function(d) {return colors(d)})
    // svg.append("g")
    //     .attr("class", styles.hists)
    //     .selectAll("rect")
    //     .data(p_vals)
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) {return x_dist('var_pos')+50})
    //         .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //         .attr("width", 25)
    //         .attr("height", 32)
    //         .style("fill", function(d) {return colors_pvals(d)})
    //         .style("stroke", "black")
    //         .style("stroke-width", 1)

    // svg.append("g")
    // .attr("class", styles.hists)
    // .selectAll("rect")
    // .data(var_rec_neg)
    // .enter()
    // .append("rect")
    //     .attr("x", function(d) {return x_dist('var_neg')+20})
    //     .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //     .attr("width", 25)
    //     .attr("height", 32)
    //     .style("fill", function(d) {return colors(d)})
    // svg.append("g")
    //     .attr("class", styles.hists)
    //     .selectAll("rect")
    //     .data(p_vals)
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) {return x_dist('var_neg')+50})
    //         .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //         .attr("width", 25)
    //         .attr("height", 32)
    //         .style("fill", function(d) {return colors_pvals(d)})
    //         .style("stroke", "black")
    //         .style("stroke-width", 1)
    


    // svg.append("g")
    // .attr("class", styles.hists)
    // .selectAll("rect")
    // .data(skew_rec)
    // .enter()
    // .append("rect")
    //     .attr("x", function(d) {return x_dist('skew_pos')+20})
    //     .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //     .attr("width", 25)
    //     .attr("height", 32)
    //     .style("fill", function(d) {return colors(d)})
    // svg.append("g")
    //     .attr("class", styles.hists)
    //     .selectAll("rect")
    //     .data(p_vals)
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) {return x_dist('skew_pos')+50})
    //         .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //         .attr("width", 25)
    //         .attr("height", 32)
    //         .style("fill", function(d) {return colors_pvals(d)})
    //         .style("stroke", "black")
    //         .style("stroke-width", 1)
    

    // svg.append("g")
    // .attr("class", styles.hists)
    // .selectAll("rect")
    // .data(skew_rec_neg)
    // .enter()
    // .append("rect")
    //     .attr("x", function(d) {return x_dist('skew_neg')+20})
    //     .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //     .attr("width", 25)
    //     .attr("height", 32)
    //     .style("fill", function(d) {return colors(d)})
    // svg.append("g")
    //     .attr("class", styles.hists)
    //     .selectAll("rect")
    //     .data(p_vals)
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) {return x_dist('skew_neg')+50})
    //         .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //         .attr("width", 25)
    //         .attr("height", 32)
    //         .style("fill", function(d) {return colors_pvals(d)})
    //         .style("stroke", "black")
    //         .style("stroke-width", 1)
    

    // svg.append("g")
    // .attr("class", styles.hists)
    // .selectAll("rect")
    // .data(convergence)
    // .enter()
    // .append("rect")
    //     .attr("x", function(d) {return x_dist('fan')+20})
    //     .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //     .attr("width", 25)
    //     .attr("height", 32)
    //     .style("fill", function(d) {return colors(d)})
    // svg.append("g")
    //     .attr("class", styles.hists)
    //     .selectAll("rect")
    //     .data(p_vals)
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) {return x_dist('fan')+50})
    //         .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //         .attr("width", 25)
    //         .attr("height", 32)
    //         .style("fill", function(d) {return colors_pvals(d)})
    //         .style("stroke", "black")
    //         .style("stroke-width", 1)
    

    // svg.append("g")
    // .attr("class", styles.hists)
    // .selectAll("rect")
    // .data(para)
    // .enter()
    // .append("rect")
    //     .attr("x", function(d) {return x_dist('neighborhood')+20})
    //     .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //     .attr("width", 25)
    //     .attr("height", 32)
    //     .style("fill", function(d) {return colors(d)})
    // svg.append("g")
    //     .attr("class", styles.hists)
    //     .selectAll("rect")
    //     .data(p_vals)
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) {return x_dist('neighborhood')+50})
    //         .attr("y", function(d,i) {return y['bill_length_mm'](indices[i])})
    //         .attr("width", 25)
    //         .attr("height", 32)
    //         .style("fill", function(d) {return colors_pvals(d)})
    //         .style("stroke", "black")
    //         .style("stroke-width", 1)
    


    // //   x(key), y[key](d[key]
    // // Add a group element for each dimension and dist
    g = svg.selectAll(".dimension")
        .data(dimensions).enter()
        .append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; });
    
    // let g_dist = svg.selectAll(".dists")
    //     .data(dists).enter()
    //     .append("g")
    //     .attr("class", function(d) {return d})
    //     .attr("transform", function (d) { return "translate(" + x_dist(d) + ")"; });
    
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

    // g_dist.append("g")
    //     .attr("class", styles.axis)
    //     .each(function (d) { d3.select(this).call(d3.axisRight().scale(yd).tickFormat("")); })
    //     .append("text")
    //     .style("text-anchor", "middle")
    //     .attr("fill", "black")
    //     .attr("font-size", "12")
    //     .attr("y", height-5)
    //     .text(function (d) { return d; });

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

    // let fixed_brush = d3.brushY()
    //     .extent([[-10, 0], [10, height-5]])
    //     .on("start", distbrushstart)
    //     .on("brush", brushDist)
    //     .on("end", brushend)

    // g_dist.append("g")
    //     .attr("class", "brushdist")
    //     .call(fixed_brush)
    //     .call(fixed_brush.move, [0,y['bill_length_mm'](y['bill_length_mm'].domain()[1]-window_size)])
    //     // .selectAll("rect")
    //     // .attr("x", -8)
    //     // .attr("width", 16);
    //     // .on("start", brushstart)
    //         // .on("brush", brushDist)
    //         // .on("end", brushend))

    function line(d) {
        return d3.line()(dimensions.map(function (key) {
            // console.log(key, x(key), y[key](d[key]));
            return [x(key), y[key](d[key])];
        }));
    }
    
    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    function distbrushstart(){
        clicked_node = d3.select(this.parentNode).attr('class')
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
    
    function brushDist() {
        var actives = [{
            dimension: 'bill_length_mm',
            extent: d3.brushSelection(this)
        }]
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

export default GeneratePCP;