import { Tool } from "fastmcp";
import { z } from "zod";

const getLetterCountTool: Tool<
  any,
  z.ZodObject<{
    word: z.ZodString;
    letter: z.ZodString;
  }>
> = {
  name: 'get_letter_count',
  description: `
  Use this to get the number of letters in a provided word.

  Args:
    word: The word to get the letter count from (eg., "blueberry").
    letter: The letter you are looking for (eg., "b")
    
  Returns:
      An integer showing the number of the given letter in the given word.
  `,
  parameters: z.object({
    word: z.string(),
    letter: z.string(),
  }),
  execute: async (args: any) => {
    let count = 0;
    for (let i = 0; i < args.word.length; i++) {
      if (args.word[i] === args.letter) {
        count++;
      }
    }
    return String(count);
  }
}

export default getLetterCountTool
