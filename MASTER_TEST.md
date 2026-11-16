# MASTER AUTONOMOUS ENGINEERING PROMPT
## Project: Surplus Connect AI – Intelligent Resource Allocation Platform

You are acting as a Senior Software Architect, Senior Java Spring Boot Developer, AI/ML Engineer, Database Engineer, DevOps Engineer, QA Automation Engineer, and Autonomous Coding Agent.

Your responsibility is to inspect, upgrade, implement, test, debug, and verify my existing project until all defined acceptance criteria pass.

You must work directly inside my existing repository.

GitHub Repository:
https://github.com/bhaweshpant2005-eng/SURPLUS_CONNECT_JAVA_SP

Do not create an unrelated demo project. Upgrade the existing application.

# 1. PRIMARY OBJECTIVE

Transform Surplus Connect into a production-oriented AI-powered resource distribution platform that connects:

- Donors with surplus food, clothing, and essential resources.
- NGOs that require these resources.
- Administrators who monitor the distribution ecosystem.

The platform must support intelligent NGO matching, partial and full allocation, permanent database storage, AI-based reputation scoring, predictive analytics, real-time tracking, and automated resource distribution.

# 2. FIRST ACTION: INSPECT THE EXISTING PROJECT

Before writing or modifying code:

1. Inspect the complete repository structure.
2. Read pom.xml and existing dependencies.
3. Inspect Java entities, controllers, services, repositories, and security configuration.
4. Inspect the existing frontend and all available screens.
5. Inspect application.properties and existing database configuration.
6. Inspect existing APIs and business logic.
7. Identify incomplete features, errors, duplicated code, and security issues.
8. Run the existing tests and record the baseline results.

Do not assume the repository matches its README.

Preserve existing working features wherever possible.

Do not delete existing functionality simply to make implementation easier.

Create a clear implementation plan and a checklist of requirements before proceeding.

# 3. RECOMMENDED TECHNOLOGY STACK

Use the following architecture unless repository inspection identifies a genuine compatibility issue.

Backend:
- Java 17 (retain existing version initially).
- Spring Boot 3.x.
- Spring Security.
- JWT authentication.
- Spring Data JPA.
- Hibernate.
- Maven.
- Bean Validation.
- REST APIs.

Database:
- PostgreSQL.
- Flyway database migrations.
- Proper database indexing.
- Foreign keys and constraints.
- ACID transactions.
- Database backup and recovery support.

Frontend:
- Preserve the existing HTML, CSS, and JavaScript application initially.
- Upgrade its interface and usability.
- Use React only if a migration is justified and does not unnecessarily break existing features.

AI/ML:
- Python.
- FastAPI.
- Scikit-learn.
- NLP sentiment analysis.
- Pandas and NumPy.

Infrastructure:
- Docker.
- Docker Compose.
- Persistent PostgreSQL named volume.
- GitHub Actions CI where appropriate.

Do not introduce unnecessary microservices or dependencies.

# 4. PERMANENT DATABASE REQUIREMENTS

Implement permanent data storage using PostgreSQL.

MANDATORY REQUIREMENTS:

1. Never use an in-memory database as the production database.
2. Never use H2 as the production database.
3. Never use create-drop or temporary database storage in production.
4. Use Flyway for version-controlled database migrations.
5. Use environment variables for credentials.
6. Include a working .env.example file.
7. Add PostgreSQL configuration through Docker Compose.
8. Use named persistent Docker volumes.
9. Preserve database records after application restarts.
10. Preserve database records after Docker container restarts.
11. Implement appropriate database backup and restore instructions.
12. Never delete an existing database or persistent volume during normal application startup.

Use appropriate JPA settings such as:

spring.jpa.hibernate.ddl-auto=validate

The Flyway migration process should manage schema changes.

Create and maintain appropriate entities and relationships for:

- Users
- Donors
- NGOs
- Donations
- Resource requests
- Allocations
- Reviews
- Notifications
- Inventory
- Delivery records
- Audit history
- NGO reputation
- AI predictions

Use proper primary keys, foreign keys, unique constraints, timestamps, and indexes.

Never store passwords in plain text.

# 5. CORE FEATURE: PARTIAL AND FULL RESOURCE ALLOCATION

This is one of the most important requirements.

Example:

NGO requests 100 kg of rice.

Only 40 kg is available.

The platform must:

