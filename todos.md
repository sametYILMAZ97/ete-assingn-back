# Backend Side TODOS:

## Milestone 1: Basic Setup and API Routes

### ✅Initialize Node.js Project:
  - Create a new directory for your backend code.
  - Run npm init to initialize a new Node.js project.
  - Install necessary packages (e.g., express, body-parser).

### ✅Set Up Express Server:
  - Create a server.js file as your entry point.
  - Import required modules (express, body-parser).
  - Set up a basic Express server with a port (e.g., 5000).

### ✅Create Mock Data:
  - Create mock data arrays or objects for companies and products.
  - Store this data in a separate file (e.g., data.js).

### ✅Create API Routes:
  - Create separate route files for companies and products (e.g., companyRoutes.js, productRoutes.js).
  - Set up basic route handling using Express Router.

## Milestone 2: CRUD Operations

### ✅Retrieve Data:
  - Implement a route to fetch all datas and return them as JSON.

### ✅Add Data:
  - Create a route to add new datas.
  - Handle the incoming data, validate it, and update the mock data.

### ✅Update Data:
  - Implement routes for updating existing datas.
  - Use route parameters or request body to identify the item to update.

### ✅Delete Data:
  - Set up routes to delete data by their unique identifiers.

## Milestone 3: Bonus Features (Optional)

### ✅Node.js and Express API Structure:
  - Organize your routes and handlers into separate files for better maintainability.
  - Use Express Router to group related routes.

### ✅Integrate NoSQL Database (Optional):
  - If you're implementing MongoDB or a similar database, create connections and update CRUD operations to interact with the database.

### ✅JWT Authentication (Optional):
  - Implement user registration and login routes.
  - Integrate JWT for generating and verifying tokens.
  - Protect specific routes with middleware that checks for valid tokens.

### ✅Testing and Validation:
  - Test your API routes using tools like Postman.
  - Validate incoming data, handle errors gracefully, and send appropriate responses.

### ✅Documentation:
   - Provide clear instructions in your README about setting up and running the backend.
