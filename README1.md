# GraphQL Movie API

This project is a GraphQL-based API designed for managing and retrieving movie data. It was developed as part of an API design assignment where one group implemented a GraphQL API with a focus on flexible data fetching, nested queries, and secure authentication using JWT.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Seeding](#database-seeding)
- [Running the Application](#running-the-application)
  - [Locally](#locally)
  - [Using Docker Compose](#using-docker-compose)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [CI/CD Integration](#cicd-integration)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management & Authentication**

- User registration, login, update, and deletion.
- JWT-based authentication with support for token refresh.
- *(See `authResolver.js` and `UserController.js`)*

- **Movie Operations**
  - CRUD operations for movies (create, read, update, delete) with authentication requirements.
  - Fetch movies by filters such as genre and release year.
  - Calculation of average movie ratings via nested queries.
  - *(See `movieResolver.js` and `MovieController.js`)*

- **Actor & Rating Data**
  - Retrieve actor information and the movies they have appeared in.
  - Retrieve ratings for specific movies.
  - *(See `actorResolver.js`, `ActorController.js`, and `RatingController.js`)*

- **GraphQL Endpoint & Schema**
  - A single `/graphql` endpoint handles all queries and mutations.
  - Schema is defined via separate `.graphql` files that are merged using GraphQL Tools.
  - *(See `index.js` in the schema folder)*

## Technologies

- **Node.js & Express** – Server-side runtime and web framework.
- **GraphQL & Apollo Server** – For flexible queries and mutations.
- **MongoDB & Mongoose** – Database and ODM for data modeling.
- **JWT** – JSON Web Tokens for authentication.
- **Docker & Docker Compose** – For containerized development and deployment.
- **Postman & Newman** – Automated API testing with comprehensive test cases.
- **Other Utilities:** Helmet, Morgan, CORS, and rate limiting middleware for enhanced security and logging.

## Installation

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local installation or via Docker)
- Docker & Docker Compose (optional, for containerized deployment)

### Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### Install Dependencies

```bash
npm install
```

## Configuration

Create a `.env` file in the project root with the following variables (adjust values as needed):

```env
MONGO_USER=yourMongoUsername
MONGO_PASSWORD=yourMongoPassword
JWT_SECRET=yourJWTSecret
NODEJS_EXPRESS_PORT=8081
DB_CONNECTION_STRING=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongo:27017/movieDB?authSource=admin
CSV_FILE_PATH=./path/to/movies_metadata.csv
ACTORS_CSV_PATH=./path/to/credits.csv
RATINGS_CSV_PATH=./path/to/ratings_small.csv
````

## Database Seeding

Populate your MongoDB database with sample movie, actor, and rating data by running the seed script:

```bash
node seed.js
```

The script reads CSV files, transforms the data, and inserts it into MongoDB.
(See seed.js)

Running the Application

Locally

Start the server using:

npm start

The API will run on the port specified in your .env (e.g., <http://localhost:8081>).

Using Docker Compose

To run the application along with a MongoDB container:

docker-compose up --build

This command starts both the API and MongoDB according to the settings in `docker-compose.yml`.  
*(See `docker-compose.yml`)*

## Testing

This project includes a comprehensive set of automated tests using Postman. The tests cover:

- **User registration and login** (including token handling).
- **CRUD operations for movies.**
- **Retrieval of actors and ratings.**
- **Nested queries** to verify computed data (e.g., average ratings).

**Test Files:**

- **Postman Collection:** `collection3.json`
- **Postman Environment:** `environment1.json`

Tests can be executed manually in Postman or integrated into a CI/CD pipeline using Newman.

## API Documentation

All GraphQL operations are available at:

<http://localhost:8081/graphql>

You can use GraphQL Playground (integrated via Apollo Server) to explore and test queries and mutations.

### Key Operations

- **Queries:**
  - `movies` – Retrieve a list of movies with optional filters.
  - `movie(id: ID!)` – Retrieve details of a specific movie.
  - `actors` – Retrieve a list of all actors.
  - `ratings(movieId: ID)` – Retrieve ratings, optionally filtered by movie ID.
- **Mutations:**
  - `registerUser(email: String!, password: String!)` – Register a new user.
  - `loginUser(email: String!, password: String!)` – Authenticate a user and retrieve a JWT.
  - `addMovie(...)` – Add a new movie (requires authentication).
  - `updateMovie(...)` – Update an existing movie (requires authentication).
  - `deleteMovie(id: ID!)` – Delete a movie (requires authentication).
  - `refreshToken(token: String!)` – Obtain new tokens.

*(See `authResolver.js` and `movieResolver.js` for implementation details.)*

## Project Structure

├── controllers/              # Business logic for handling movies, actors, ratings, and users
│   ├── movie/                # Movie, Actor, and Rating controllers
│   └── user/                 # User and authentication controllers
├── models/                   # Mongoose models for Movies, Actors, Ratings, and Users
├── resolvers/                # GraphQL resolvers for queries and mutations
│   ├── authResolver.js       # Handles authentication operations
│   ├── movieResolver.js      # CRUD operations for movies
│   ├── actorResolver.js      # Operations for retrieving actor data
│   └── ratingResolver.js     # Operations for retrieving ratings
├── schema/                   # GraphQL schema definitions (.graphql files)
├── config/                   # Configuration files (database connection, logging, rate limiting, etc.)
├── middleware/               # Express middleware (authentication, error handling, etc.)
├── public/                   # Static files served by the application
├── seed.js                   # Script to seed the database with sample data
├── docker-compose.yml        # Docker Compose configuration for containerized deployment
├── server.js                 # Main entry point for the Express and Apollo Server application
├── package.json              # Project dependencies and scripts
└── README.md                 # This file

## CI/CD Integration

The project is designed to be integrated into a CI/CD pipeline. With Newman, the Postman collections can be automatically executed on every commit or pull request to ensure that the API remains robust and functional.

## Usage Examples

### Sample Query

Retrieve all movies:

```graphql
query {
  movies {
    id
    title
    release_date
    genre
    description
  }
}
```

### Sample Mutation

Add a new movie (authentication required):

```graphql
mutation {
  addMovie(
    title: "Inception",
    release_date: 2010,
    genre: "Action, Sci-Fi",
    description: "A movie about dreams within dreams."
  ) {
    id
    title
  }
} 
```

## Contributing

If you have questions, encounter issues, or would like to contribute to this project, please open an issue or submit a pull request on the repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

⸻
