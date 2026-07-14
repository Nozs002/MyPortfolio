---
id: DOC-GLOSSARY
type: glossary
title: glossary
status: approved
version: 1.0
owner: PO
tags:
  - glossary
  - terms
  - vocabulary
related:
  - DOC-VISION
  - DOC-BRD
  - DOC-PRD
last_updated: 2026-07-14
---

# Project Glossary

Version: 1.0

Status: Active

---

# Purpose

This document defines the common terminology used throughout the project.

All documentation, architecture, APIs, source code, tests, and AI agents should
use these terms consistently.

If multiple names exist for the same concept, this glossary defines the official
term.

---

# Naming Convention

| Item                 | Convention  |
| -------------------- | ----------- |
| Business Terms       | Pascal Case |
| Module               | Pascal Case |
| API                  | camelCase   |
| Database Table       | snake_case  |
| Database Column      | snake_case  |
| TypeScript Interface | Pascal Case |
| TypeScript Class     | Pascal Case |
| TypeScript Enum      | Pascal Case |
| Variable             | camelCase   |
| Function             | camelCase   |
| Route                | kebab-case  |
| File                 | kebab-case  |

---

# General Terms

| Term             | Definition                                                                    |
| ---------------- | ----------------------------------------------------------------------------- |
| User             | A person who uses the system.                                                 |
| Administrator    | A user with management permissions.                                           |
| Authentication   | Verifying a user's identity.                                                  |
| Authorization    | Determining what a user is allowed to access.                                 |
| Session          | The authenticated state of a user.                                            |
| Access Token     | Token used to access protected APIs.                                          |
| Refresh Token    | Token used to obtain a new Access Token.                                      |
| Role             | A collection of permissions assigned to a user.                               |
| Permission       | A specific action a user is allowed to perform.                               |
| Audit Log        | Nhật ký ghi lại các hành động quản trị hệ thống phục vụ giám sát bảo mật.     |
| Project Version  | Bản sao lưu lịch sử của dự án tại một thời điểm, phục vụ tính năng khôi phục. |
| Analytics Metric | Chỉ số đo lường tương tác phi danh tính của người dùng (tải CV, xem dự án).   |
| Contact Message  | Tin nhắn hoặc yêu cầu kết nối từ nhà tuyển dụng gửi qua form liên hệ.         |

---

# Business Documents

| Acronym | Meaning                             |
| ------- | ----------------------------------- |
| BRD     | Business Requirements Document      |
| PRD     | Product Requirements Document       |
| SRS     | Software Requirements Specification |
| RTM     | Requirements Traceability Matrix    |
| ADR     | Architecture Decision Record        |
| UC      | Use Case                            |
| NFR     | Non-Functional Requirement          |
| FR      | Functional Requirement              |

---

# Requirement IDs

| Prefix | Description            |
| ------ | ---------------------- |
| BR     | Business Requirement   |
| FR     | Functional Requirement |
| REQ    | System Requirement     |
| UC     | Use Case               |
| BRULE  | Business Rule          |
| API    | API Specification      |
| DB     | Database Object        |
| UI     | User Interface         |
| TC     | Test Case              |

Examples:

BR-001

FR-001

REQ-001

UC-001

API-001

TC-001

---

# Project Modules

| Module         | Description                           |
| -------------- | ------------------------------------- |
| Authentication | User authentication and authorization |
| Portfolio      | Portfolio management                  |
| Project        | Personal projects showcase            |
| Experience     | Work experience management            |
| Education      | Education management                  |
| Skills         | Skills management                     |
| Certificate    | Certificate management                |
| Contact        | Contact form                          |
| Media          | Image and file management             |
| Dashboard      | Administration dashboard              |
| Settings       | System settings                       |

---

# Architecture Terms

| Term       | Definition                         |
| ---------- | ---------------------------------- |
| Module     | A logical business component.      |
| Component  | A reusable UI element.             |
| Service    | Business logic implementation.     |
| Repository | Data access layer.                 |
| Entity     | Database domain object.            |
| DTO        | Data Transfer Object.              |
| API        | Application Programming Interface. |
| Controller | HTTP request handler.              |

---

# Development Terms

| Term            | Definition                                      |
| --------------- | ----------------------------------------------- |
| Feature         | A deliverable business capability.              |
| Bug             | Incorrect system behavior.                      |
| Refactor        | Internal improvement without changing behavior. |
| Enhancement     | Improvement to existing functionality.          |
| Breaking Change | A change that affects compatibility.            |

---

# Testing Terms

| Term             | Definition                                  |
| ---------------- | ------------------------------------------- |
| Unit Test        | Tests an individual unit of code.           |
| Integration Test | Tests interactions between modules.         |
| Regression Test  | Ensures existing functionality still works. |
| Acceptance Test  | Validates business requirements.            |

---

# AI Terms

| Term                | Definition                                     |
| ------------------- | ---------------------------------------------- |
| Orchestrator        | Coordinates workflows and delegates tasks.     |
| Documentation Agent | Responsible for documentation updates.         |
| Development Agent   | Responsible for implementation.                |
| Workflow            | Standard Operating Procedure executed by AI.   |
| Context             | Information loaded before reasoning.           |
| Impact Analysis     | Analysis of affected artifacts before changes. |

---

# Source of Truth

Priority of project artifacts:

Business Vision

↓

BRD

↓

PRD

↓

SRS

↓

Architecture

↓

Implementation

↓

Tests

---

# Reserved Keywords

The following terms should always remain in English:

- Login
- Logout
- Authentication
- Authorization
- Access Token
- Refresh Token
- API
- Module
- Service
- Repository
- Controller
- DTO
- Entity
- Requirement
- Business Rule
- Workflow
- Architecture
- Refactor

---

# Synonyms

Use the official terminology below.

| Avoid    | Use                |
| -------- | ------------------ |
| Sign In  | Login              |
| Sign Out | Logout             |
| Member   | User               |
| Client   | User               |
| Screen   | Page               |
| Endpoint | API                |
| Function | Feature (business) |
| Function | Method (code)      |

---

# AI Guidelines

AI should:

- Use the terminology defined in this document.
- Never invent new business terms.
- Keep naming consistent across documentation and source code.
- Prefer existing terminology over creating alternatives.
- Ask for clarification when terminology is ambiguous.

---

# Maintenance

This glossary should be updated whenever:

- A new business term is introduced.
- A new module is created.
- A new architectural concept is adopted.
- Naming conventions change.
