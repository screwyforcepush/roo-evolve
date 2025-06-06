# Tools Def 

## ask_followup_question
Description: Ask the user a question to gather additional information needed to complete the task. This tool should be used when you encounter ambiguities, need clarification, or require more details to proceed effectively. It allows for interactive problem-solving by enabling direct communication with the user. Use this tool judiciously to maintain a balance between gathering necessary information and avoiding excessive back-and-forth.
Parameters:
- question: (required) The question to ask the user. This should be a clear, specific question that addresses the information you need.
- follow_up: (required) A list of 2-4 suggested answers that logically follow from the question, ordered by priority or logical sequence. Each suggestion must:
  1. Be provided in its own <suggest> tag
  2. Be specific, actionable, and directly related to the completed task
  3. Be a complete answer to the question - the user should not need to provide additional information or fill in any missing details. DO NOT include placeholders with brackets or parentheses.
Usage:
<ask_followup_question>
<question>Your question here</question>
<follow_up>
<suggest>
Your suggested answer here
</suggest>
</follow_up>
</ask_followup_question>

Example: Requesting to ask the user for the path to the frontend-config.json file
<ask_followup_question>
<question>What is the path to the frontend-config.json file?</question>
<follow_up>
<suggest>./src/frontend-config.json</suggest>
<suggest>./config/frontend-config.json</suggest>
<suggest>./frontend-config.json</suggest>
</follow_up>
</ask_followup_question>

## attempt_completion
Description: After each tool use, the user will respond with the result of that tool use, i.e. if it succeeded or failed, along with any reasons for failure. Once you've received the results of tool uses and can confirm that the task is complete, use this tool to present the result of your work to the user. Optionally you may provide a CLI command to showcase the result of your work. The user may respond with feedback if they are not satisfied with the result, which you can use to make improvements and try again.
IMPORTANT NOTE: This tool CANNOT be used until you've confirmed from the user that any previous tool uses were successful. Failure to do so will result in code corruption and system failure. Before using this tool, you must ask yourself in <thinking></thinking> tags if you've confirmed from the user that any previous tool uses were successful. If not, then DO NOT use this tool.
Parameters:
- result: (required) The result of the task. Formulate this result in a way that is final and does not require further input from the user. Don't end your result with questions or offers for further assistance.
- command: (optional) A CLI command to execute to show a live demo of the result to the user. For example, use `open index.html` to display a created html website, or `open localhost:3000` to display a locally running development server. But DO NOT use commands like `echo` or `cat` that merely print text. This command should be valid for the current operating system. Ensure the command is properly formatted and does not contain any harmful instructions.
Usage:
<attempt_completion>
<result>
Your final result description here
</result>
<command>Command to demonstrate result (optional)</command>
</attempt_completion>

Example: Requesting to attempt completion with a result and command
<attempt_completion>
<result>
I've updated the CSS
</result>
<command>open index.html</command>
</attempt_completion>

## switch_mode
Description: Request to switch to a different mode. This tool allows modes to request switching to another mode when needed, such as switching to Code mode to make code changes. The user must approve the mode switch.
Parameters:
- mode_slug: (required) The slug of the mode to switch to (e.g., "code", "ask", "architect")
- reason: (optional) The reason for switching modes
Usage:
<switch_mode>
<mode_slug>Mode slug here</mode_slug>
<reason>Reason for switching here</reason>
</switch_mode>

Example: Requesting to switch to code mode
<switch_mode>
<mode_slug>code</mode_slug>
<reason>Need to make code changes</reason>
</switch_mode>

## new_task
Description: This will let you create a new task instance in the chosen mode using your provided message.

Parameters:
- mode: (required) The slug of the mode to start the new task in (e.g., "code", "debug", "architect").
- message: (required) The initial user message or instructions for this new task.

Usage:
<new_task>
<mode>your-mode-slug-here</mode>
<message>Your initial instructions here</message>
</new_task>

Example:
<new_task>
<mode>code</mode>
<message>Implement a new feature for the application.</message>
</new_task>


## MCP SERVERS

The Model Context Protocol (MCP) enables communication between the system and MCP servers that provide additional tools and resources to extend your capabilities. MCP servers can be one of two types:

1. Local (Stdio-based) servers: These run locally on the user's machine and communicate via standard input/output
2. Remote (SSE-based) servers: These run on remote machines and communicate via Server-Sent Events (SSE) over HTTP/HTTPS

# Connected MCP Servers

