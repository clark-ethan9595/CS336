/*
 * example.js contains the PersonBox, PersonForm, PersonList, and Person variables for React to use
 * Ethan Clark (elc3)
 * Homework3 for CS336 Web Development
 * November 10, 2016
 */

var PersonBox = React.createClass({

	// Get initial state of the component
    getInitialState: function() {
        return {data: []};
    },

    // Use to AJAX to get people from the server
    loadPeopleFromServer: function() {
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

    // Event to handle when a new person gets submitted
    handlePersonSubmit: function(person) {
        var people = this.state.data;
        var newPeople = people.concat([person]);
        this.setState({data: newPeople});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: person,
        })
         .done(function(result){
             this.setState({data: result});
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             this.setState({data: people});
             console.error(this.props.url, status, errorThrown.toString());
         }.bind(this));
    },

    // Called automatically by React after a component is rendered for the first time
    componentDidMount: function() {
        this.loadPeopleFromServer();
        setInterval(this.loadPeopleFromServer, this.props.pollInterval);
    },

    // Render function for PersonBox
    render: function() {
        return (
            <div className="peopleBox">
                <h1>People</h1>
                <PersonList data={this.state.data} />
                <PersonForm onPersonSubmit={this.handlePersonSubmit} />
            </div>
        );
    }
});

var PersonList = React.createClass({

	// Render function for PeopleList
    render: function() {
        var peopleNodes = this.props.data.map(function(person) {
            return (
                <Person idnumber={person.idnumber}  >
                    {person.firstname}
                    {person.lastname}
                    {person.startdate}
                </Person>
            );
        });
        return (
            <div className="peopleList">
                {peopleNodes}
            </div>
        );
    }
});

var Person = React.createClass({

 	//Use Markdown to format your text inline
    rawMarkup: function() {
        var md = new Remarkable({html: true});
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },

    // Render function for submitting a Person
    render: function() {
        return (
            <div className="person">
                <h2 className="personID" >
                    {this.props.idnumber}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

var PersonForm = React.createClass({

	// Get initial state of the component
    getInitialState: function() {
        return {firstname: '', lastname: '', idnumber: '', startdate: ''};
    },

    // Handle when the user enters a first name
    handleFirstChange: function(e) {
        this.setState({firstname: e.target.value});
    },

    // Handle when the user enters a last name
    handleLastChange: function(e) {
        this.setState({lastname: e.target.value});
    },

     // Handle when the user enters id number
    handleIdChange: function(e) {
        this.setState({idnumber: e.target.value});
    },

     // Handle when the user enters start date
    handleStartDateChange: function(e) {
        this.setState({startdate: e.target.value});
    },

    // Handle when the user submits the comment
    handleSubmit: function(e) {
        e.preventDefault();
        var firstname = this.state.firstname.trim();
        var lastname = this.state.lastname.trim();
        var idnumber = this.state.idnumber.trim();
        var startdate = this.state.startdate.trim();
        if (!firstname || !lastname || !idnumber || !startdate) {
            return;
        }
        this.props.onPersonSubmit({firstname: firstname, lastname: lastname, idnumber: idnumber, startdate: startdate});
        this.setState({firstname: '', lastname: '', idnumber: '', startdate: ''});
    },

    // Render function for the PersonForm
    render: function() {
        return (
            <form className="personForm" onSubmit={this.handleSubmit}>
                <input className="ui-widget ui-corner-all" type="text" placeholder="first name..."
                    value={this.state.firstname} onChange={this.handleFirstChange}
                />
                <input className="ui-widget ui-corner-all" type="text" placeholder="last name..."
                    value={this.state.lastname} onChange={this.handleLastChange}
                />
                <input className="ui-widget ui-corner-all" type="text" placeholder="id number..."
                    value={this.state.idnumber} onChange={this.handleIdChange}
                />
                <input className="ui-widget ui-corner-all" type="text" placeholder="start date..."
                    value={this.state.startdate} onChange={this.handleStartDateChange}
                />
                <input className="ui-button ui-widget ui-corner-all" type="submit" value="Post" />
            </form>
        );
    }
});

// Instatiates the root component, starts the framework, and injects the markup into a raw DOM element
ReactDOM.render(
    <PersonBox url="/api/people" pollInterval={2000}/>,
    document.getElementById('content')
);