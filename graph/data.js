window.graphNodes = [
  {
    "id": "DOC-RULES",
    "label": "business-rules",
    "type": "business_rule",
    "path": "docs/analysis/business-rules.md",
    "description": []
  },
  {
    "id": "DOC-SRS",
    "label": "srs",
    "type": "document",
    "path": "docs/analysis/srs.md",
    "description": ""
  },
  {
    "id": "DOC-USE-CASES",
    "label": "use-cases",
    "type": "use_case",
    "path": "docs/analysis/use-cases.md",
    "description": "Interactive use cases for portfolio owners and recruiters."
  },
  {
    "id": "DOC-USER-FLOWS",
    "label": "user-flows",
    "type": "user_flow",
    "path": "docs/analysis/user-flows.md",
    "description": []
  },
  {
    "id": "DOC-ARCH-API",
    "label": "api",
    "type": "api",
    "path": "docs/architecture/api.md",
    "description": []
  },
  {
    "id": "DOC-ARCHITECTURE",
    "label": "architecture",
    "type": "architecture",
    "path": "docs/architecture/architecture.md",
    "description": ""
  },
  {
    "id": "DOC-ARCH-DATABASE",
    "label": "database",
    "type": "database",
    "path": "docs/architecture/database.md",
    "description": ""
  },
  {
    "id": "DOC-CHANGES",
    "label": "changes",
    "type": "document",
    "path": "docs/changelog/changes.md",
    "description": ""
  },
  {
    "id": "DOC-GLOSSARY",
    "label": "glossary",
    "type": "document",
    "path": "docs/project/glossary.md",
    "description": ""
  },
  {
    "id": "DOC-METADATA-SCHEMA",
    "label": "metadata-schema",
    "type": "document",
    "path": "docs/project/metadata-schema.md",
    "description": ""
  },
  {
    "id": "DOC-PROJECT-STRUCTURE",
    "label": "project-structure",
    "type": "document",
    "path": "docs/project/project-structure.md",
    "description": ""
  },
  {
    "id": "DOC-STATUS",
    "label": "status",
    "type": "document",
    "path": "docs/project/status.md",
    "description": ""
  },
  {
    "id": "DOC-TECH-STACK",
    "label": "tech-stack",
    "type": "document",
    "path": "docs/project/tech-stack.md",
    "description": ""
  },
  {
    "id": "DOC-VISION",
    "label": "vision",
    "type": "document",
    "path": "docs/project/vision.md",
    "description": ""
  },
  {
    "id": "DOC-BRD",
    "label": "brd",
    "type": "requirement",
    "path": "docs/requirements/brd.md",
    "description": ""
  },
  {
    "id": "DOC-PRD",
    "label": "prd",
    "type": "requirement",
    "path": "docs/requirements/prd.md",
    "description": ""
  },
  {
    "id": "DOC-RTM",
    "label": "rtm",
    "type": "requirement",
    "path": "docs/requirements/rtm.md",
    "description": "Matrix mapping requirements to design, code, and test artifacts."
  },
  {
    "id": "DOC-UI-GUIDELINES",
    "label": "ui-guidelines",
    "type": "ui",
    "path": "docs/ui/ui-guidelines.md",
    "description": []
  },
  {
    "id": "modules/sample-module/api.md",
    "label": "api",
    "type": "document",
    "path": "modules/sample-module/api.md",
    "description": ""
  },
  {
    "id": "modules/sample-module/flow.md",
    "label": "flow",
    "type": "document",
    "path": "modules/sample-module/flow.md",
    "description": ""
  },
  {
    "id": "modules/sample-module/overview.md",
    "label": "overview",
    "type": "document",
    "path": "modules/sample-module/overview.md",
    "description": ""
  },
  {
    "id": "modules/sample-module/requirements.md",
    "label": "requirements",
    "type": "document",
    "path": "modules/sample-module/requirements.md",
    "description": ""
  },
  {
    "id": "SRC-NEXTAUTH-HANDLER",
    "label": "route.ts",
    "type": "source",
    "path": "src/app/api/auth/[...nextauth]/route.ts",
    "description": "Source Code: route.ts"
  },
  {
    "id": "SRC-AUDIT-UTIL",
    "label": "audit.ts",
    "type": "source",
    "path": "src/lib/audit.ts",
    "description": "Source Code: audit.ts"
  },
  {
    "id": "SRC-PRISMA-CLIENT",
    "label": "prisma.ts",
    "type": "source",
    "path": "src/lib/prisma.ts",
    "description": "Source Code: prisma.ts"
  }
];
window.graphEdges = [
  {
    "source": "DOC-RULES",
    "target": "DOC-BRD",
    "relation": "depends_on"
  },
  {
    "source": "DOC-SRS",
    "target": "DOC-PRD",
    "relation": "depends_on"
  },
  {
    "source": "DOC-USE-CASES",
    "target": "DOC-PRD",
    "relation": "depends_on"
  },
  {
    "source": "DOC-USER-FLOWS",
    "target": "DOC-USE-CASES",
    "relation": "depends_on"
  },
  {
    "source": "DOC-ARCH-API",
    "target": "DOC-PRD",
    "relation": "depends_on"
  },
  {
    "source": "DOC-ARCHITECTURE",
    "target": "DOC-SRS",
    "relation": "depends_on"
  },
  {
    "source": "DOC-ARCH-DATABASE",
    "target": "DOC-ARCHITECTURE",
    "relation": "depends_on"
  },
  {
    "source": "DOC-GLOSSARY",
    "target": "DOC-VISION",
    "relation": "related_to"
  },
  {
    "source": "DOC-GLOSSARY",
    "target": "DOC-BRD",
    "relation": "related_to"
  },
  {
    "source": "DOC-GLOSSARY",
    "target": "DOC-PRD",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-VISION",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-BRD",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-PRD",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-SRS",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-RULES",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-USE-CASES",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-USER-FLOWS",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-ARCHITECTURE",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-ARCH-API",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-ARCH-DATABASE",
    "relation": "related_to"
  },
  {
    "source": "DOC-STATUS",
    "target": "DOC-RTM",
    "relation": "related_to"
  },
  {
    "source": "DOC-BRD",
    "target": "DOC-VISION",
    "relation": "depends_on"
  },
  {
    "source": "DOC-PRD",
    "target": "DOC-BRD",
    "relation": "depends_on"
  },
  {
    "source": "DOC-RTM",
    "target": "DOC-PRD",
    "relation": "depends_on"
  },
  {
    "source": "DOC-RTM",
    "target": "DOC-BRD",
    "relation": "depends_on"
  },
  {
    "source": "DOC-SRS",
    "target": "SRC-NEXTAUTH-HANDLER",
    "relation": "implements"
  },
  {
    "source": "SRC-NEXTAUTH-HANDLER",
    "target": "DOC-RULES",
    "relation": "references"
  },
  {
    "source": "SRC-NEXTAUTH-HANDLER",
    "target": "SRC-AUDIT-UTIL",
    "relation": "uses"
  },
  {
    "source": "DOC-BRD",
    "target": "SRC-AUDIT-UTIL",
    "relation": "implements"
  },
  {
    "source": "SRC-AUDIT-UTIL",
    "target": "DOC-RULES",
    "relation": "references"
  },
  {
    "source": "SRC-AUDIT-UTIL",
    "target": "SRC-PRISMA-CLIENT",
    "relation": "uses"
  }
];
