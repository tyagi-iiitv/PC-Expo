import React, {Component} from 'react';
import Plot from 'react-plotly.js';

export default class ScatterplotPlotly extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: {}
        }
    }

    componentDidMount(){
        fetch('/readdata', {
            methods: 'GET',
            })
            .then(response => response.json())
            .then(response => {
            this.setState({data: response})
        })
    }
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
                        x: this.state.data[0],
                        y: this.state.data[1],
                        mode: 'markers',
                        type: 'scatter',
                        marker: {color: '#F08080', size: 7},
                    },
                    // {
                    //     x: this.props.pcpdata[0],
                    //     y: this.props.pcpdata[1],
                    //     mode: 'markers',
                    //     type: 'scatter',
                    //     marker: {color: '#3182bd', size: 13},
                    // }
                ]}
                style={{width: 600, height: 400}}
                />
            </div>

        );
        
    }
}