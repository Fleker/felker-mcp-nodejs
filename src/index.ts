import { FastMCP } from "fastmcp";

import getLetterCountTool from "./modules/get-letter-count";
import getMathComparisonTool from "./modules/get-math-comparison";
import feedly from "./modules/feedly";

const server = new FastMCP({
  name: "Felker MCP",
  version: "2025.11.11",
});

server.addTool(feedly)
server.addTool(getLetterCountTool)
server.addTool(getMathComparisonTool)

server.start({
  transportType: "httpStream",
  httpStream: {
    port: 8080,
  },
});

console.log("Server started");
