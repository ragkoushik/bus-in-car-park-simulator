Bus in Carpark Simulator

Description & Constraints

	- The application is a simulation of a robot operated bus moving in a carpark, of
		dimensions 5 units x 5 units.
	- There are no other obstructions in the carpark.
	- The bus is free to roam around the carpark, but must be prevented from exiting the
		carpark. Any movement that would result in the bus leaving the carpark must be
		prevented, however further valid movement commands must still be allowed.
	- The bus must not exit the carpark during movement. This also includes the initial
		placement of the bus.
	- Any move that would cause the bus to exit the carpark must be ignored.
		
		
		The application should be able to read in any one of the following commands:
			PLACE X,Y,F
			MOVE
			LEFT
			RIGHT
			REPORT
		- PLACE will put the bus in the carpark in position X,Y and facing NORTH, SOUTH,
		EAST or WEST.
		- The origin (0,0) can be considered to be the SOUTH WEST most corner.
		- The first valid command to the bus is a PLACE command, after that, any sequence of
		commands may be issued, in any order, including another PLACE command. The
		application should discard all commands in the sequence until a valid PLACE
		command has been executed.
		- MOVE will move the bus one unit forward in the direction it is currently facing.
		- LEFT and RIGHT will rotate the bus 90 degrees in the specified direction without
		changing the position of the bus.
		- REPORT will announce the X,Y and F of the bus. This can be in any form, but
		standard output is sufficient.
		- A bus that is not in the carpark should ignore the MOVE, LEFT, RIGHT and REPORT
		commands.
		- Input can be from a file, or from standard input, as the developer chooses.
		- Provide test data to exercise the application.


System Dependencies & Configuration

	To run the app, you'll need:

	* Node.js - https://nodejs.org/en/download/.     
	* npm     - https://www.npmjs.com/.   

	To run tests of the app, you'll need:

	* jasmine-npm - https://github.com/jasmine/jasmine-npm, to Install it:
		run on cmd
		npm install -g jasmine

Operating Instructions

	You have two options to send commands to the robot driver.   
		- The first option is to type in commands in command prompt.   
		- The second option is to provide a file with commands. 
			Some sample sample data have been attached in the sampleData folder.  

	To operate the robot by typing commands, start the app from the command prompt with 
	no arguments provided and begin type in commands:

		$ npm start
		Hi there!
		Begin by placing the Robot on the tabletop - PLACE X, Y, F 
			Eg: 1,1, South (case insensitive, spaces are acceptable instead of commas)
			. or 'q' to exit.
		> PLACE 1,1, North
		> right
		> move
		> report
		Robot's position is: 2, 1, EAST

	To operate the robot using a file, create a file with commands, 
		some sample examples have been attached in sampleData folder ./../sampleData/a.txt, 
		with the following contents:
		- PLACE X,Y,F or PLACE X Y F (spaces are acceptable instead of commas)
		- MOVE
		- LEFT
		- RIGHT
		- REPORT   

		Then run the application providing it the file as the first argument:

			node start.js sampleData\a.txt
			Reading commands from 'sampleData\a.txt' .... please wait.
			Hi there!
			Begin by placing the Robot on the tabletop - PLACE X, Y, F Eg: 1,1, South 
				(case insensitive, spaces are acceptable instead of commas). or 'q' to exit.
			> PLACE 0,0,NORTH
			> MOVE
			> REPORT
			Robot's position is: 0, 1, NORTH

Testing Instructions 

		Run `npm test` to run all the tests. Or specify the name of the spec against which to run tests: 
		
		npm test 						// test all components. runs all possible specs
		npm test spec/busSpec.js 		// test robot functionality only, runs busSpec
		npm test spec/messengerSpec.js 	// test messenger functionality only, runs messengerSpec
		npm test spec/carParkSpec.js 	// test tabletop functionality only, runs carParkSpec

Components

	The application consists of 5 (five) components:

	- Bus   
	- Messenger   
	- CarPark  
	- BusFactory    
	- BusSimulator    

	**Bus** is a class that represents a Bus and defines its functionality. 
		There are public methods to control the robot driver:

		- place(x, y, f)   
		- move()    
		- left()    
		- right()   
		- report()   
		- getMessenger()  

		The bus's dependencies are: the Messenger instance and the CarPark instance. 
		The bus's configuration data is stored in `config.js` file.   

	**Messenger** is a class that incapsulates all the behaviour of preparing any messages a robot driver can send to a user. 
		It is the bus's dependency. 
		It has only one public method that the bus calls when it has some message to a user:    

		- getMessage(msgConfigObj)    

		The Messenger's configuration data is stored in `config.js` file.   

	**CarPark** is a class that represents a car park where the bus moves. It is the bus's dependency. 
		It has only one public method that the bus calls when it needs to determine the boundaries of the car park:   

		- isOutOfcarPark(x, y)   

		The car park's configuration data is stored in `config.js` file.   

	**BusFactory** is a factory class that assembles the bus, that is resolves all its dependencies, 
		injects them into the bus, instantiates the bus and returns the instance to the caller.    

	**BusSimulator** is a module that combines all components together into a one usable application. 
		It has only one static method that starts all the magic of the app:

		- BusSimulator.run()   

		The entry point of the application is  `start.js` file. It requres **BusSimulator** and runs the app. 
		It only consists of two lines of code:

		```javascropt
		var app = require('./app/BusSimulator');
		app.run();
		```