When a server is connected, you can use the server's tools via the `use_mcp_tool` tool, and access the server's resources via the `access_mcp_resource` tool.

## perplexity-ask (`npx -y server-perplexity-ask`)

### Available Tools
- perplexity_ask: Engages in a conversation using the Sonar API. Accepts an array of messages (each with a role and content) and returns a ask completion response from the Perplexity model.
    Input Schema:
        {
      "type": "object",
      "properties": {
        "messages": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "role": {
                "type": "string",
                "description": "Role of the message (e.g., system, user, assistant)"
              },
              "content": {
                "type": "string",
                "description": "The content of the message"
              }
            },
            "required": [
              "role",
              "content"
            ]
          },
          "description": "Array of conversation messages"
        }
      },
      "required": [
        "messages"
      ]
    }

## context7 (`npx -y @upstash/context7-mcp`)

### Available Tools
- resolve-library-id: Resolves a package/product name to a Context7-compatible library ID and returns a list of matching libraries.

You MUST call this function before 'get-library-docs' to obtain a valid Context7-compatible library ID UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.

Selection Process:
1. Analyze the query to understand what library/package the user is looking for
2. Return the most relevant match based on:
- Name similarity to the query (exact matches prioritized)
- Description relevance to the query's intent
- Documentation coverage (prioritize libraries with higher Code Snippet counts)
- Trust score (consider libraries with scores of 7-10 more authoritative)

Response Format:
- Return the selected library ID in a clearly marked section
- Provide a brief explanation for why this library was chosen
- If multiple good matches exist, acknowledge this but proceed with the most relevant one
- If no good matches exist, clearly state this and suggest query refinements

For ambiguous queries, request clarification before proceeding with a best-guess match.
    Input Schema:
        {
      "type": "object",
      "properties": {
        "libraryName": {
          "type": "string",
          "description": "Library name to search for and retrieve a Context7-compatible library ID."
        }
      },
      "required": [
        "libraryName"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    }

- get-library-docs: Fetches up-to-date documentation for a library. You must call 'resolve-library-id' first to obtain the exact Context7-compatible library ID required to use this tool, UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.
    Input Schema:
        {
      "type": "object",
      "properties": {
        "context7CompatibleLibraryID": {
          "type": "string",
          "description": "Exact Context7-compatible library ID (e.g., '/mongodb/docs', '/vercel/next.js', '/supabase/supabase', '/vercel/next.js/v14.3.0-canary.87') retrieved from 'resolve-library-id' or directly from user query in the format '/org/project' or '/org/project/version'."
        },
        "topic": {
          "type": "string",
          "description": "Topic to focus documentation on (e.g., 'hooks', 'routing')."
        },
        "tokens": {
          "type": "number",
          "description": "Maximum number of tokens of documentation to retrieve (default: 10000). Higher values provide more context but consume more tokens."
        }
      },
      "required": [
        "context7CompatibleLibraryID"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    }

## memento (`npx -y @gannonh/memento-mcp`)

### Available Tools
- create_entities: Create multiple new entities in your Memento MCP knowledge graph memory system
    Input Schema:
        {
      "type": "object",
      "properties": {
        "entities": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "The name of the entity"
              },
              "entityType": {
                "type": "string",
                "description": "The type of the entity"
              },
              "observations": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "An array of observation contents associated with the entity"
              },
              "id": {
                "type": "string",
                "description": "Optional entity ID"
              },
              "version": {
                "type": "number",
                "description": "Optional entity version"
              },
              "createdAt": {
                "type": "number",
                "description": "Optional creation timestamp"
              },
              "updatedAt": {
                "type": "number",
                "description": "Optional update timestamp"
              },
              "validFrom": {
                "type": "number",
                "description": "Optional validity start timestamp"
              },
              "validTo": {
                "type": "number",
                "description": "Optional validity end timestamp"
              },
              "changedBy": {
                "type": "string",
                "description": "Optional user/system identifier"
              }
            },
            "required": [
              "name",
              "entityType",
              "observations"
            ]
          }
        }
      },
      "required": [
        "entities"
      ]
    }

