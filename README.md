# ROOMODES - Autonomous Engineering System for Roo Code

## Transform Your Development Workflow with Intelligent Agent Orchestration

Imagine a development environment where vague requirements transform into production-ready code autonomously. Where technical decisions are researched, evaluated, and documented with traceable rationale. Where your entire project history lives in a queryable knowledge graph that never forgets why decisions were made.

**ROOMODES** is a state-of-the-art autonomous engineering system that transforms Roo Code into a sophisticated multi-agent development platform. Built on proven principles of context isolation, decision traceability, and knowledge centralization, ROOMODES enables true autonomous software development from specification through implementation.

### 🎯 Why ROOMODES?

**Context Isolation** - Each specialized agent maintains laser-focused context without pollution from unrelated discussions. Your specification refinement never bleeds into implementation details. Your architecture decisions stay pure.

**Decision Traceability** - Every architectural choice, every technical decision, every implementation detail is captured with its rationale in a persistent knowledge graph. Six months later, you'll know exactly why that framework was chosen.

**Zero Handoff Loss** - Structured communication protocols ensure essential information transfers perfectly between agents. No more "lost in translation" between design and implementation.

**True Autonomy** - Agents persist until work is complete. They research best practices, discover patterns in your codebase, make informed decisions, and escalate only when truly blocked. Set it and forget it.

**Quality Without Loops** - Built-in review cycles prevent defects while avoiding infinite critique loops. Single-pass quality reviews keep momentum while maintaining standards.

### 🌟 The ROOMODES Advantage

Traditional development tools assist. ROOMODES **delivers**. 

While others offer code completion, ROOMODES offers **project completion**. From a single requirement to a fully-tested, production-ready implementation - autonomously orchestrated by specialized agents that never lose context, never forget decisions, and never stop until the job is done.

Built on Roo Code's powerful multi-mode architecture and enhanced with MCP (Model Context Protocol) integration, ROOMODES represents the next evolution in software development automation.

## 🚀 Quick Start

1. **Install Roo Code Extension**
   - Install the Roo Code VS Code extension from the marketplace
   - Ensure you have access to custom modes feature

2. **Copy Configuration Files**
   ```bash
   # Copy the modes configuration to your project
   cp .roomodes /path/to/your/project/
   
   # Copy mode-specific rules
   cp -r .roo/rules-* /path/to/your/project/.roo/
   
   # Copy and configure MCP servers
   cp .roo/mcp.json.example /path/to/your/project/.roo/mcp.json
   ```

3. **Configure MCP Servers**
   Edit `.roo/mcp.json` and add your API keys:
   - `PERPLEXITY_API_KEY`: For technical research
   - `NEO4J_PASSWORD` & `NEO4J_DATABASE`: For knowledge graph
   - `OPENAI_API_KEY`: For semantic search in knowledge graph

4. **Start Using ROOMODES**
   - Open your project in VS Code with Roo Code extension
   - Use `/mode` command to switch between modes
   - Start with Strategy Orchestrator for new projects

## 🏗️ System Architecture

ROOMODES implements a layered architecture with specialized AI agents:

### Strategic Layer
- **📋 Specification Writer**: Transforms vague requirements into detailed work packages
- **🔭 Strategy Orchestrator**: Manages project vision and allocates work

### Squad Layer
- **👑 Squad Commander**: Coordinates implementation of work packages
- **🏗️ Solution Architect**: Creates technical designs and makes technology decisions

### Implementation Layer
- **💻 Code Generator**: Writes production code following project patterns
- **🧪 Test Engineer**: Creates comprehensive test suites
- **🧰 Scaffolder**: Sets up development environments (on-demand)

### Support Services
- **📖 Librarian**: Manages knowledge graph for project memory
- **🔍 Quality Guardian**: Provides single-cycle quality reviews

## 📚 How It Works

### 1. Starting a New Project
```
/mode orchestrator
"I need to build a user authentication system with email verification"
```
The orchestrator will:
- Check for existing specifications
- Delegate to Specification Writer if needed
- Create work packages
- Assign to Squad Commanders

