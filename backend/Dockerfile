# Build stage
FROM gradle:jdk17 AS build
WORKDIR /app

# 프로젝트 전체 코드를 도커 안으로 복사
COPY . .

# 👉 [핵심 수정] gradlew가 있는 backend 폴더로 작업 디렉토리 이동
WORKDIR /app/backend

# 권한 부여 및 빌드 실행
RUN chmod +x ./gradlew
RUN ./gradlew build -x test --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# 👉 [핵심 수정] 빌드된 jar 파일을 가져오는 경로도 backend 안으로 맞춰줌
COPY --from=build /app/backend/build/libs/*.jar app.jar

# Koyeb 및 Spring Boot 기본 포트
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]