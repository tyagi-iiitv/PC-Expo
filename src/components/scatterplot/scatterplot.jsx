import React, {Component} from 'react';
import Plot from 'react-plotly.js';

export default class ScatterplotPlotly extends Component {

     //To display the scatterplot
    render() {

        // if(this.props.emb.length === 0){
        //     return <div/>
        // }

        return (
            <div>
                <Plot
                data={[
                    {   
                        //Creates the original scatterplot based on the embeddings
                        x: [1, 2, 3, 4],
                        y: [10, 15, 13, 17],
                        mode: 'markers',
                        type: 'scatter',
                        marker: {color: '#F08080', size: 10},
                    },
                ]}
                style={{width: 600, height: 400}}
                />
            </div>

        );
        
    }
}