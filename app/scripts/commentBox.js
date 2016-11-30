import React from 'react';
import $ from 'jquery';

import CommentList from './commentList';
import CommentForm from './commentForm';
import { store, ActionTools } from './flux';

module.exports = React.createClass({

	// Get initial state of the component
    getInitialState: function() {
        return {data: []};
    },
    // Edited this function for Lab13
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        comment.id = Date.now();
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        store.dispatch(ActionTools.addComment(comment));
    },
    // Added this function for Lab13
    componentWillMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                data: store.getState().data
            });
        });
    },
    // Added this function for Lab13
    componentWillUnmount: function() {
        this.unsubscribe();
    },

    // Render function for CommentBox
    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});