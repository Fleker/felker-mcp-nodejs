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
      `Run browser_evaluate on following in the existing Goodreads tab and
      output the text printed to the console:
      
      """javascript
      const numPages = [...document.querySelectorAll('.field.num_pages')]
        .map(x => parseInt(x.innerText.replace(/,/g, '')
        .filter(x => !isNaN(x))
        .reduce((c, p) => c + p, 0) * 2;
        const numHours = Math.ceil(numPages / 60);
        const numDays = Math.ceil(numHours / 24);
        ${"console.log(`${numPages} pages, ${numHours} hours, ${numDays} days`)"}
      """
        `
    ]
    await runAgent(instructions, context)
  },
};

const fetchPlexMovieTime: Tool<any, z.ZodObject<{}>> = {
  name: "plex_movie_time",
  description: `
  Use this tool to figure out how many hours of movies there are left to watch
  in Plex.
  `,
  annotations: {
    streamingHint: true,
  },
  execute: async (_, context) => {
    const instructions = [
      `visit http://192.168.1.140:32400/web/index.html#!/media/99b1aac1320ec0554d2136d5d6d93b237aca426c/com.plexapp.plugins.library?source=1`,
      `Run browser_evaluate on following in the existing Plex tab and
      output the text printed to the console:

      """javascript
      [...document.querySelectorAll('span')].filter(x => x.innerText.includes('min')).map(x => x.innerText).reduce((sum, curr) => {
        const ts = curr.split('hr');
          let dur = 0
          if (ts[1]) {
            dur += parseInt(ts[0])*60
            const ms = ts[1].split('min')
            dur += parseInt(ms[0])
          } else {
            const ms = curr.split('min')
            dur += parseInt(ms[0])
          }
          return sum+dur
      }, 0)
      """
      `
    ]
    await runAgent(instructions, context)
  },
};


export default {fetchGoodreadsPages, fetchPlexMovieTime}
