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
import CommentEdit from './commentEdit';
import { StoreTools } from './flux';

import '../base/base.css';

StoreTools.startLoadingComments();

import { Router, Route, Redirect, browserHistory } from 'react-router';

// Instatiates the root component, starts the framework, and injects the markup into a raw DOM element
ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={CommentBox}/>
        <Route path="/:id" component={CommentEdit} />
    </Router>
 	),
    document.getElementById('content')
);