---
id: DOC-METADATA-SCHEMA
type: document
title: metadata-schema
status: approved
version: 1.0
owner: PO
tags:
  - metadata
  - schema
  - graph
last_updated: 2026-07-14
---

# Project Knowledge Graph Metadata Schema v1.0

This document is the **Single Source of Truth (SSOT)** for project architecture
indexing and navigation. All agents (Documentation, Graph, Development, and QA)
must read and comply with this schema before creating or updating any file.

---

## 1. ID Naming Convention

Every node in the knowledge graph must have an ID that satisfies three rules:

1. **Unique** across the entire project.
2. **Predictable** (the object type can be inferred from the prefix).
3. **Persistent** (does not change when files are moved or renamed).

### Format

```text
<PREFIX>-<MODULE>-<NUMBER>
```

_Example: `REQ-AUTH-001`, `MOD-AUTH`, `API-AUTH-LOGIN`, `DB-USERS`_

### Standard Prefixes

| Category      | Prefix   | Example          | Description                        |
| ------------- | -------- | ---------------- | ---------------------------------- |
| Project       | **PROJ** | `PROJ-TEMPLATE`  | Top-level project identifier       |
| Module        | **MOD**  | `MOD-AUTH`       | System module or boundary          |
| Requirement   | **REQ**  | `REQ-AUTH-001`   | System or business requirement     |
| Business Rule | **BR**   | `BR-AUTH-001`    | Specific business rule             |
| Use Case      | **UC**   | `UC-AUTH-001`    | User use case description          |
| User Flow     | **FLOW** | `FLOW-AUTH-001`  | Sequential user flow mapping       |
| API           | **API**  | `API-AUTH-LOGIN` | Web endpoint/service               |
| Database      | **DB**   | `DB-USERS`       | Main database schema instance      |
| Table         | **TBL**  | `TBL-USERS`      | Specific database table            |
| Architecture  | **ARCH** | `ARCH-001`       | Architectural design diagrams/docs |
| UI Screen     | **UI**   | `UI-LOGIN`       | Layout screen wireframe/view       |
| Component     | **CMP**  | `CMP-LOGIN-FORM` | Code component UI                  |
| Test Case     | **TEST** | `TEST-AUTH-001`  | Verification test case             |
| Source File   | **SRC**  | `SRC-AUTH-LOGIN` | Source code file boundary          |
| Document      | **DOC**  | `DOC-PRD`        | Documentation files                |

---

## 2. Metadata Schema (YAML Front Matter)

Every Markdown file in the project must start with a YAML block conforming to
this format:

```yaml
---
id: REQ-AUTH-001
type: requirement
title: User Login
module: MOD-AUTH
status: approved
version: 1.0
owner: BA
tags:
  - authentication
  - login
related:
  - API-AUTH-LOGIN
  - BR-AUTH-001
documents:
  - modules/auth/api.md
depends_on:
  - DB-USERS
implemented_by:
  - SRC-AUTH-LOGIN
tested_by:
  - TEST-AUTH-001
last_updated: 2026-07-10
---
```

---

## 3. Standard Node Types

Only the following 15 node types are permitted: `project`, `document`, `module`,
`requirement`, `business_rule`, `use_case`, `user_flow`, `api`, `database`,
`table`, `architecture`, `ui`, `component`, `source`, `test`.

---

## 4. Standard Relationship Types (Edges)

Only the following 12 edge relationships are permitted in `edges.json`:

- **`contains`**: Parent folder contains file (Folder tree hierarchy).
- **`belongs_to`**: Entity belongs logically to a Module domain.
- **`implements`**: Code service or flow implements a Usecase/Requirement.
- **`references`**: Code file mentions/is bound by a Business Rule.
- **`depends_on`**: Structural dependency between modules, databases, or APIs.
- **`uses`**: Functional call between APIs, database tables, or UI components.
- **`calls`**: Synchronous or asynchronous API-to-API calls.
- **`documents`**: Requirement or design maps to a sub-document.
- **`tested_by`**: Test verification links.
- **`extends`**: Class or Interface extensions.
- **`inherits`**: Class inheritance.
- **`related_to`**: Bidirectional association links.

---

## 5. Status Catalogue

Only the following 5 statuses are permitted in metadata: `draft`, `review`,
`approved`, `deprecated`, `archived`.

---

## 6. Code Annotations (JSDoc Comments)

Source code files must declare their ID and relationships using structured
comments rather than scanning raw strings:

```typescript
/**
 * @id SRC-AUTH-LOGIN
 * @implements REQ-AUTH-001
 * @references BR-AUTH-001
 * @usecase UC-AUTH-001
 * @belongs_to MOD-AUTH
 */
```

---

## 7. Mandatory Rules for AI Agents

1. **YAML Front Matter**: Every Markdown file must start with valid YAML Front
   Matter.
2. **ID Requirement**: Every entity (document, database, feature, source) must
   be assigned an ID.
3. **No Text References**: Never link objects using descriptive names. Only link
   using registered IDs.
4. **JSDoc Parsing**: Graph Agents only read JSDoc headers inside code. They do
   not scan raw strings.
5. **No AI Inference**: Relationships must be explicitly defined in comments or
   YAML metadata; agents must not infer them.
