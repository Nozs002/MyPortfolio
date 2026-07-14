import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Define structures matching Schema v1.0
interface GraphNode {
  id: string;
  label: string;
  type: string;
  module?: string;
  path?: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface GraphEdge {
  source: string;
  target: string;
  relation: string;
  description?: string;
}

// Configuration
let currentDirname: string;
try {
  currentDirname =
    typeof __dirname !== 'undefined'
      ? __dirname
      : path.dirname(fileURLToPath(import.meta.url));
} catch (e) {
  currentDirname = process.cwd();
}

const ROOT_DIR = path.resolve(currentDirname, '..');
const OUTPUT_NODES = path.resolve(currentDirname, 'nodes.json');
const OUTPUT_EDGES = path.resolve(currentDirname, 'edges.json');

const IGNORE_DIRS = new Set([
  '.git',
  '.github',
  '.agents',
  '.ai',
  'node_modules',
  'graph',
  'dist',
  '.next',
  'out',
  'build',
]);
const IGNORE_FILES = new Set([
  'package-lock.json',
  '.gitignore',
  'README.md',
  'readme.md',
  'README-TECH.md',
  'readme-tech.md',
  'README.vi.md',
  'readme.vi.md',
  'CONTRIBUTING.md',
  'contributing.md',
  'branching-strategy.md',
]);

const VALID_TYPES = new Set([
  'project',
  'document',
  'module',
  'requirement',
  'business_rule',
  'use_case',
  'user_flow',
  'api',
  'database',
  'table',
  'architecture',
  'ui',
  'component',
  'source',
  'test',
]);

const nodes: Map<string, GraphNode> = new Map();
const edges: GraphEdge[] = [];
const filePathToIdMap: Map<string, string> = new Map();
const markdownFilePaths: string[] = [];
const codeFilePaths: string[] = [];

// Helper to standardise paths to relative slashes
function toRelativePath(absolutePath: string): string {
  const rel = path.relative(ROOT_DIR, absolutePath).replace(/\\/g, '/');
  return rel || '.';
}

// Simple YAML Front Matter Parser (regex-free line scanner)
function parseYAML(yamlText: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yamlText.split('\n');
  let currentKey = '';

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('-')) {
      // List element
      const val = trimmed
        .substring(1)
        .trim()
        .replace(/^["']|["']$/g, '');
      if (currentKey) {
        if (!Array.isArray(result[currentKey])) {
          result[currentKey] = [];
        }
        result[currentKey].push(val);
      }
    } else if (trimmed.includes(':')) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIdx).trim();
      const val = trimmed
        .substring(colonIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, '');

      currentKey = key;
      if (val === '') {
        result[key] = [];
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

// 1. Recursive file scanner to list Markdown and Code files
function scanDirectory(dirPath: string) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stats = fs.statSync(fullPath);
    const relPath = toRelativePath(fullPath);

    if (stats.isDirectory()) {
      if (IGNORE_DIRS.has(item)) continue;
      scanDirectory(fullPath);
    } else {
      if (IGNORE_FILES.has(item)) continue;

      const ext = path.extname(item).toLowerCase();
      if (ext === '.md') {
        markdownFilePaths.push(relPath);
      } else if (
        [
          '.ts',
          '.js',
          '.tsx',
          '.jsx',
          '.py',
          '.go',
          '.java',
          '.cs',
          '.cpp',
        ].includes(ext)
      ) {
        codeFilePaths.push(relPath);
      }
    }
  }
}

// 2. Parse YAML Front Matter from Markdown files
function processMarkdownFiles() {
  const yamlRegex = /^---\r?\n([\s\S]*?)\r?\n---/;

  for (const relPath of markdownFilePaths) {
    const fullPath = path.join(ROOT_DIR, relPath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const match = content.match(yamlRegex);

    let id = '';
    let label = path.basename(relPath, '.md');
    let type = 'document';
    let yamlData: any = null;

    if (match) {
      yamlData = parseYAML(match[1]);
      if (yamlData.id) {
        id = String(yamlData.id).trim();
      }
      if (yamlData.type) {
        type = String(yamlData.type).trim().toLowerCase();
      }
      if (yamlData.title) {
        label = yamlData.title;
      }
    }

    if (!id) {
      // Fallback path-based ID matching Schema v1.0
      id = relPath;
    }

    // Validate node type
    const validatedType = VALID_TYPES.has(type) ? type : 'document';

    // Register Node
    nodes.set(id, {
      id: id,
      label: label,
      type: validatedType,
      module: yamlData?.module,
      path: relPath,
      description: yamlData?.description || '',
      metadata: yamlData || {},
    });

    // Record path-to-ID mapping
    filePathToIdMap.set(relPath, id);
  }
}

// 3. Process relationships declared in YAML Front Matter
function processYAMLRelationships() {
  for (const [id, node] of nodes.entries()) {
    const yaml = node.metadata;
    if (!yaml) continue;

    // belongs_to Module
    if (yaml.module) {
      edges.push({
        source: id,
        target: String(yaml.module).trim(),
        relation: 'belongs_to',
        description: 'Module domain mapping',
      });
    }

    // related_to association
    if (Array.isArray(yaml.related)) {
      yaml.related.forEach((targetId: any) => {
        edges.push({
          source: id,
          target: String(targetId).trim(),
          relation: 'related_to',
        });
      });
    }

    // documents relationship
    if (Array.isArray(yaml.documents)) {
      yaml.documents.forEach((docPath: any) => {
        const resolvedId = filePathToIdMap.get(String(docPath).trim());
        if (resolvedId) {
          edges.push({
            source: id,
            target: resolvedId,
            relation: 'documents',
          });
        }
      });
    }

    // depends_on dependency
    if (Array.isArray(yaml.depends_on)) {
      yaml.depends_on.forEach((targetId: any) => {
        edges.push({
          source: id,
          target: String(targetId).trim(),
          relation: 'depends_on',
        });
      });
    }

    // implements relationship
    if (Array.isArray(yaml.implemented_by)) {
      yaml.implemented_by.forEach((targetId: any) => {
        edges.push({
          source: id,
          target: String(targetId).trim(),
          relation: 'implements',
        });
      });
    }

    // tested_by relationship
    if (Array.isArray(yaml.tested_by)) {
      yaml.tested_by.forEach((targetId: any) => {
        edges.push({
          source: id,
          target: String(targetId).trim(),
          relation: 'tested_by',
        });
      });
    }
  }
}

// 4. Parse Standard Markdown links and Wiki links between Markdown files
function processMarkdownLinks() {
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

  for (const relPath of markdownFilePaths) {
    const sourceId = filePathToIdMap.get(relPath);
    if (!sourceId) continue; // Only parse links if the source document is registered

    const fullPath = path.join(ROOT_DIR, relPath);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Standard markdown links
    let match;
    while ((match = markdownLinkRegex.exec(content)) !== null) {
      const linkTarget = match[2];
      if (
        linkTarget.startsWith('http://') ||
        linkTarget.startsWith('https://') ||
        linkTarget.startsWith('#')
      ) {
        continue;
      }

      const dirOfFile = path.dirname(fullPath);
      try {
        const resolvedAbsTarget = path.resolve(dirOfFile, linkTarget);
        const resolvedRelTarget = toRelativePath(resolvedAbsTarget);

        const targetId = filePathToIdMap.get(resolvedRelTarget);
        if (targetId) {
          edges.push({
            source: sourceId,
            target: targetId,
            relation: 'links',
            description: `Link: ${match[1]}`,
          });
        }
      } catch (e) {
        // Ignore resolution errors
      }
    }

    // Wiki-links [[target]]
    let wikiMatch;
    while ((wikiMatch = wikiLinkRegex.exec(content)) !== null) {
      const targetName = wikiMatch[1].trim();
      const wikiLabel = wikiMatch[2] ? wikiMatch[2].trim() : targetName;

      // Match targetName directly to Node ID or label
      const matchedNode = Array.from(nodes.values()).find(
        (n) =>
          n.id === targetName ||
          n.label === targetName ||
          n.id.toUpperCase() === targetName.toUpperCase(),
      );

      if (matchedNode) {
        edges.push({
          source: sourceId,
          target: matchedNode.id,
          relation: 'links',
          description: `Wiki-link: ${wikiLabel}`,
        });
      }
    }
  }
}

// 5. Parse JSDoc structured comments in code files
function processCodeFiles() {
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;

  for (const relPath of codeFilePaths) {
    const fullPath = path.join(ROOT_DIR, relPath);
    const content = fs.readFileSync(fullPath, 'utf-8');

    let jsdocMatch;
    while ((jsdocMatch = jsdocRegex.exec(content)) !== null) {
      const block = jsdocMatch[1];

      const idMatch = /@id\s+([a-zA-Z0-9\-_]+)/i.exec(block);
      if (idMatch) {
        const sourceId = idMatch[1].trim();
        const filename = path.basename(relPath);

        // Register code file as a 'source' node
        nodes.set(sourceId, {
          id: sourceId,
          label: filename,
          type: 'source',
          path: relPath,
          description: `Source Code: ${filename}`,
        });

        // Parse JSDoc relationships:
        // @implements <REQ-ID> -> Requirement implements Code (source: REQ, target: SRC, relation: implements)
        const implementsRegex = /@implements\s+([a-zA-Z0-9\-_]+)/gi;
        let implMatch;
        while ((implMatch = implementsRegex.exec(block)) !== null) {
          edges.push({
            source: implMatch[1].trim(),
            target: sourceId,
            relation: 'implements',
          });
        }

        // @usecase <UC-ID> -> Usecase implements Code (source: UC, target: SRC, relation: implements)
        const usecaseRegex = /@usecase\s+([a-zA-Z0-9\-_]+)/gi;
        let ucMatch;
        while ((ucMatch = usecaseRegex.exec(block)) !== null) {
          edges.push({
            source: ucMatch[1].trim(),
            target: sourceId,
            relation: 'implements',
          });
        }

        // @references <BR-ID> -> Code references Business Rule (source: SRC, target: BR, relation: references)
        const referencesRegex = /@references\s+([a-zA-Z0-9\-_]+)/gi;
        let refMatch;
        while ((refMatch = referencesRegex.exec(block)) !== null) {
          edges.push({
            source: sourceId,
            target: refMatch[1].trim(),
            relation: 'references',
          });
        }

        // @belongs_to <MOD-ID> -> Code belongs_to Module (source: SRC, target: MOD, relation: belongs_to)
        const belongsRegex = /@belongs_to\s+([a-zA-Z0-9\-_]+)/gi;
        let belongsMatch;
        while ((belongsMatch = belongsRegex.exec(block)) !== null) {
          edges.push({
            source: sourceId,
            target: belongsMatch[1].trim(),
            relation: 'belongs_to',
          });
        }

        // @depends_on <ID> -> Code depends_on target (source: SRC, target: ID, relation: depends_on)
        const dependsRegex = /@depends_on\s+([a-zA-Z0-9\-_]+)/gi;
        let depMatch;
        while ((depMatch = dependsRegex.exec(block)) !== null) {
          edges.push({
            source: sourceId,
            target: depMatch[1].trim(),
            relation: 'depends_on',
          });
        }

        // @uses <ID> -> Code uses target (source: SRC, target: ID, relation: uses)
        const usesRegex = /@uses\s+([a-zA-Z0-9\-_]+)/gi;
        let useMatch;
        while ((useMatch = usesRegex.exec(block)) !== null) {
          edges.push({
            source: sourceId,
            target: useMatch[1].trim(),
            relation: 'uses',
          });
        }
      }
    }
  }
}

// 6. Main Orchestrator
function main() {
  console.log('Scanning directories starting at project root...');
  scanDirectory(ROOT_DIR);

  console.log(
    `Processing ${markdownFilePaths.length} Markdown files for YAML Metadata...`,
  );
  processMarkdownFiles();

  console.log('Generating relationships from YAML Front Matter...');
  processYAMLRelationships();

  console.log('Parsing Markdown links and Wiki-links...');
  processMarkdownLinks();

  console.log(
    `Processing ${codeFilePaths.length} Code files for JSDoc annotations...`,
  );
  processCodeFiles();

  // Clean metadata field on nodes before writing to keep output lightweight
  const finalNodes = Array.from(nodes.values()).map((node) => {
    const { metadata, ...cleanNode } = node;
    return cleanNode;
  });

  // Write files
  console.log(`Writing ${finalNodes.length} nodes to: ${OUTPUT_NODES}`);
  fs.writeFileSync(OUTPUT_NODES, JSON.stringify(finalNodes, null, 2), 'utf-8');

  console.log(`Writing ${edges.length} edges to: ${OUTPUT_EDGES}`);
  fs.writeFileSync(OUTPUT_EDGES, JSON.stringify(edges, null, 2), 'utf-8');

  console.log(
    'Knowledge Graph generation completed successfully under Schema v1.0!',
  );
}

main();
