import { Tool } from "fastmcp";
import { runAgent } from "./agent";
import { z } from "zod";
import * as fs from 'fs'

const buyCardsTool: Tool<any, z.ZodObject<{}>> = {
  name: "buy_cards",
  description: `
  Use this to run a script to add a bunch of trading cards to my cart

  Args: none
    
  Returns:
      A message indicating the script has started.
  `,
  annotations: {
    streamingHint: true,
  },
  parameters: z.object({}),
  execute: async (_, context) => {
    const file = fs.readFileSync('/mnt/c/Users/handn/Development/mcp-felker/card-urls.txt')
    const urls = file.toString().split('\n').filter(x => x.trim().length)
    console.log(`there are ${urls.length} urls`)
    const instructions = []
    for (let i = 0; i < urls.length; i++) {
      instructions.push(`First, go to the URL ${urls[i]}. Wait a second and then press the button and wait a second.`)
    }
    instructions.push(`Go to the shopping cart page https://www.tcgplayer.com/cart. Then, press the Optimize button. Wait until the optimization is done. Then select the option with the fewest packages.`)
    instructions.push(`You are on the shopping webpage of TCG Player. Look at the contents of each package. If there is one item in the package from that shop, remove that package. Check the shipping details of that package in the cart. If they do not offer discounted or free shipping, remove that package.`)
    await runAgent(instructions, context)
  },
};

export default buyCardsTool;
