# New Feature Workflow

Version: 1.0

Status: Active

Related Documents:

- ../constitution.md
- ../routing.md
- ../rules.md
- ../../graph/README.md

---

# 1. Purpose

This workflow governs the implementation of entirely new features.

A new feature introduces new capabilities without modifying the intended
behavior of existing features.

Every new feature must begin with business understanding before implementation.

---

# 2. Scope

This workflow applies to:

- New modules
- New business capabilities
- New APIs
- New database entities
- New UI screens
- New integrations
- New reports

It does NOT apply to:

- Bug fixes
- Refactoring
- Requirement corrections
- Existing business changes

---

# 3. Workflow Overview

Feature Request

↓

Requirement Analysis

↓

Feasibility Analysis

↓

Architecture Review

↓

Documentation

↓

Task Planning

↓

Implementation

↓

Testing

↓

Documentation Synchronization

↓

Project Status Update

---

# 4. Requirement Analysis

Objective

Understand the business value.

AI should identify:

- Business goal
- Target users
- Functional scope
- Out of scope
- Dependencies
- Constraints

Deliverables

- Feature Summary
- Scope Definition
- Open Questions

---

# 5. Feasibility Analysis

Determine whether the feature can be implemented.

Review:

- Existing modules
- Existing APIs
- Existing database
- Existing architecture
- External systems

Graph Navigation should be used first.

Possible outcomes

- Reuse existing module
- Extend existing module
- Create new module

---

# 6. Architecture Review

Determine architectural impact.

Review:

- Module boundaries
- Layer responsibilities
- Dependencies
- Scalability
- Security
- Performance

If architecture changes significantly,

approval is required.

Deliverable

Architecture Proposal

---

# 7. Documentation

Documentation shall be completed before implementation.

Update:

- PRD
- SRS
- User Flow
- Use Cases
- API Specification
- Database Design
- Architecture

Generate Acceptance Criteria.

---

# 8. Development Planning

Break the feature into implementation tasks.

Each task should include:

- Requirement
- Module
- Priority
- Dependencies
- Estimated complexity

Tasks should be small enough for implementation.

---

# 9. Implementation

Implementation Rules

- Follow architecture.
- Follow coding standards.
- Preserve module boundaries.
- Reuse existing components whenever possible.
- Avoid duplicate logic.
- Strictly reference HTML/CSS mockups in `docs/ui/` for frontend features.

AI should not introduce unnecessary complexity.

---

# 10. Testing

Generate:

- Unit Tests
- Integration Tests
- Acceptance Tests

Verify

Requirement

↓

Implementation

↓

Test

---

# 11. Documentation Synchronization

Verify that implementation matches:

- PRD
- SRS
- Architecture
- API
- Database

Update:

- RTM
- Graph Metadata

Regenerate Graph if necessary.

---

# 12. Completion Deliverables

A completed feature should produce:

✓ Updated PRD

✓ Updated SRS

✓ Updated Architecture

✓ Updated API

✓ Updated Database

✓ Updated Source Code

✓ Updated Tests

✓ Updated RTM

✓ Updated Graph

✓ Updated Change Log

---

# 13. Validation Checklist

□ Requirements understood

□ Scope defined

□ Architecture approved

□ Documentation completed

□ Tasks generated

□ Code implemented

□ Tests completed

□ RTM updated

□ Graph synchronized

□ Documentation synchronized

---

# 14. Stop Conditions

Stop immediately if:

- Requirements are incomplete.
- Architecture is undefined.
- Dependencies are unknown.
- Approval is missing.

Never continue with assumptions.

---

# 15. Workflow Principles

1. Business value first.
2. Design before implementation.
3. Documentation before code.
4. Graph before repository scanning.
5. Reuse before creating.
6. Test every feature.
7. Preserve architecture.
8. Keep documentation synchronized.
