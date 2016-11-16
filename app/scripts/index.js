/*
 * example.js is our first example using React.js to display a Comments page
 *      using modular, compsable components
 * Ethan Clark (elc3)
 * Lab08 for CS336 Web Development
 * October 26, 2016
 */

import React from 'react';
import ReactDOM from 'react-dom';

import CommentBox from './commentBox';

import '../base/base.css';

// Instatiates the root component, starts the framework, and injects the markup into a raw DOM element
ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval={2000}/>,
    document.getElementById('content')
);