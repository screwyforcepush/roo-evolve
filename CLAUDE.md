# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a meta-repository for setting up autonomous engineering systems using Roo Code's multi-mode architecture (ROOMODES). It contains configuration files and documentation for an agent-based development environment that can autonomously handle complex software engineering projects.

## Key Concepts

### ROOMODES Architecture
- **Strategic Layer**: Project vision, requirements, and resource allocation (Specification Writer, Strategy Orchestrator)
- **Squad Layer**: Technical design and work coordination (Squad Commander, Solution Architect)
- **Implementation Layer**: Code generation, testing, and delivery (Code Generator, Test Engineer, Scaffolder)
- **Knowledge Infrastructure**: Central knowledge graph using Memento MCP (Librarian mode)
- **Quality Assurance**: Single-cycle quality reviews (Quality Guardian)

### MCP Servers
The system uses Model Context Protocol (MCP) servers for extended capabilities:
- **perplexity-ask**: Research best practices and technical documentation
- **context7**: Access library documentation
- **memento**: Knowledge graph for decision tracking and project memory

## Common Commands

Since this is a configuration repository, there are no traditional build/test commands. However, when implementing ROOMODES in an actual project:

### Setting up MCP servers:
```bash
# Copy the example MCP configuration
cp .roo/mcp.json.example .roo/mcp.json

# Edit the configuration with your API keys:
# - PERPLEXITY_API_KEY
# - NEO4J_PASSWORD and NEO4J_DATABASE for memento
# - OPENAI_API_KEY for memento embeddings
```

### Using ROOMODES:
1. Copy the `.roomodes` file to your project's root directory
2. Copy the mode-specific rules from `.roo/rules-{mode}/rules.md` to your project
3. Configure MCP servers in `.roo/mcp.json`
4. Use Roo Code extension with mode switching to leverage the autonomous system

## Architecture Highlights

### Communication Flow
- Modes communicate via `switch_mode` for knowledge operations and `new_task` for delegating work
- The Librarian mode serves as a knowledge bus, maintaining project context across all modes
- Quality Guardian provides single-cycle reviews to prevent infinite feedback loops

### Knowledge Graph Schema
Entities follow strict naming conventions:
- `project-{name}`: Project entities
- `spec-{feature}-v{version}`: Specifications
- `wp-{module}-{sequence}`: Work packages
- `design-{module}-{feature}`: Solution designs
- `decision-{module}-{topic}-{date}`: Technical decisions

### Key Design Principles
- **Context Isolation**: Each mode maintains focused context without pollution
- **Decision Traceability**: Every technical choice is captured with rationale
- **Minimal Handoff Loss**: Structured protocols ensure information transfers cleanly
- **Knowledge Centralization**: All critical decisions persist in the knowledge graph
- **Quality Gates**: Built-in reviews without creating loops

## Important Notes

- This repository contains configuration and documentation only - no executable code
- The ROOMODES system is designed for use with Roo Code's VS Code extension
- Auto-approval is expected for autonomous operation
- Each mode has specific rules optimized for GPT-4.1 performance
- The system emphasizes "think-plan-execute-reflect" patterns for all operations