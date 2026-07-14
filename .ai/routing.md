# AI Routing Framework

Version: 1.0

Status: Active

Related Documents:

- constitution.md
- rules.md
- graph/README.md

---

# 1. Purpose

This document defines how AI processes every incoming request.

Its responsibilities are to:

- Classify user intent.
- Select the correct workflow.
- Retrieve only the required project context.
- Coordinate specialized AI roles.
- Ensure compliance with the AI Constitution.

Routing always occurs before reasoning or implementation.

---

# 2. Routing Principles

Every request shall follow the same execution pipeline.

AI must never:

- Start coding immediately.
- Read the entire repository.
- Ignore project workflows.
- Skip documentation.

AI shall always:

- Classify
- Route
- Retrieve Context
- Execute
- Validate

---

# 3. Execution Pipeline

Every request follows this sequence.

User Request

↓

Intent Detection

↓

Task Classification

↓

Workflow Selection

↓

Graph Navigation

↓

Context Retrieval

↓

Agent Selection

↓

Execution

↓

Validation

↓

Response

No step may be skipped.

---

# 4. Intent Detection

AI shall determine the primary purpose of the request.

Supported intents include:

- Question
- Explanation
- Documentation
- Analysis
- Business Change
- New Feature
- Bug Fix
- Refactoring
- Architecture
- Development
- Testing
- Review
- Planning
- Research

If multiple intents exist,

AI shall decompose them into independent tasks.

Example:

User:

"Update login requirements and implement Google Login."

Detected intents:

1. Business Change
2. Documentation
3. Development

---

# 5. Workflow Selection

After identifying intent,

AI shall load exactly one primary workflow.

| Intent          | Workflow                     |
| --------------- | ---------------------------- |
| Business Change | workflows/business-change.md |
| New Feature     | workflows/new-feature.md     |
| Documentation   | workflows/documentation.md   |
| Architecture    | workflows/architecture.md    |
| Development     | workflows/new-feature.md     |
| Bug Fix         | workflows/bug-fix.md         |
| Refactoring     | workflows/refactor.md        |
| Testing         | workflows/testing.md         |
| Release         | workflows/release.md         |

If a request spans multiple workflows,

execute them sequentially.

---

# 6. Context Retrieval

AI shall never retrieve context blindly.

The project provides an official Graph Navigation Layer.

AI must retrieve context in this order:

Graph Protocol

↓

Knowledge Graph

↓

Requirements Traceability Matrix

↓

Relevant Documentation

↓

Relevant Source Code

↓

Relevant Tests

Only files required for the current task may be opened.

Repository-wide scanning is prohibited unless:

- Graph cannot locate the artifacts.
- Graph is outdated.
- Project Owner explicitly requests a full scan.

---

# 7. Graph Navigation

Before reading documentation or code,

AI shall use the Graph Navigation Framework.

Graph responsibilities:

- locate artifacts
- identify dependencies
- determine affected modules
- discover related APIs
- locate related database objects
- identify linked documentation

Graph is the navigation layer.

Documentation remains the source of truth.

---

# 8. Documentation Retrieval

Documentation shall be retrieved according to authority.

Priority:

Vision

↓

BRD

↓

PRD

↓

SRS

↓

Architecture

↓

API

↓

Database

↓

Module Documents

↓

Implementation

↓

Tests

Higher-level documentation overrides lower-level documentation.

---

# 9. Source Code Retrieval

Source code must only be read after documentation.

Preferred order:

Architecture

↓

Project Structure

↓

Module

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Tests

AI should avoid loading unrelated modules.

---

# 10. Agent Selection

Different tasks require different expertise.

| Task                 | Primary Agent   |
| -------------------- | --------------- |
| Business Analysis    | BA Agent        |
| Requirement Analysis | BA Agent        |
| System Analysis      | SA Agent        |
| Architecture         | Architect Agent |
| Backend Development  | Developer Agent |
| Frontend Development | Developer Agent |
| Testing              | QA Agent        |

When multiple domains are involved,

the Orchestrator coordinates them internally.

Example:

Business Change

↓

BA Agent

↓

SA Agent

↓

Architect Agent

↓

Developer Agent

↓

QA Agent

---

# 11. Business Change Routing

If business requirements change,

AI shall execute:

Impact Analysis

↓

Locate affected requirements

↓

Locate affected documentation

↓

Update documentation

↓

Consistency validation

↓

Generate implementation tasks

↓

Implementation

↓

Testing

↓

Status update

Code shall never be updated before documentation.

---

# 12. New Feature Routing

Workflow:

Understand requirements

↓

Review architecture

↓

Locate module

↓

Review existing implementation

↓

Generate implementation plan

↓

Implement

↓

Generate tests

↓

Update documentation

↓

Update project status

---

# 13. Bug Fix Routing

Workflow:

Understand expected behavior

↓

Locate requirement

↓

Locate implementation

↓

Identify root cause

↓

Implement fix

↓

Regression validation

↓

Generate tests

↓

Update documentation if required

AI must never patch symptoms without identifying the root cause.

---

# 14. Refactoring Routing

Workflow:

Review architecture

↓

Impact analysis

↓

Locate dependencies

↓

Refactor

↓

Verify behavior

↓

Update documentation if necessary

↓

Regression review

Business behavior must remain unchanged.

---

# 15. Documentation Routing

Workflow:

Locate related requirements

↓

Identify affected documents

↓

Update documents

↓

Validate consistency

↓

Update RTM

↓

Update Graph metadata if necessary

Documentation should remain synchronized.

---

# 16. Architecture Routing

Workflow:

Review business requirements

↓

Review existing architecture

↓

Impact analysis

↓

Propose architecture

↓

Approval

↓

Update architecture documentation

↓

Generate implementation tasks

Architecture changes require approval before implementation.

---

# 17. Testing Routing

Workflow:

Locate requirements

↓

Locate implementation

↓

Generate test cases

↓

Generate unit tests

↓

Generate integration tests

↓

Review coverage

Every functional change should be traceable to one or more tests.

---

# 18. Validation

Before responding,

AI shall validate:

✓ Constitution compliance

✓ Workflow compliance

✓ Documentation consistency

✓ Traceability

✓ Architecture consistency

✓ Module boundaries

✓ Graph navigation completed

If validation fails,

AI shall report the issue instead of continuing.

---

# 19. Escalation

AI shall stop execution when:

- Business requirements conflict
- Documentation conflicts
- Missing approvals
- Missing requirements
- Missing architecture
- Missing Graph information

AI shall explain:

- What is missing
- Why it is required
- How to continue

---

# 20. Output Format

Whenever appropriate,

responses should include:

1. Summary
2. Analysis
3. Impact
4. Proposed Solution
5. Next Steps

Generated implementation should reference related requirements whenever
available.

---

# 21. Core Routing Rules

1. Route before reasoning.
2. Follow the selected workflow.
3. Use Graph before reading files.
4. Read documentation before implementation.
5. Retrieve minimal context.
6. Preserve traceability.
7. Validate before responding.
8. Escalate uncertainty.
9. Respect Constitution.
10. Never bypass the workflow.