### 2. Work Package Flow
Each work package follows this path:
1. Squad Commander receives assignment
2. Solution Architect creates technical design
3. Quality Guardian reviews design
4. Code Generator implements
5. Test Engineer validates
6. Final quality review

### 3. Knowledge Management
All decisions, progress, and technical choices are automatically captured in a knowledge graph via the Librarian mode. This ensures:
- No context is lost between sessions
- Decisions have traceable rationale
- Progress is continuously tracked
- Escalations are properly handled

## 🛠️ Key Features

### Autonomous Operation
- Agents persist until tasks are complete
- Automatic escalation for blockers
- Self-organizing squads based on work requirements
- Continuous progress without manual intervention

### Quality Assurance
- Single-cycle reviews prevent infinite loops
- Distinguishes blocking issues from nice-to-haves
- Enforces project patterns and standards
- Automated testing at every level

### Research Integration
- Best practices research via Perplexity
- Library documentation via Context7
- Pattern discovery in existing codebases
- Technology evaluation with rationale

## 📋 Mode Commands

### Switching Modes
```
/mode specification-writer  # Start requirement gathering
/mode orchestrator         # Manage project strategy
/mode squad-commander      # Coordinate implementation
/mode architect           # Design technical solutions
/mode code               # Write implementation code
/mode test-engineer      # Create test suites
/mode scaffolder        # Setup development environment
/mode librarian         # Access project knowledge
/mode quality-guardian  # Review deliverables
```

### Common Workflows

**New Feature Development:**
1. Start with orchestrator
2. It delegates to specification-writer if needed
3. Creates work packages
4. Assigns to squads
5. Implementation proceeds autonomously

**Bug Fix:**
1. Use squad-commander directly
2. Provide bug details
3. It coordinates fix implementation
4. Ensures tests are added

**Technical Research:**
1. Use architect mode
2. It researches best practices
3. Documents decisions
4. Creates implementation guide

## 🔧 Configuration

### MCP Servers Setup

The system uses three MCP servers:

1. **Perplexity Ask** - Technical research
   ```json
   "PERPLEXITY_API_KEY": "your-key-here"
   ```

2. **Context7** - Library documentation
   ```json
   No configuration needed (uses npx)
   ```

3. **Memento** - Knowledge graph
   ```json
   "NEO4J_URI": "bolt://127.0.0.1:7687",
   "NEO4J_USERNAME": "neo4j",
   "NEO4J_PASSWORD": "your-password",
   "NEO4J_DATABASE": "your-database",
   "OPENAI_API_KEY": "your-openai-key"
   ```

### Customizing Modes

Each mode's behavior is defined in:
- `.roomodes`: Mode definitions and permissions
- `.roo/rules-{mode}/rules.md`: Detailed behavioral rules

You can customize these for your team's specific needs.

## 📖 Best Practices

1. **Let the System Work**: Don't interrupt autonomous operations
2. **Trust the Process**: Agents will escalate if truly blocked
3. **Provide Context**: Better initial requirements = better results
4. **Review Knowledge Graph**: Periodically check captured decisions
5. **Monitor Progress**: Use orchestrator to check project status

## 🚨 Troubleshooting

**Agents seem stuck:**
- Check for escalations in orchestrator mode
- Review recent decisions in librarian mode
- Ensure MCP servers are properly configured

**Quality issues:**
- Quality Guardian enforces standards
- Check if patterns are properly discovered
- Ensure test coverage requirements are met

**Knowledge not persisting:**
- Verify Memento MCP server is running
- Check Neo4j connection settings
- Ensure API keys are valid

## 🤝 Contributing

This is a configuration repository. To contribute:
1. Test improvements in real projects
2. Document what works well
3. Submit PRs with clear rationale
4. Include examples of successful usage

## 📜 License

This project is licensed under the MIT License - see LICENSE file for details.

---

Built with ❤️ for autonomous engineering