# Build application with maven
FROM eclipse-temurin:17-jdk-alpine AS build

# Work folder
WORKDIR /app

# Copy maven wrapper & pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Downloads dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source
COPY src ./src

# Build JAR, skip test
RUN ./mvnw clean package -DskipTests -B


# Run application with JRE
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create user non-root

RUN addgroup -S appgroup && adduser -S appuser -G appgroup


# Copy jar from stage build

COPY --from=build /app/target/bookstore-backend-0.0.1-SNAPSHOT.jar app.jar

# Create folder uploads for file storage

RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]