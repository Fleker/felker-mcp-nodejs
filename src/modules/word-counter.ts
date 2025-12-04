import { Tool } from "fastmcp";
import { z } from "zod";

const wordCounter: Tool<
  any,
  z.ZodObject<{
    passage: z.ZodString;
  }>
> = {
  name: 'word_counter',
  description: `
  Use this to get the number of words in a given user query.

  Args:
    passage: The entire user query verbatim
    
  Returns:
      An integer showing the number of words in the given user query.
  `,
  parameters: z.object({
    passage: z.string(),
  }),
  execute: async (args: any) => {
    return String(args.passage.split(' ').length)
  }
}

export default wordCounter
