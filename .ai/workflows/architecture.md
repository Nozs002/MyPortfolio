# Architecture Workflow

Version: 1.0

Status: Active

Related Documents

- ../constitution.md
- ../routing.md
- ../rules.md
- ../../graph/README.md

---

# 1. Purpose

This workflow governs all architectural analysis and design activities.

Architecture defines the long-term technical structure of the system and ensures
scalability, maintainability, security, and consistency.

Implementation must follow architecture.

---

# 2. Scope

This workflow applies to:

- System Architecture
- Module Design
- Service Design
- Database Design
- API Design
- Infrastructure Design
- Integration Design
- Technology Evaluation

It does NOT apply to:

- Bug Fixes
- Business Requirement Changes
- Code Refactoring
- UI Improvements

---

# 3. Workflow Overview

Architecture Request

↓

Understand Business Requirements

↓

Analyze Existing Architecture

↓

Impact Analysis

↓

Evaluate Design Options

↓

Select Architecture

↓

Document Architecture

↓

Validation

↓

Implementation Planning

---

# 4. Understand Business Requirements

Read:

Graph

↓

BRD

↓

PRD

↓

SRS

↓

User Flow

Determine:

- Business goals
- Functional scope
- Constraints
- Non-functional requirements

---

# 5. Analyze Existing Architecture

Review:

- Project Structure
- Module Boundaries
- Services
- APIs
- Database
- Infrastructure

Use Graph Navigation first.

---

# 6. Impact Analysis

Identify:

- Modules
- Services
- APIs
- Database
- Integrations
- Infrastructure
- Security
- Deployment

Generate an Architecture Impact Summary.

---

# 7. Evaluate Design Options

For every major decision,

AI should propose multiple options.

Each option should include:

- Advantages
- Disadvantages
- Complexity
- Risks
- Scalability
- Maintainability

Recommendation should be justified.

---

# 8. Select Architecture

Select the preferred solution according to:

- Business alignment
- Simplicity
- Scalability
- Security
- Maintainability
- Cost

Major architectural decisions require approval.

---

# 9. Documentation

Update:

- Architecture Document
- Project Structure
- API Design
- Database Design
- Module Documentation

Generate Architecture Decision Record if applicable.

---

# 10. Validation

Verify:

- Business alignment
- Requirement coverage
- Scalability
- Security
- Performance
- Consistency
- Traceability

---

# 11. Implementation Planning

Generate:

- Development Tasks
- Migration Tasks
- Testing Tasks
- Deployment Tasks

---

# 12. Deliverables

✓ Updated Architecture

✓ Updated Project Structure

✓ Updated API Design

✓ Updated Database Design

✓ Updated Module Documentation

✓ Architecture Decision Summary

✓ Updated Graph Metadata

---

# 13. Validation Checklist

□ Business understood

□ Existing architecture reviewed

□ Impact analyzed

□ Design evaluated

□ Architecture selected

□ Documentation updated

□ Graph synchronized

---

# 14. Stop Conditions

Stop if:

- Business requirements are unclear.
- Existing architecture is unknown.
- Approval is missing.
- Constraints are undefined.

---

# 15. Workflow Principles

1. Business drives architecture.
2. Architecture before implementation.
3. Simplicity over complexity.
4. Reuse before redesign.
5. Preserve consistency.
6. Design for maintainability.
7. Document every major decision.
8. Validate before implementation.
