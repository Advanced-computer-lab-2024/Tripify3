import App from "./App.js"; // Import the App class

class Server {
  constructor() {
    const app = new App(); // Create the App instance
    app.connectToDatabase();
    app.initializeMiddlewares();
    app.listen(); // Start listening on the specified port
  }
}

new Server();
