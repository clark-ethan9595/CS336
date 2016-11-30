import React from 'react';
import $ from 'jquery';

module.exports = React.createClass({

	// Get initial state of the component
    getInitialState: function() {
        return {author: '', text: ''};
    },

    // Handle when the user enters an author
    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },

    // Handle when the user enters text for the comment
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },

    // Handle when the user submits the comment
    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, text: text});
        this.setState({author: '', text: ''});
    },

    // Render function for the CommentForm
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input className="ui-widget ui-corner-all" type="text" placeholder="name..."
                    value={this.state.author} onChange={this.handleAuthorChange}
                />
                <input className="ui-widget ui-corner-all" type="text" placeholder="comment..."
                    value={this.state.text} onChange={this.handleTextChange}
                />
                <input className="ui-button ui-widget ui-corner-all" type="submit" value="Post" />
            </form>
        );
    }
});