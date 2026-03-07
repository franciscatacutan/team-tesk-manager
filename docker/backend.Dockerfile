FROM maven:eclipse-temurin

WORKDIR /app

COPY backend/pom.xml .
RUN mvn dependency:go-offline

COPY backend/src ./src

RUN mvn clean package -DskipTests

EXPOSE 8080

CMD sh -c "java -jar target/*.jar"