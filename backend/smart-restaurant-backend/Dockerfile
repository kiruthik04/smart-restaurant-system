# Use Maven image to build the project
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Skip tests to speed up build and avoid DB connection issues during build
RUN mvn clean package -DskipTests

# Use separate image for running the app
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/smart-restaurant-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render listens on PORT env var, but Spring Boot defaults to 8080)
# Expose port (Render listens on PORT env var, but Spring Boot defaults to 8080)
EXPOSE 8080

# Set active profile to PROD by default for Docker
ENV SPRING_PROFILES_ACTIVE=prod

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
