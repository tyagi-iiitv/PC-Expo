import React, { Component } from 'react';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import Gallery from 'react-fine-uploader';
import 'react-fine-uploader/gallery/gallery.css';

// This component uses a File Uploaded built for react
// https://github.com/FineUploader/react-fine-uploader

const uploader = new FineUploaderTraditional({
    options: {
        debug: true,
        chunking: {
            enabled: true
        },
        deleteFile: {
            enabled: true,
            endpoint: '/upload'
        },
        request: {
            endpoint: '/upload'
        },
        retry: {
            enableAuto: true
        }
    }
});

export default class FileUploader extends Component{
    componentDidMount(){
        // When the component mounts, get the already uploaded files from previous session from the server. 
        // It uses the fileslist endpoint from the server
        fetch('/fileslist')
        .then(response => response.json())
        .then(json => uploader.methods.addInitialFiles(json))
    }
    
    render(){
        return <Gallery uploader={uploader}/>

    }
}
