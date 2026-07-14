# Refactor Workflow

Version: 1.0

Status: Active

Related Documents

- ../constitution.md
- ../routing.md
- ../rules.md
- ../../graph/README.md

---

# 1. Purpose

This workflow governs all source code refactoring activities.

The objective is to improve the internal quality of the software while
preserving its external behavior.

Refactoring must never introduce new business behavior.

---

# 2. Scope

This workflow applies to:

- Code cleanup
- Improve readability
- Reduce complexity
- Remove duplication
- Improve maintainability
- Modularization
- Rename symbols
- Extract methods
- Extract services
- Dependency cleanup

This workflow does NOT apply to:

- New Features
- Business Changes
- Bug Fixes
- Database redesign
- API redesign
- Architecture redesign

---

# 3. Workflow Overview

Refactor Request

↓

Understand Existing Behavior

↓

Architecture Review

↓

Impact Analysis

↓

Refactoring Plan

↓

Implementation

↓

Regression Testing

↓

Documentation Verification

↓

Completion

---

# 4. Understand Existing Behavior

Before modifying any code,

AI shall determine:

- Current behavior
- Existing responsibilities
- Public interfaces
- Dependencies
- Business rules

Read order

Graph

↓

Architecture

↓

Module Documentation

↓

Source Code

↓

Tests

If existing behavior is unclear,

AI shall stop.

---

# 5. Architecture Review

Review

- Module boundaries
- Layer responsibilities
- Dependencies
- Design patterns
- Coupling
- Cohesion

Determine whether refactoring affects architecture.

Architecture redesign requires approval.

---

# 6. Impact Analysis

Use Graph Navigation.

Identify

Affected Module

↓

Dependent Modules

↓

Shared Components

↓

Public APIs

↓

Tests

↓

Documentation

Output

Impact Analysis Summary

---

# 7. Refactoring Plan

AI shall produce a plan before implementation.

Plan should include

Objective

Scope

Files affected

Risk assessment

Rollback strategy

Expected benefits

Possible risks

No implementation begins before the plan is complete.

---

# 8. Implementation

Implementation Rules

- Preserve business behavior.
- Preserve API contracts.
- Preserve database behavior.
- Preserve security.
- Preserve permissions.
- Preserve traceability.

AI should:

- Remove duplication.
- Simplify logic.
- Improve naming.
- Reduce coupling.
- Improve cohesion.

Avoid unnecessary changes.

---

# 9. Regression Testing

Every refactor requires regression testing.

Verify

Existing Tests

↓

Generate Additional Tests if Needed

↓

Run Regression Checklist

Confirm

Behavior Before Refactor

=

Behavior After Refactor

---

# 10. Documentation Verification

Normally,

refactoring should NOT require documentation changes.

Update documentation only if:

- File locations changed.
- Module structure changed.
- Public interfaces changed.
- Developer documentation requires updates.

Business documentation should remain unchanged.

---

# 11. Deliverables

Completed refactoring should produce

✓ Refactoring Plan

✓ Updated Source Code

✓ Regression Test Results

✓ Updated Technical Documentation (if required)

✓ Updated Graph Metadata (if required)

✓ Change Log

---

# 12. Validation Checklist

□ Existing behavior understood

□ Architecture reviewed

□ Impact analyzed

□ Refactoring plan completed

□ Implementation completed

□ Regression tests passed

□ Public interfaces preserved

□ Documentation verified

□ Graph synchronized if necessary

---

# 13. Stop Conditions

AI shall stop when

- Existing behavior is unknown.
- Tests are missing for critical components.
- Architecture approval is required.
- Refactoring changes business behavior.
- Public API changes are required.

AI shall explain

- Why execution stopped.
- Risks involved.
- Required approvals.

---

# 14. Workflow Principles

1. Preserve behavior.
2. Improve code quality.
3. Architecture before implementation.
4. Graph before repository scanning.
5. Small incremental changes.
6. Validate continuously.
7. Regression is mandatory.
8. Documentation only when necessary.