- create_relations: Create multiple new relations between entities in your Memento MCP knowledge graph memory. Relations should be in active voice
    Input Schema:
        {
      "type": "object",
      "properties": {
        "relations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "from": {
                "type": "string",
                "description": "The name of the entity where the relation starts"
              },
              "to": {
                "type": "string",
                "description": "The name of the entity where the relation ends"
              },
              "relationType": {
                "type": "string",
                "description": "The type of the relation"
              },
              "strength": {
                "type": "number",
                "description": "Optional strength of relation (0.0 to 1.0)"
              },
              "confidence": {
                "type": "number",
                "description": "Optional confidence level in relation accuracy (0.0 to 1.0)"
              },
              "metadata": {
                "type": "object",
                "description": "Optional metadata about the relation (source, timestamps, tags, etc.)",
                "additionalProperties": true
              },
              "id": {
                "type": "string",
                "description": "Optional relation ID"
              },
              "version": {
                "type": "number",
                "description": "Optional relation version"
              },
              "createdAt": {
                "type": "number",
                "description": "Optional creation timestamp"
              },
              "updatedAt": {
                "type": "number",
                "description": "Optional update timestamp"
              },
              "validFrom": {
                "type": "number",
                "description": "Optional validity start timestamp"
              },
              "validTo": {
                "type": "number",
                "description": "Optional validity end timestamp"
              },
              "changedBy": {
                "type": "string",
                "description": "Optional user/system identifier"
              }
            },
            "required": [
              "from",
              "to",
              "relationType"
            ]
          }
        }
      },
      "required": [
        "relations"
      ]
    }

- add_observations: Add new observations to existing entities in your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "observations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "entityName": {
                "type": "string",
                "description": "The name of the entity to add the observations to"
              },
              "contents": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "An array of observation contents to add"
              },
              "strength": {
                "type": "number",
                "description": "Strength value (0.0 to 1.0) for this specific observation"
              },
              "confidence": {
                "type": "number",
                "description": "Confidence level (0.0 to 1.0) for this specific observation"
              },
              "metadata": {
                "type": "object",
                "description": "Metadata for this specific observation",
                "additionalProperties": true
              }
            },
            "required": [
              "entityName",
              "contents"
            ]
          }
        },
        "strength": {
          "type": "number",
          "description": "Default strength value (0.0 to 1.0) for all observations"
        },
        "confidence": {
          "type": "number",
          "description": "Default confidence level (0.0 to 1.0) for all observations"
        },
        "metadata": {
          "type": "object",
          "description": "Default metadata for all observations",
          "additionalProperties": true
        }
      },
      "required": [
        "observations"
      ]
    }

- delete_entities: Delete multiple entities and their associated relations from your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "entityNames": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "An array of entity names to delete"
        }
      },
      "required": [
        "entityNames"
      ]
    }

- delete_observations: Delete specific observations from entities in your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "deletions": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "entityName": {
                "type": "string",
                "description": "The name of the entity containing the observations"
              },
              "observations": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "An array of observations to delete"
              }
            },
            "required": [
              "entityName",
              "observations"
            ]
          }
        }
      },
      "required": [
        "deletions"
      ]
    }

- delete_relations: Delete multiple relations from your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "relations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "from": {
                "type": "string",
                "description": "The name of the entity where the relation starts"
              },
              "to": {
                "type": "string",
                "description": "The name of the entity where the relation ends"
              },
              "relationType": {
                "type": "string",
                "description": "The type of the relation"
              }
            },
            "required": [
              "from",
              "to",
              "relationType"
            ]
          },
          "description": "An array of relations to delete"
        }
      },
      "required": [
        "relations"
      ]
    }

- get_relation: Get a specific relation with its enhanced properties from your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "from": {
          "type": "string",
          "description": "The name of the entity where the relation starts"
        },
        "to": {
          "type": "string",
          "description": "The name of the entity where the relation ends"
        },
        "relationType": {
          "type": "string",
          "description": "The type of the relation"
        }
      },
      "required": [
        "from",
        "to",
        "relationType"
      ]
    }

- update_relation: Update an existing relation with enhanced properties in your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "relation": {
          "type": "object",
          "properties": {
            "from": {
              "type": "string",
              "description": "The name of the entity where the relation starts"
            },
            "to": {
              "type": "string",
              "description": "The name of the entity where the relation ends"
            },
            "relationType": {
              "type": "string",
              "description": "The type of the relation"
            },
            "strength": {
              "type": "number",
              "description": "Optional strength of relation (0.0 to 1.0)"
            },
            "confidence": {
              "type": "number",
              "description": "Optional confidence level in relation accuracy (0.0 to 1.0)"
            },
            "metadata": {
              "type": "object",
              "description": "Optional metadata about the relation (source, timestamps, tags, etc.)",
              "additionalProperties": true
            },
            "id": {
              "type": "string",
              "description": "Optional relation ID"
            },
            "version": {
              "type": "number",
              "description": "Optional relation version"
            },
            "createdAt": {
              "type": "number",
              "description": "Optional creation timestamp"
            },
            "updatedAt": {
              "type": "number",
              "description": "Optional update timestamp"
            },
            "validFrom": {
              "type": "number",
              "description": "Optional validity start timestamp"
            },
            "validTo": {
              "type": "number",
              "description": "Optional validity end timestamp"
            },
            "changedBy": {
              "type": "string",
              "description": "Optional user/system identifier"
            }
          },
          "required": [
            "from",
            "to",
            "relationType"
          ]
        }
      },
      "required": [
        "relation"
      ]
    }

