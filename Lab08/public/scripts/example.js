/*
 * example.js is our first example using React.js to display a Comments page
 *      using modular, compsable components
 * Ethan Clark (elc3)
 * Lab08 for CS336 Web Development
 * October 26, 2016
 */

// First component, CommentBox, using a React Class
var CommentBox = React.createClass({

    // Get initial state of the component
    getInitialState: function() {
        return {data: []};
    },

    // Use to AJAX to get comments from the server
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
        })
         .done(function(result){
             this.setState({data: result});
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(this.props.url, status, err.toString());
         }.bind(this));
    },

    // Event to handle when a new comment gets submitted
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        comment.id = Date.now();
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
        })
         .done(function(result){
             this.setState({data: result});
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             this.setState({data: comments});
             console.error(this.props.url, status, errorThrown.toString());
         }.bind(this));
    },

    // Called automatically by React after a component is rendered for the first time
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
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

// Second component, CommentList, using React Class
var CommentList = React.createClass({

    // Render function for CommentList
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

// Third component, Comment, using React Class
var Comment = React.createClass({

    //Use Markdown to format your text inline
    rawMarkup: function() {
        var md = new Remarkable({html: true});
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },

    // Render function for Comment
    render: function() {
        return (
            <div className="comment">
                <h2 className="commentAuthor" >
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

// Fourth component, CommentForm, using React Class
var CommentForm = React.createClass({

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

// Instatiates the root component, starts the framework, and injects the markup into a raw DOM element
ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval="{2000}"/>,
    document.getElementById('content')
);