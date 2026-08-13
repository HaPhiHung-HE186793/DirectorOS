# Stage 1: Build application with Maven
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy maven wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and build package
COPY src ./src
RUN ./mvnw package -DskipTests

# Stage 2: Minimal Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy compiled jar from stage 1
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