- Allocate 40 kg immediately.
- Keep the remaining 60 kg pending.
- Automatically update allocation quantities.
- Automatically reconsider the outstanding request when new donations arrive.

When 30 kg becomes available:

- Allocate 30 kg.
- Keep 30 kg pending.

When the remaining 30 kg becomes available:

- Complete the request.
- Mark it FULLY_FULFILLED.

Implement the following fields in resource requests:

- requested_quantity
- allocated_quantity
- remaining_quantity
- request_status
- priority_score
- created_at
- updated_at

Allocation statuses must include:

- PENDING
- PARTIALLY_FULFILLED
- FULLY_FULFILLED
- CANCELLED

Donation inventory must distinguish:

- Total quantity
- Available quantity
- Reserved quantity
- Dispatched quantity
- Delivered quantity

Implement allocation using:

allocationQuantity = Math.min(
    availableQuantity,
    remainingQuantity
);

Never allow negative inventory.

Never allocate the same donation quantity twice.

Use proper transaction management and database locking, such as SELECT FOR UPDATE or an equivalent concurrency-safe approach.

Use idempotency protections to avoid duplicate allocation transactions.

Create a separate allocation history record for every allocation.

Every allocation must be traceable to its donation, NGO request, donor, and quantity.

# 6. AUTOMATIC MATCHING ENGINE

Build an automated matching service.

The matching pipeline should perform:

1. Resource type compatibility.
2. NGO acceptance criteria.
3. Location and distance compatibility.
4. Donation expiry verification.
5. NGO capacity verification.
6. Request urgency evaluation.
7. NGO reputation and performance scoring.
8. Fair allocation evaluation.
9. Available quantity calculation.
10. Partial or full allocation.

Matching should automatically run when:

- A donor creates a donation.
- An NGO creates a resource request.
- An existing donation quantity changes.
- An allocation is cancelled.
- An NGO becomes unavailable.
- New inventory becomes available.

Also implement a scheduled reconciliation service to identify eligible pending requests that might have been missed by event-driven matching.

The automated process must not create duplicate allocations.

# 7. AI-BASED NGO AND DONOR TRUST ENGINE

Implement an intelligent ranking engine.

Rank eligible NGOs using:

- NGO rating.
- Verified review sentiment.
- Previous delivery success rate.
- Request urgency.
- Distance.
- Historical reliability.
- Fairness score.

Use the following initial configurable weights:

NGO rating: 25%
Review sentiment: 15%
Delivery success: 20%
Urgency: 15%
Distance: 10%
Reliability: 10%
Fairness: 5%

Normalize all scores to a common 0–100 scale.

Generate:

- NGO trust score.
- Donor reliability score.
- Matching score.
- Allocation explanation.
- Ranking history.

Do not blindly use average ratings.

Implement confidence adjustments for organizations with very few reviews.

New NGOs must have a fair opportunity and must not automatically receive extremely poor scores because they lack historical data.

Only allow verified delivery participants to submit eligible transaction reviews.

Prevent duplicate reviews for the same transaction.

Detect suspicious review patterns.

AI recommendations must not override hard requirements such as resource compatibility, capacity, expiry, and safety.

Emergency requests must have an explicit priority override, while fairness constraints must be maintained where possible.

# 8. AI REVIEW SENTIMENT ANALYSIS

Implement an NLP-based review analysis service.

Classify reviews into:

- Positive.
- Negative.
- Neutral.

Identify review topics:

- Delivery quality.
- Resource quality.
- Communication.
- Reliability.
- Overall satisfaction.

Generate a sentiment score that contributes to NGO reputation.

Start with a reliable baseline model and make model selection configurable.

Do not claim machine learning is trained on real platform behavior until verified labeled data exists.

If no trained model or model artifact is available, use a transparent baseline.

Provide a clean API between Spring Boot and the Python AI service.

If the AI service is unavailable, the core donation and allocation functionality must continue working using a documented fallback strategy.

# 9. ADDITIONAL AI FEATURES

Implement these in phases, prioritizing correctness over the number of features.

A. Demand Prediction:
Predict future resource demand using historical NGO requests and seasonal patterns.

B. Supply-Demand Forecasting:
Identify locations with resource shortages and locations with surplus inventory.

C. Food Expiry Prediction:
Identify donations approaching expiry and prioritize safe distribution.

D. Smart Donation Recommendations:
Recommend resources that donors can contribute based on current verified shortages.

