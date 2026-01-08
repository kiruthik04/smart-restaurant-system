# How to Run the Smart Restaurant System (Monolith)

This guide provides step-by-step instructions to run the new **Monolithic Backend** and the frontend application.

## Prerequisites

1.  **Java JDK 17+** (for Backend)
2.  **Node.js & npm** (for Frontend)
3.  **MySQL Server** (running locally on port 3306)

## Database Setup

Before running the backend, ensure your MySQL server is running. Create the single database:

Login to MySQL:
```bash
mysql -u root -p
```
(Enter your password, e.g., `Kiruthik@2409`)

Run the SQL command:
```sql
CREATE DATABASE IF NOT EXISTS smart_restaurant_db;
```

## Running the Backend

The entire backend now runs as a single application on **Port 8080**.

```bash
cd backend/smart-restaurant-backend
# Using Maven Wrapper (if provided)
.\mvnw spring-boot:run
# OR using global Maven
mvn spring-boot:run
```

## Running the Frontend

The frontend is a React application. It has been updated to connect to the monolith at http://localhost:8080.

```bash
cd frontend
npm install  # Run this only the first time to install dependencies
npm start
```

The frontend will start at [http://localhost:3000](http://localhost:3000).

## Troubleshooting

-   **Port Conflicts**: Ensure port **8080** is free.
-   **Database Connection**: Check `application.properties` in `backend/smart-restaurant-backend/src/main/resources` if you need to change the DB password.
