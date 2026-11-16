# 🚀 Surplus Connect - Run Commands

> Complete guide to run the Surplus Connect application with all available options.

---

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Mode](#development-mode)
- [Production Mode](#production-mode)
- [Testing](#testing)
- [Database Setup](#database-setup)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- Java 17+ installed
- Maven 3.8+ installed
- PostgreSQL 15+ (via Docker or local install)
- Git (optional)

### Verify Installation
```bash
java -version
mvn -version
docker --version
```

---

## Quick Start

### ⚡ Fastest Way to Run (One Command)

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn spring-boot:run
```

**Access:** http://localhost:8080

---

## Development Mode

### 🔧 Option 1: Run with Maven on Default Port (8080)

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn spring-boot:run
```

**Features:**
- Auto-recompile on file changes
- Live reload enabled
- Debug mode available
- **Access:** http://localhost:8080

---

### 🔧 Option 2: Run on Custom Port (8091)

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8091"
```

**Access:** http://localhost:8091

---

### 🔧 Option 3: Run with Debug Mode

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

**Debug Port:** 5005

---

## Production Mode

### 📦 Option 1: Build JAR & Run on Port 8091

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn clean package -DskipTests
java -jar target/surplusconnect-0.0.1-SNAPSHOT.jar --server.port=8091
```

**Access:** http://localhost:8091

---

### 📦 Option 2: Build JAR with Full Tests & Run

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn clean package
java -jar target/surplusconnect-0.0.1-SNAPSHOT.jar --server.port=8091
```

**Note:** This will run all 12 acceptance tests (takes ~20 seconds)

---

### 📦 Option 3: Build JAR with Custom Database Configuration

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn clean package -DskipTests
java -jar target/surplusconnect-0.0.1-SNAPSHOT.jar \
  --server.port=8091 \
  --spring.datasource.url=jdbc:postgresql://localhost:5433/surplus_db \
  --spring.datasource.username=surplus_user \
  --spring.datasource.password=surplus_pass
```

---

## Testing

### ✅ Run All 12 Acceptance Tests

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn clean test -Dtest=AllocationIntegrationTest
```

**Expected Output:**
```
Tests run: 12
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

---

### ✅ Run Specific Test

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn test -Dtest=AllocationIntegrationTest#test1_PartialAllocation
```

---

### ✅ Run Tests with Coverage

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn clean test -Dtest=AllocationIntegrationTest -DargLine="-Xmx512m"
```

---

### ✅ Run Tests in Debug Mode

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn test -Dtest=AllocationIntegrationTest -Dmaven.surefire.debug
```

---

## Database Setup

### 🐘 Option 1: Start PostgreSQL with Docker

```bash
docker run -d --name surplus-postgres -p 5433:5432 \
  -e POSTGRES_DB=surplus_db \
  -e POSTGRES_USER=surplus_user \
  -e POSTGRES_PASSWORD=surplus_pass \
  -v surplus_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

---

### 🐘 Option 2: Check if PostgreSQL is Already Running

```bash
docker ps | findstr postgres
```

---

### 🐘 Option 3: Stop PostgreSQL

```bash
docker stop surplus-postgres
```

---

### 🐘 Option 4: Start PostgreSQL Again

```bash
docker start surplus-postgres
```

---

### 🐘 Option 5: Connect to Database

```bash
docker exec -it surplus-postgres psql -U surplus_user -d surplus_db
```

**View all tables:**
```sql
\dt
```

**Exit:**
```sql
\q
```

---

## Build & Compilation

### 🔨 Option 1: Clean Build

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn clean install
```

---

### 🔨 Option 2: Compile Only

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn compile
```

---

### 🔨 Option 3: Build Without Tests

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn clean package -DskipTests
```

---

### 🔨 Option 4: Run Full Build Pipeline

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn clean verify
```

---

## Complete Setup from Scratch

### 🚀 Full Setup Script

Copy and run this complete setup:

```bash
REM Navigate to project
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java

REM Start PostgreSQL if not running
docker start surplus-postgres

REM Clean build
mvn clean install

REM Run all tests
mvn test -Dtest=AllocationIntegrationTest

REM Start application on port 8091
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8091"
```

Then open browser: **http://localhost:8091**

---

## Port Management

### 🔌 Check if Port is In Use

```bash
netstat -ano | findstr :8080
netstat -ano | findstr :8091
netstat -ano | findstr :5433
```

---

### 🔌 Kill Process on Port

```bash
REM For Windows
taskkill /PID <PID> /F

REM Example: Kill process on port 8080
for /f "tokens=5" %a in ('netstat -ano ^| findstr :8080') do taskkill /PID %a /F
```

---

## Troubleshooting

### ❌ "Port 8080 already in use"

**Solution 1:** Use a different port
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8091"
```

**Solution 2:** Kill the process on port 8080
```bash
for /f "tokens=5" %a in ('netstat -ano ^| findstr :8080') do taskkill /PID %a /F
```

---

### ❌ "PostgreSQL connection refused"

**Solution:** Start PostgreSQL container
```bash
docker start surplus-postgres
docker ps | findstr postgres
```

---

### ❌ "Cannot find Maven"

**Solution:** Install Maven or add to PATH
```bash
mvn -version
```

If not found, download from: https://maven.apache.org/download.cgi

---

### ❌ "Java version too old"

**Solution:** Update to Java 17+
```bash
java -version
```

Download from: https://www.oracle.com/java/technologies/downloads/

---

### ❌ "Tests failing"

**Solution 1:** Ensure database is running
```bash
docker ps | findstr postgres
```

**Solution 2:** Skip tests and run app
```bash
mvn clean package -DskipTests
java -jar target/surplusconnect-0.0.1-SNAPSHOT.jar --server.port=8091
```

---

## Environment Variables

### 📝 Set Custom Properties

```bash
REM Database Configuration
set SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/surplus_db
set SPRING_DATASOURCE_USERNAME=surplus_user
set SPRING_DATASOURCE_PASSWORD=surplus_pass

REM Server Port
set SERVER_PORT=8091

REM JWT Configuration
set JWT_SECRET=your-secret-key-here
set JWT_EXPIRATION=86400000

REM Run application
mvn spring-boot:run
```

---

## Recommended Workflows

### 📊 For Development

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
docker start surplus-postgres
mvn spring-boot:run
```

Then navigate to: **http://localhost:8080**

---

### 🧪 For Testing

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
docker start surplus-postgres
mvn clean test -Dtest=AllocationIntegrationTest
```

---

### 🚀 For Production

```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
docker start surplus-postgres
mvn clean package
java -jar target/surplusconnect-0.0.1-SNAPSHOT.jar --server.port=8091
```

Then navigate to: **http://localhost:8091**

---

## Docker Compose (Optional)

### 🐳 Run Everything with Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: surplus_db
      POSTGRES_USER: surplus_user
      POSTGRES_PASSWORD: surplus_pass
    ports:
      - "5433:5432"
    volumes:
      - surplus_data:/var/lib/postgresql/data

volumes:
  surplus_data:
```

Then run:
```bash
docker-compose up -d
```

---

## Quick Reference Table

| Task | Command |
|------|---------|
| Run on 8080 | `mvn spring-boot:run` |
| Run on 8091 | `mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8091"` |
| Build JAR | `mvn clean package -DskipTests` |
| Run JAR | `java -jar target/surplusconnect-0.0.1-SNAPSHOT.jar --server.port=8091` |
| Run Tests | `mvn clean test -Dtest=AllocationIntegrationTest` |
| Start DB | `docker start surplus-postgres` |
| Stop DB | `docker stop surplus-postgres` |
| Check Ports | `netstat -ano \| findstr :8080` |
| View Logs | Check Maven console output |

---

## Need Help?

- 📖 Check README.md for overview
- 🧪 Check MASTER_TEST.md for test details
- 📝 Check application.properties for configuration
- 🐛 Check console logs for errors

---

**Version:** 1.0  
**Last Updated:** 2026-11-16  
**Status:** All 12 Tests ✅ Passing

