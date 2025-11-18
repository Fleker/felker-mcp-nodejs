import { Tool } from "fastmcp";
import { exec } from "node:child_process";
import * as path from "path";
import { z } from "zod";

const buyCardsTool: Tool<any, z.ZodObject<{}>> = {
  name: "buy_cards",
  description: `
  Use this to run a script to add a bunch of trading cards to my cart

  Args: none
    
  Returns:
      A message indicating the script has started.
  `,
  parameters: z.object({}),
  execute: async () => {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, "process-cards.sh");
      exec(`bash "${scriptPath}"`, (error: any, stdout: any, stderr: any) => {
        if (error) {
          reject(`Error: ${error.message}`);
          return;
        }
        resolve(stdout || stderr);
      });
    });
  },
};

export default buyCardsTool;
