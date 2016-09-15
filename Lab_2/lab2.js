// CS 336 Web Development
// Lab2 - JavaScript
// Ethan Clark (elc3)
// September 14, 2016

// Object to represent a Person with name, age, birthdate, and friend list
function Person(name, birthdate) {
	this.name = name;
	this.birthdate = birthdate;
	this.friendlist = [];
}

// Person method to change the Person's name
Person.prototype.changeName = function(new_name) {
	this.name = new_name;
}

// Person method to access the Person's age
// 	took from Naveen Jose's code calculating the same thing
Person.prototype.getAge = function() {
	var today = new Date();
	var birthDate = new Date(this.birthdate);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

// Person method to give a pleasant greeting
Person.prototype.greeting = function() {
	console.log("Hello, I am a person!");
}

// Person method to add a friend to the list of Friend objects
Person.prototype.addFriend = function(new_friend) {
	this.friendlist.push(new_friend);
}

// Create two instances of the Person prototype
var person1 = new Person("Ethan", "1995/09/05");
var person2 = new Person("Russ", "1996/05/02");

// Make the two instances friends of each other
person1.addFriend(person2);
person2.addFriend(person1);

// See that the addFriend() function worked properly
console.log(person1.friendlist);
console.log(person2.friendlist);

// Call the greeting method for the two Person instances
person1.greeting();
person2.greeting();

// Call the getAge() method to see if the function works
console.log(person1.name + " is " + person1.getAge() + " years old.");
console.log(person2.name + " is " + person2.getAge() + " years old.");

// Determine which of the two Person instances is older and report out to the console.
if (person1.getAge() > person2.getAge()) {
	console.log(person1.name + " is older than " + person2.name + ".");
} else {
  	console.log(person2.name + " is older than " + person1.name + ".");
}

// Object to represent a Student, inheriting from the Person object
function Student(name, birthdate, major) {
	Person.call(this, name, birthdate);
	this.major = major;
}

// Explicitly make object Student a child class (inherit characteristics from) the Person parent class
Student.prototype = Object.create(Person.prototype);

// Student method to give a pleasant greeting
Student.prototype.greeting = function() {
	console.log("Hello, I am a student!");
}

// Create two instances of the Student prototype
var student1 = new Student("Emily", "1996/08/04", "Kinesology");
var student2 = new Student("Mark", "1995/03/12", "Computer Science");

// Demonstrate that Students inherit from Person by using the instanceof operator
console.log(student1 instanceof Student);
console.log(student1 instanceof Person);

// Demonstrate that Student object inherited the Person object methods
// 	and that the Student methods work as well
//
student1.greeting();
student1.addFriend(person1);
console.log(student1.friendlist);

student2.greeting();
student2.addFriend(student1);
console.log(student2.friendlist);

student1.changeName("Alex")
console.log(student1.name);

// Determine which of the two Student instances is older and report out to the console.
if (student1.getAge() > student2.getAge()) {
	console.log(student1.name + " is older than " + student2.name + ".");
} else {
  	console.log(student2.name + " is older than " + student1.name + ".");
}
