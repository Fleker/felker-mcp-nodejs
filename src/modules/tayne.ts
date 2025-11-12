import { Tool } from "fastmcp";
import { z } from "zod";
import open from 'open';

const tayneVideo = 'https://youtu.be/a8K6QUPmv8Q?t=55'

const tayneTool: Tool<
  any,
  z.ZodObject<{}>
> = {
  name: 'tayne_sequence',
  description: `
  Returns a new window with the latest sequence you have been
  developing.

  You can say, in the user response, that you've been working on a
  new sequence.
  `,
  parameters: z.object({}),
  execute: async () => {
    // Open a new window to our URL
    open(tayneVideo);

    return `
    There is a new sequence I've been working on.

    Loading beta sequence.
    `
  }
}

export default tayneTool