E. AI Fraud Detection:
Identify suspicious duplicates, abnormal allocation behavior, and suspicious review activity. Flag cases for human investigation rather than automatically accusing or banning users.

F. AI Chat Assistant:
Allow donors and NGOs to ask questions about live donations, available resources, requests, and allocations.

The chatbot must retrieve authorized, current database information. It must not invent inventory quantities or allocation results.

G. Image Classification:
Suggest resource categories based on donation images. Require confirmation of the classification.

H. AI Admin Analytics:
Answer questions about resource shortages, NGO performance, failed deliveries, and allocation statistics using real database information.

I. OCR Verification:
Assist with extracting information from submitted NGO documents. Human approval is required for verification decisions.

Do not implement fake AI features that simply return hardcoded values.

# 10. NOTIFICATIONS AND BACKGROUND AUTOMATION

Implement notifications for:

- New matching donation.
- Partial allocation.
- Full allocation.
- Request status changes.
- Delivery dispatch.
- Successful delivery.
- Approaching expiry.
- Failed or cancelled allocation.
- Emergency resource requests.

Use an appropriate notification mechanism.

Implement retry handling for failed notification delivery.

Do not lose a committed allocation merely because email or push notification delivery fails.

# 11. SECURITY AND RELIABILITY

Maintain role-based access control.

Roles:

DONOR
NGO
ADMIN

Ensure:

- JWT authentication.
- Password hashing.
- Authorization on every protected API.
- Input validation.
- SQL injection protection.
- Secure file upload validation.
- File size limits.
- Safe error responses.
- Rate limiting where appropriate.
- No exposed secrets.
- No unauthorized access to other users' resources.

Use proper transaction boundaries.

Never silently ignore exceptions.

Implement centralized exception handling and meaningful application logs.

# 12. FRONTEND REQUIREMENTS

Improve the existing frontend without unnecessarily removing its working functionality.

Provide:

DONOR DASHBOARD:
- Register donations.
- Manage available resources.
- See allocated quantities.
- See delivery progress.
- View contribution history.
- View ratings and impact.

NGO DASHBOARD:
- Create resource requests.
- View matching donations.
- View partial and full allocation progress.
- View remaining pending quantities.
- Track deliveries.
- View reputation and reviews.

ADMIN DASHBOARD:
- Total donations.
- Total allocated resources.
- Pending demand.
- Partial allocations.
- Fully fulfilled requests.
- NGO rankings.
- Donor rankings.
- Regional shortages.
- AI analytics.
- Fraud alerts.
- System health.

Use real backend data, not hardcoded dashboard statistics.

Ensure responsive design.

Provide meaningful loading, empty, success, and error states.

# 13. MANDATORY AUTOMATED TESTING

Build a serious testing suite.

Backend:
- JUnit 5.
- Mockito.
- Spring Boot integration tests.
- Spring Security tests.
- REST API tests.

Database:
- PostgreSQL integration tests.
- Prefer Testcontainers for isolated integration testing.

Frontend:
- Appropriate JavaScript or browser tests based on the existing frontend.

AI:
- Pytest.
- Input validation tests.
- Model fallback tests.
- Scoring consistency tests.

Test all critical business rules.

MANDATORY ACCEPTANCE TESTS:

TEST 1: PARTIAL ALLOCATION

Requested quantity = 100 kg.
Available quantity = 40 kg.

Expected:
Allocated = 40 kg.
Remaining = 60 kg.
Status = PARTIALLY_FULFILLED.

TEST 2: SECOND PARTIAL ALLOCATION

Previous remaining quantity = 60 kg.
New available quantity = 30 kg.

Expected:
Total allocated = 70 kg.
Remaining = 30 kg.
Status = PARTIALLY_FULFILLED.

TEST 3: FULL ALLOCATION

Previous remaining quantity = 30 kg.
New available quantity = 30 kg.

Expected:
Total allocated = 100 kg.
Remaining = 0 kg.
Status = FULLY_FULFILLED.

TEST 4: INSUFFICIENT INVENTORY

Requested = 100 kg.
Available = 0 kg.

Expected:
Allocated = 0 kg.
Remaining = 100 kg.
Status = PENDING.

TEST 5: OVERALLOCATION PREVENTION

Two NGOs or allocation requests attempt to reserve the same available donation quantity.

Expected:
Total allocated/reserved quantity must never exceed available inventory.

