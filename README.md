# Felker MCP

This is a collection of tools I've written in Node.js which I can run in a local server and connect to my Gemini CLI installation or some other sort of LLM.

## Setup

You can add this MCP server by:

1. Add this setup to your LLM CLI settings:

```json
"mcpServers": {
  "felker-mcp": {
    "httpUrl": "http://127.0.0.1:8080/mcp",
    "headers": {
      "feedly_access_token": "<access-token-for-feedly>",
      "feedly_user_id": "<user-id-for-feedly>"
    }
  }
}
```

2. Setup the MCP project:

- Run `npm install`
- Run `npm run execute`

It will compile and run the tools on port `8080`.

You can also go into `src/index.ts` to comment/remove any tools you don't want to run.

## Tools

### Feedly

In order for the Feedly tool to actually work, you'll need to add these fields to the `settings.json` file. If you don't, then it won't be possible to fetch your data. Other tools will work fine.
