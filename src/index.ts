import { FastMCP,  } from "fastmcp";

import getLetterCountTool from "./modules/get-letter-count";
import getMathComparisonTool from "./modules/get-math-comparison";
import feedly from "./modules/feedly";
import tayneTool from "./modules/tayne";
import buyCardsTool from "./modules/buy-cards";
import wordCounter from "./modules/word-counter";
import { IncomingHttpHeaders } from "http";

interface SessionData {
  headers: IncomingHttpHeaders;
  [key: string]: unknown; // Add index signature to satisfy Record<string, unknown>
}

const server = new FastMCP({
  name: "Felker MCP",
  version: "2025.11.11",
  authenticate: async (request: any): Promise<SessionData> => {
    // Authentication logic
    return {
      headers: request.headers,
    };
  },
});

server.addTool(buyCardsTool)
server.addTool(feedly)
server.addTool(getLetterCountTool)
server.addTool(getMathComparisonTool)
server.addTool(tayneTool)
server.addTool(wordCounter)

server.start({
  transportType: "httpStream",
  httpStream: {
    port: 8080,
  },
});

console.log("Server started");
