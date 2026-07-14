# Documentation Workflow

Version: 1.0

Status: Active

Related Documents

- ../constitution.md
- ../routing.md
- ../rules.md
- ../../graph/README.md

---

# 1. Purpose

This workflow governs the creation, modification, review, and synchronization of
all project documentation.

Documentation is the authoritative source of project knowledge.

All implementation should align with documentation.

---

# 2. Scope

This workflow applies to:

- BRD
- PRD
- SRS
- User Flow
- Use Cases
- Architecture Documents
- API Specifications
- Database Documentation
- Module Documentation
- Project Status
- Glossary

It does NOT apply to:

- Source Code
- Test Code
- Build Configuration

---

# 3. Workflow Overview

Documentation Request

↓

Identify Document Type

↓

Locate Related Artifacts

↓

Impact Analysis

↓

Update Documentation

↓

Consistency Review

↓

Traceability Review

↓

Graph Synchronization

↓

Completion

---

# 4. Identify Document Type

Determine which documents require modification.

Possible documents:

- Vision
- BRD
- PRD
- SRS
- Architecture
- API
- Database
- User Flow
- Use Case
- Module Documentation
- Glossary

Multiple documents may be affected.

---

# 5. Locate Related Artifacts

Use Graph Navigation.

Locate:

Requirements

↓

Modules

↓

APIs

↓

Database

↓

Tests

↓

Related Documents

Only retrieve required context.

Never scan the entire repository.

---

# 6. Impact Analysis

Determine the impact of documentation changes.

Review:

- Business Requirements
- Functional Requirements
- Architecture
- APIs
- Database
- Modules
- Tests

Produce an Impact Summary.

---

# 7. Update Documentation

Documentation must be:

- Accurate
- Complete
- Consistent
- Traceable
- Versioned

Maintain existing structure and formatting standards.

Do not remove historical context unless approved.

---

# 8. Consistency Review

Verify consistency across documents.

Review hierarchy:

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

Modules

↓

Implementation

↓

Tests

If inconsistencies exist,

report them.

Do not silently resolve conflicts.

---

# 9. Traceability Review

Verify traceability chain.

Business Rule

↓

Requirement

↓

Use Case

↓

API

↓

Implementation

↓

Test

↓

Documentation

Missing links should be reported.

---

# 10. Graph Synchronization

If documentation introduces:

- New Requirements
- New Modules
- New APIs
- New Databases
- New Use Cases

Graph metadata should be regenerated.

Graph remains an indexing layer,

not the source of truth.

---

# 11. Deliverables

Completed documentation update should include

✓ Updated Documents

✓ Impact Summary

✓ Consistency Review

✓ Traceability Verification

✓ Updated Graph Metadata (if required)

✓ Change Log

---

# 12. Validation Checklist

□ Document identified

□ Related artifacts located

□ Documentation updated

□ Consistency verified

□ Traceability verified

□ Graph synchronized

□ Change Log updated

---

# 13. Stop Conditions

AI shall stop when:

- Source documentation is missing.
- Requirements conflict.
- Approval is required.
- Traceability cannot be established.

AI shall explain:

- Missing information.
- Conflicting artifacts.
- Required actions.

---

# 14. Workflow Principles

1. Documentation is authoritative.
2. Preserve consistency.
3. Preserve traceability.
4. Use Graph for navigation.
5. Update before implementation.
6. Never guess.
7. Validate before completion.
8. Synchronize metadata.