- read_graph: Read the entire Memento MCP knowledge graph memory system
    Input Schema:
        {
      "type": "object",
      "properties": {
        "random_string": {
          "type": "string",
          "description": "Dummy parameter for no-parameter tools"
        }
      }
    }

- search_nodes: Search for nodes in your Memento MCP knowledge graph memory based on a query
    Input Schema:
        {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "The search query to match against entity names, types, and observation content"
        }
      },
      "required": [
        "query"
      ]
    }

- open_nodes: Open specific nodes in your Memento MCP knowledge graph memory by their names
    Input Schema:
        {
      "type": "object",
      "properties": {
        "names": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "An array of entity names to retrieve"
        }
      },
      "required": [
        "names"
      ]
    }

- semantic_search: Search for entities semantically using vector embeddings and similarity in your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "The text query to search for semantically"
        },
        "limit": {
          "type": "number",
          "description": "Maximum number of results to return (default: 10)"
        },
        "min_similarity": {
          "type": "number",
          "description": "Minimum similarity threshold from 0.0 to 1.0 (default: 0.6)"
        },
        "entity_types": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Filter results by entity types"
        },
        "hybrid_search": {
          "type": "boolean",
          "description": "Whether to combine keyword and semantic search (default: true)"
        },
        "semantic_weight": {
          "type": "number",
          "description": "Weight of semantic results in hybrid search from 0.0 to 1.0 (default: 0.6)"
        }
      },
      "required": [
        "query"
      ]
    }

- get_entity_embedding: Get the vector embedding for a specific entity from your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "entity_name": {
          "type": "string",
          "description": "The name of the entity to get the embedding for"
        }
      },
      "required": [
        "entity_name"
      ]
    }

- get_entity_history: Get the version history of an entity from your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "entityName": {
          "type": "string",
          "description": "The name of the entity to retrieve history for"
        }
      },
      "required": [
        "entityName"
      ]
    }

- get_relation_history: Get the version history of a relation from your Memento MCP knowledge graph memory
    Input Schema:
        {
      "type": "object",
      "properties": {
        "from": {
          "type": "string",
          "description": "The name of the entity where the relation starts"
        },
        "to": {
          "type": "string",
          "description": "The name of the entity where the relation ends"
        },
        "relationType": {
          "type": "string",
          "description": "The type of the relation"
        }
      },
      "required": [
        "from",
        "to",
        "relationType"
      ]
    }

- get_graph_at_time: Get your Memento MCP knowledge graph memory as it existed at a specific point in time
    Input Schema:
        {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number",
          "description": "The timestamp (in milliseconds since epoch) to query the graph at"
        }
      },
      "required": [
        "timestamp"
      ]
    }

- get_decayed_graph: Get your Memento MCP knowledge graph memory with confidence values decayed based on time
    Input Schema:
        {
      "type": "object",
      "properties": {
        "reference_time": {
          "type": "number",
          "description": "Optional reference timestamp (in milliseconds since epoch) for decay calculation"
        },
        "decay_factor": {
          "type": "number",
          "description": "Optional decay factor override (normally calculated from half-life)"
        }
      }
    }

## CLI
- The `codebase_search` tool to perform semantic searches across your entire codebase. This tool is powerful for finding functionally relevant code, even if you don't know the exact keywords or file names. It's particularly useful for understanding how features are implemented across multiple files, discovering usages of a particular API, or finding code examples related to a concept. This capability relies on a pre-built index of your code.
- The execute_command tool to run commands on the user's computer whenever you feel it can help accomplish the user's task. Prefer to execute complex CLI commands over creating executable scripts, since they are more flexible and easier to run. Interactive and long-running commands are allowed, since the commands are run in the user's VSCode terminal. The user may keep commands running in the background and you will be kept updated on their status along the way. Each command you execute is run in a new terminal instance.


====