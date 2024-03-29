/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
// import '@public/style.css';
// tslint:disable-next-line
import { App } from './App';

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