TEST 6: CONCURRENT ALLOCATION

Run simultaneous allocation requests against the same inventory.

Expected:
Database transactions and locking prevent double allocation.

TEST 7: DUPLICATE REQUEST PROTECTION

Repeated requests or retries must not create duplicate allocation records.

TEST 8: CANCELLATION AND RECONCILIATION

Cancel a valid allocation and verify that eligible inventory is released and pending requests are reconsidered correctly.

TEST 9: PERMANENT DATABASE STORAGE

1. Start PostgreSQL.
2. Register a donor.
3. Register a donation.
4. Create an NGO request.
5. Complete a partial allocation.
6. Record the relevant IDs and quantities.
7. Stop and restart the backend.
8. Restart PostgreSQL while retaining its persistent volume.
9. Read the original records again.

Expected:
All committed records and allocation history must still exist with correct quantities and statuses.

Also verify that database migrations work on a fresh database without deleting existing data.

TEST 10: ROLE-BASED SECURITY

Verify that donors cannot access admin-only operations and NGOs cannot access unauthorized donor records.

TEST 11: REVIEW INTEGRITY

Verify duplicate review prevention, verified transaction requirements, and reputation calculation.

TEST 12: AI FALLBACK

Stop the AI service and verify that core donation creation and resource allocation continue to work.

# 14. LOOP ENGINEERING: CONTINUE UNTIL TESTS PASS

THIS SECTION IS A CRITICAL INSTRUCTION.

Operate as an iterative autonomous coding agent.

Follow this exact loop:

INSPECT → PLAN → IMPLEMENT → BUILD → TEST → DIAGNOSE → FIX → RETEST.

After each implementation phase:

1. Compile the application.
2. Run relevant unit tests.
3. Run relevant integration tests.
4. Inspect actual test failures.
5. Identify root causes.
6. Fix the implementation.
7. Rerun the failed tests.
8. Run the complete regression suite.

Do not simply suppress exceptions or disable failing tests.

Do not remove assertions to make tests pass.

Do not replace real database integration tests with mocked tests and declare persistence verified.

Do not declare a feature complete because the endpoint returns HTTP 200. Verify its actual database effects and business behavior.

Continue the fix-and-test loop until all required acceptance tests pass.

When a failure occurs, do not abandon the task after the first error.

If the same external blocker or environment issue repeatedly prevents progress, explain it clearly, report the failed checks, and provide the smallest necessary manual action. Never fabricate passing results.

Do not claim that tests passed unless they were actually executed successfully.

# 15. BUILD AND TEST COMMANDS

Use the commands appropriate to the inspected repository.

At minimum, validate the backend with:

mvn clean test

mvn verify

For the database, validate the migrations and PostgreSQL integration tests.

For Python AI services, run:

pytest

For the frontend, run the appropriate configured lint, build, and test commands.

Do not assume a command passed simply because it was issued. Inspect its exit status and output.

# 16. GIT AND DATA SAFETY

Before major modifications:

- Check Git status.
- Preserve user changes.
- Create a development branch or checkpoint when practical.
- Never overwrite uncommitted user work.
- Never commit credentials.
- Never drop or reset an existing production database.
- Never execute destructive Docker volume commands without explicit authorization.

Make changes in small, understandable increments.

# 17. FINAL COMPLETION REQUIREMENTS

Do not report completion until you have verified:

1. Backend builds successfully.
2. Frontend builds successfully.
3. Required automated tests pass.
4. Partial allocation works.
5. Full allocation works.
6. Over-allocation is prevented.
7. NGO ranking works.
8. AI fallback works.
9. Permanent PostgreSQL persistence is verified through restart testing.
10. Existing working functionality remains intact.

At the end, provide:

A. Architecture summary.

B. Updated project folder structure.

C. Database schema and migration summary.

D. APIs added or modified.

E. AI/ML features implemented and their actual implementation status.

F. Tests executed, including the exact passing and failing counts.

G. Evidence of database persistence testing.

H. How to run the application locally.

I. Required environment variables.

J. Known limitations and unresolved issues.

K. Exact commands to start, stop, test, and back up the system.

Maintain a progress checklist and update it after every phase.

Start by inspecting the existing repository. Then implement the project incrementally.

Your goal is not to produce the maximum amount of code.

Your goal is to deliver a reliable, secure, fully tested Surplus Connect AI application with demonstrable permanent data storage and correct partial/full resource allocation.