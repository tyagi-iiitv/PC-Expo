import React from 'react';
import styles from './pcp.module.scss';
import * as d3 from 'd3';

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
    // let divsvg = svg.node(0);
    return svg.node();
}

export default GeneratePCP;