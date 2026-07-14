# Business Change Workflow

Version: 1.0

Status: Active

Related Documents:

- ../constitution.md
- ../routing.md
- ../rules.md
- ../../graph/README.md

---

# 1. Purpose

This workflow governs every request that changes the business behavior of the
system.

Examples include:

- New business rules
- Requirement changes
- Process changes
- Feature additions
- Feature removals
- Permission changes
- Approval flow changes
- Business policy updates

Business changes affect the entire software lifecycle.

Implementation must never begin until documentation has been updated and
validated.

---

# 2. Scope

This workflow applies whenever the requested change modifies:

- Business logic
- User behavior
- Functional requirements
- Use Cases
- User Flows
- APIs
- Database behavior
- Business Rules

This workflow does NOT apply to:

- Code refactoring
- Performance optimization
- Bug fixes that do not change business behavior
- Documentation formatting

---

# 3. Workflow Overview

Business Change Request

↓

Requirement Analysis

↓

Impact Analysis

↓

Update Documentation

↓

Consistency Review

↓

Architecture Review

↓

Development Planning

↓

Implementation

↓

Testing

↓

Documentation Synchronization

↓

Project Status Update

---

# 4. Step 1 — Requirement Analysis

Objective

Understand the requested business change.

Activities

- Read the request carefully.
- Determine the business objective.
- Identify stakeholders.
- Determine whether this is:
  - New Feature
  - Change Request
  - Feature Removal
  - Business Rule Update

Deliverables

- Requirement Summary
- Business Goal
- Assumptions
- Open Questions

If information is incomplete,

AI must ask questions.

Never guess.

---

# 5. Step 2 — Impact Analysis

Objective

Determine everything affected by the change.

Use Graph Navigation first.

Graph

↓

Locate Related Requirements

↓

Locate Related Modules

↓

Locate APIs

↓

Locate Database

↓

Locate Tests

↓

Locate Documentation

AI should identify:

Business Requirements

↓

Functional Requirements

↓

Use Cases

↓

User Flows

↓

Architecture

↓

Database

↓

API

↓

Source Code

↓

Tests

Output

Affected Artifact List

Example

Affected Documents

- BRD
- PRD
- SRS

Affected Modules

- Auth

Affected APIs

- POST /login

Affected Database

- users

Affected Tests

- Login Test

---

# 6. Step 3 — Documentation Update

Documentation is updated BEFORE implementation.

Priority

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

Activities

- Update business description.
- Update requirements.
- Update user flows.
- Update use cases.
- Update acceptance criteria.
- Update API if required.
- Update database documentation if required.

No implementation should begin before this step is complete.

---

# 7. Step 4 — Consistency Review

Objective

Ensure every document agrees.

Verify

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

Review

- Naming consistency
- Requirement consistency
- Traceability
- Missing documents
- Broken references

If inconsistencies exist,

stop and report them.

---

# 8. Step 5 — Architecture Review

Determine whether the business change affects architecture.

Possible impacts

- New module
- New service
- New API
- New database table
- New integration
- New dependency

If architecture changes,

approval is required.

Deliverable

Architecture Decision Summary

---

# 9. Step 6 — Development Planning

Convert documentation into implementation tasks.

Example

Task 1

Backend

Implement Google Login API

Task 2

Frontend

Add Google Login Button

Task 3

Database

Store OAuth Provider

Task 4

Testing

Create Login Tests

Each task should reference:

Requirement

↓

Use Case

↓

Module

↓

Owner

↓

Priority

---

# 10. Step 7 — Implementation

Implementation begins only after:

✓ Documentation Updated

✓ Consistency Verified

✓ Architecture Approved

Implementation Rules

- Follow project architecture.
- Preserve naming conventions.
- Preserve module boundaries.
- Keep traceability.
- Avoid unrelated modifications.

Implementation should remain inside the impact scope.

---

# 11. Step 8 — Testing

Every business change requires testing.

Generate

- Unit Tests
- Integration Tests
- Acceptance Tests

Verify

Requirement

↓

Implementation

↓

Test

Every requirement should be testable.

---

# 12. Step 9 — Documentation Synchronization

After implementation,

verify documentation remains synchronized.

Check

Documentation

↓

Implementation

↓

Tests

↓

Graph Metadata

↓

RTM

If metadata changes,

Graph should be regenerated.

---

# 13. Step 10 — Project Status Update

Update project status.

Possible updates

- Feature Status
- Module Status
- Sprint Status
- Change Log
- Release Notes

---

# 14. Deliverables

A completed Business Change should produce:

Updated Documentation

- BRD
- PRD
- SRS
- Use Cases
- User Flow

Updated Architecture

Updated APIs

Updated Database

Updated Source Code

Updated Tests

Updated RTM

Updated Graph

Updated Change Log

---

# 15. Validation Checklist

Before completion,

verify:

□ Business objective understood

□ Requirements updated

□ User flows updated

□ Use Cases updated

□ Architecture reviewed

□ APIs updated

□ Database updated

□ Source Code updated

□ Tests generated

□ RTM updated

□ Graph regenerated if necessary

□ Documentation synchronized

□ Traceability preserved

---

# 16. Stop Conditions

AI shall stop and request clarification if:

- Requirements conflict.
- Business rules conflict.
- Documentation is incomplete.
- Approval is missing.
- Architecture cannot support the change.
- Graph cannot identify affected artifacts.

AI must explain:

- Why execution stopped.
- What information is missing.
- What action is required.

---

# 17. Completion Criteria

The workflow is complete only when:

✓ Documentation is authoritative.

✓ Architecture is consistent.

✓ Implementation matches documentation.

✓ Tests pass.

✓ Traceability is preserved.

✓ Graph metadata is synchronized.

✓ Project status is updated.

Business Change is not complete when only the code has been modified.

---

# 18. Workflow Principles

1. Documentation before implementation.
2. Business before code.
3. Graph before repository scanning.
4. Impact analysis before modification.
5. Preserve traceability.
6. Minimize context loading.
7. Validate every stage.
8. Never guess.
9. Stop on uncertainty.
10. Keep documentation synchronized.
