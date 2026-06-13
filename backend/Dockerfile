# =========================
# Build Stage
# =========================

FROM maven:3.9.11-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY src src

# =========================
# Runtime Stage
# =========================

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/target/team-task-manager.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]