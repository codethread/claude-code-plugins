# <Feature Name>

<!-- This is a **living document**, it can and should be updated as implementation reveals insights requiring spec updates. These should be validated with the architect and user  -->

User Sign off: [REQUIRED - DO NOT BUILD WITHOUT THIS]

[where appropriate, diagrams, flowcharts, and visual aids significantly improve specification comprehension**. System context diagrams showing how new components fit within existing architecture prove especially valuable. Data flow illustrations clarify complex processes better than verbose descriptions. Visual elements should complement, not replace, textual specifications - they provide the high-level understanding that makes detailed requirements meaningful]

## Context and Problem Statement

[Clear description of the business problem and why this feature is needed]

## Value Statement

[Expected outcomes and success metrics]

## Stakeholders

- **Users**: [Who will use this]
- **Maintainers**: [Who will maintain this]
- **Dependencies**: [Other systems/teams affected]

## Technical Architecture

[High-level design decisions, component boundaries, integration points]

## Functional Requirements

### FR-1: [Feature Name]

[Description of what the system SHALL do]

### FR-2: [Feature Name]

[Description of what the system SHALL do]

### FR-3: [Feature Name]

[Description of what the system SHALL do]

## Non-Functional Requirements

### NFR-1: Performance

[Specific performance requirement, e.g., "Response time SHALL be < 200ms for 95% of requests"]

### NFR-2: Scalability

[Specific scalability requirement, e.g., "System SHALL support 10K concurrent users"]

### NFR-3: Security

[Specific security requirement, e.g., "Authentication SHALL use JWT tokens with 1-hour expiry"]

### NFR-4: Reliability

[Specific reliability requirement, e.g., "System SHALL maintain 99.9% uptime"]

## External Dependencies

[Validated through spike work - actual behaviors documented]

## Interface Definitions

[API endpoints, data models, integration contracts]

## Testing Setup

**CRITICAL: This section enables the spec-tester agent to successfully verify this feature.**

### System Startup

[Provide exact commands to start required systems. The spec-tester agent has full Bash capabilities.]

**Example for web application:**
```bash
# Start development server
cd /path/to/project
npm run dev
# Server will be available at http://localhost:3000
# Wait for "Server ready" message before testing
```

**Example for full-stack application:**
```bash
# Terminal 1: Start backend API
cd /path/to/backend
npm run dev
# API available at http://localhost:8080

# Terminal 2: Start frontend
cd /path/to/frontend
npm start
# UI available at http://localhost:3000
```

**Example for CLI tool:**
```bash
# Build the tool
cd /path/to/project
npm run build

# Run the CLI
./bin/my-tool --help
```

### Environment Requirements

[Any environment setup needed before testing]

**Example:**
- Environment variables: Copy `.env.example` to `.env` and configure
- Database: Run `npm run db:migrate` to set up test database
- API keys: Requires `API_KEY` environment variable (use test key: `test-key-123`)

### Test Data Setup

[How to create/load test data if needed]

**Example:**
```bash
# Seed test database
npm run db:seed:test

# Or manually create test user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Access Points

[Where to access the system for testing]

**Example:**
- **Web UI**: http://localhost:3000
- **API**: http://localhost:8080/api
- **Admin Panel**: http://localhost:3000/admin (login: admin@test.com / admin123)
- **API Docs**: http://localhost:8080/docs

### Cleanup / Shutdown

[How to properly stop systems and clean up]

**Example:**
```bash
# Stop all servers (Ctrl+C in each terminal)
# Or if using background processes:
npm run stop

# Clean up test data (optional)
npm run db:reset
```

### Testing Tools Available

[List any testing tools, scripts, or helpers]

**Example:**
- **playwright-skill**: Available for browser-based UI testing
- **API testing**: Use `curl` or built-in test scripts (`npm run test:api`)
- **Test utilities**: Helper scripts in `/scripts/test-helpers.sh`

## Acceptance Criteria

[Clear conditions that determine feature completion]

## Implementation Notes

[Technical constraints, dependencies, risks discovered during spikes]

## Technical Debt Tracking

[Document any shortcuts or future improvements needed]
