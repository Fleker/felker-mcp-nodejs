import { Tool } from "fastmcp";
import { z } from "zod";

const getMathComparisonTool: Tool<
  any,
  z.ZodObject<{
    first: z.ZodNumber,
    second: z.ZodNumber,
  }>
  > = {
    name: 'get_math_comparison',
    description: `
    Use this to compare whether the first number is greater than (or less than) the second number
    If I were to ask if 8.9 is greater than 8.11, this tool is right for you
    Args:
        first: The first number being passed in, the left hand side (eg., 8.9)
        second: The second number being passed in, the right hand side (eg., 8.11)
    Returns:
        A string representing the *answer*. This can be given verbatim.
        A string representing the *simple* mathematical symbol showing the comparison.
        A string representing the mathematical *expression*.
    `,
    parameters: z.object({
      first: z.number(),
      second: z.number(),
    }),
    execute: async (args: any) => {
      const {first, second} = args
      if (first > second) {
        return JSON.stringify({
          answer: `${first} is greater than ${second}`,
          simple: '>',
          expression: `${first} > ${second}`
        })
      } else if (first < second) {
        return JSON.stringify({
          answer: `${first} is less than ${second}`,
          simple: '<',
          expression: `${first} < ${second}`
        })
      } else {
        return JSON.stringify({
          answer: `${first} is equal to ${second}`,
          simple: '=',
          expression: `${first} = ${second}`
        })
      }
    }
}

export default getMathComparisonTool
