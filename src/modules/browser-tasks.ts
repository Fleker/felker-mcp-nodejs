import { Tool } from "fastmcp";
import { runAgent } from "./agent";
import { z } from "zod";

const fetchGoodreadsPages: Tool<any, z.ZodObject<{}>> = {
  name: "goodreads_pages",
  description: `
  Use this tool in order to seek out the number of pages in my Goodreads
  to-read list. It also determines the number of hours to read and the
  number of days to read.

  Args: none
    
  Returns:
      A message indicating the result of the script.
  `,
  annotations: {
    streamingHint: true,
  },
  parameters: z.object({}),
  execute: async (_, context) => {
    const instructions = [
      `visit https://www.goodreads.com/review/list/5246265-nick?ref=nav_mybooks&shelf=to-read
      and scroll to the end multiple times until the infinite scrolling is done.`,
      `then run this script in that tab:
      
      const numPages = [...document.querySelectorAll('.field.num_pages')]
        .map(x => parseInt(x.innerText.replace(/,/g, '')
        .replace(/ pp/g, '')))
        .filter(x => !isNaN(x))
        .reduce((c, p) => c + p, 0) * 2;
        const numHours = Math.ceil(numPages / 60);
        const numDays = Math.ceil(numHours / 24);
        return \`\${numPages} pages, \${numHours} hours, \${numDays} days\``  
    ]
    await runAgent(instructions, context)
  },
};

export default {fetchGoodreadsPages}
