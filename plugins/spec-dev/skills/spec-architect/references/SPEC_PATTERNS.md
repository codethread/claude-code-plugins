# Specification Patterns and Document Structure

This document defines the file naming conventions, relationships, and lifecycle of specification documents across the prime-\* workflow phases for use with agentic tools

## Directory and File Naming Convention

Each feature specification is organized into its own directory with standardized file names:

```
specs/<numerical-id>-<kebab-cased-feature>/
├── feature.md
├── notes.md (optional)
└── tech.md
```

### Components:

- `numerical-id`: 3-digit incremental number (001, 002, etc.)
- `kebab-cased-feature`: Feature name in kebab-case
- Directory contains all related specification artifacts

## Document Types

### 1. Feature Specification (SPEC)

**Pattern**: `specs/<numerical-id>-<kebab-cased-feature>/feature.md`
**Example**: `specs/001-user-authentication/feature.md`
**Created by**: `/build` command (BUILD workflow - Specification Phase)
**Contains**: WHAT needs to be built - user requirements, acceptance criteria, success metrics
**Template**: `references/SPEC_TEMPLATE.md`

### 2. Technical Notes (TECH_NOTES)

**Pattern**: `specs/<numerical-id>-<kebab-cased-feature>/notes.md`
**Example**: `specs/001-user-authentication/notes.md`
**Created by**: `/build` command (BUILD workflow - during spike work)
**Contains**: Technical discoveries, POC findings, constraints discovered during specification phase
**Format**: Informal notes and findings

### 3. Technical Specification (TECH_SPEC)

**Pattern**: `specs/<numerical-id>-<kebab-cased-feature>/tech.md`
**Example**: `specs/001-user-authentication/tech.md`
**Created by**: `/build` command (BUILD workflow - Technical Design Phase)
**Contains**: Implementation GUIDANCE - discovered patterns, integration points, technology rationale, constraints. MAP (guidance) not BLUEPRINT (implementation details)
**Template**: `references/TECH_SPEC_TEMPLATE.md`

## Document Relationships

```mermaid
graph LR
    A[/build command] -->|Exploration| B[Codebase Discovery]
    A -->|Specification Phase| C[feature.md]
    A -->|Specification Phase| D[notes.md]
    C -->|Technical Design Phase| E[tech.md]
    D -->|Technical Design Phase| E
    E -->|Implementation Phase| F[Working Code]
    F -->|Verification| G[Verified Feature]
```

## Workflow Commands

### `/build` - Complete BUILD Workflow

**Inputs**: Feature description from user
**Phases**:
1. Exploration and Discovery
2. Specification Creation (creates `feature.md`, optional `notes.md`)
3. Technical Design (creates `tech.md`)
4. Implementation Coordination
5. Quality Verification

**Outputs**: Complete spec directory with implemented and verified code

### `/iterate` - ITERATE Workflow

**Inputs**: Path to existing spec directory (e.g., `specs/001-feature/`)
**Reads**: All existing spec files (`feature.md`, `tech.md`, `notes.md`)
**Phases**: Loads spec, assesses state, jumps to appropriate phase
**Outputs**: Continued implementation or expanded specification

## Directory Structure Example

```
specs/
├── 001-user-authentication/
│   ├── feature.md
│   ├── notes.md
│   └── tech.md
├── 002-payment-processing/
│   ├── feature.md
│   ├── notes.md
│   └── tech.md
└── 003-reporting-dashboard/
    ├── feature.md
    └── tech.md          (notes.md not created - no spike work needed)
```

## State Transfer Between Phases

Each phase operates independently but follows these conventions:

1. **Explicit Arguments**: Each command receives a spec directory path
2. **Deterministic Structure**: All related files live in the same directory with standard names
3. **Self-Contained Documents**: Each document contains all necessary context
4. **Progressive Enhancement**: Each phase adds detail without modifying previous outputs

## File Path Derivation

Commands derive file paths from the spec directory:

```bash
# Given: specs/001-user-authentication/
SPEC_DIR="specs/001-user-authentication"
FEATURE_SPEC="${SPEC_DIR}/feature.md"
TECH_NOTES="${SPEC_DIR}/notes.md"
TECH_SPEC="${SPEC_DIR}/tech.md"
```
