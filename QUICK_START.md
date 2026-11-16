# ⚡ Quick Start Guide - Surplus Connect

## 🚀 Start in 30 Seconds

### Step 1: Start Database
```bash
docker start surplus-postgres
```

### Step 2: Run Application
```bash
cd c:\Users\bhawe\OneDrive\Desktop\phase2_pbl_java
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8091"
```

### Step 3: Open Browser
```
http://localhost:8091
```

✅ **Application is now running!**

---

## 🧪 Run All Tests

```bash
mvn clean test -Dtest=AllocationIntegrationTest
```

**Expected Result:**
```
Tests run: 12
Failures: 0
Errors: 0
BUILD SUCCESS ✅
```

---

## 📊 Current Status

| Component | Status |
|-----------|--------|
| Tests (12) | ✅ PASSING |
| Database | ✅ PostgreSQL 15 |
| Port | ✅ 8091 |
| Security | ✅ JWT + RBAC |
| Analytics | ✅ Real data from DB |
| Reviews | ✅ Public read access |

---

## 🔧 Common Commands

| Task | Command |
|------|---------|
| Run App (Dev) | `mvn spring-boot:run` |
| Run App (Port 8091) | `mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8091"` |
| Run Tests | `mvn clean test -Dtest=AllocationIntegrationTest` |
| Build JAR | `mvn clean package -DskipTests` |
| Run JAR | `java -jar target/surplusconnect-0.0.1-SNAPSHOT.jar --server.port=8091` |
| Start DB | `docker start surplus-postgres` |
| Stop DB | `docker stop surplus-postgres` |

---

## 🗄️ Database Info

```
Host: localhost
Port: 5433
Database: surplus_db
Username: surplus_user
Password: surplus_pass
Storage: Docker volume (surplus_data)
```

---

## 📱 Access Points

| Service | URL |
|---------|-----|
| Web App | http://localhost:8091 |
| Admin Analytics | http://localhost:8091 (ADMIN login) |
| API Docs | Check controllers in code |

---

## ✨ Features

✅ Resource donation tracking  
✅ NGO request management  
✅ Intelligent allocation matching  
✅ Role-based access control  
✅ Real-time analytics  
✅ Review & rating system  
✅ Persistent database storage  
✅ JWT authentication  

---

## 📋 Test Coverage

All 12 mandatory tests passing:
1. ✅ Partial Allocation
2. ✅ Second Partial Allocation
3. ✅ Full Allocation
4. ✅ Insufficient Inventory
5. ✅ Overallocation Prevention
6. ✅ Concurrent Allocation
7. ✅ Duplicate Request Protection
8. ✅ Cancellation & Reconciliation
9. ✅ Permanent Database Storage
10. ✅ Role-Based Security
11. ✅ Review Integrity
12. ✅ AI Fallback

---

## 🆘 Troubleshooting

**Port 8091 already in use?**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8090"
```

**Database connection refused?**
```bash
docker ps  # Check if running
docker start surplus-postgres  # Start if not
```

**Tests failing?**
```bash
docker start surplus-postgres
mvn clean test -Dtest=AllocationIntegrationTest
```

**Can't run Maven?**
```bash
mvn -version  # Check if installed
# If not found, add to PATH or install from: https://maven.apache.org
```

---

## 📚 More Info

- Full commands: **RUN_COMMANDS.md**
- Test details: **MASTER_TEST.md**
- Project overview: **README.md**
- Completion report: **PHASE2_COMPLETION_REPORT.md**

---

**Status:** ✅ Production Ready  
**Last Updated:** 2026-11-16  
**All Tests:** 12/12 Passing
