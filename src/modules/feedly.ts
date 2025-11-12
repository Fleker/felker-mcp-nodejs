import { Tool } from "fastmcp";
import { z } from "zod";
import { UserError } from "fastmcp";

interface FeedlyArticle {
  title?: string;
  content?: { content?: string };
  summary?: { content?: string };
  fullContent?: string;
  [key: string]: any;
}

/**
 * Makes an API call to the Feedly cloud API.
 * 
 * @param accessToken - The user's Feedly access token.
 * @param path - The API endpoint path.
 * @param method - The HTTP method (e.g., 'GET', 'POST').
 * @param data - The data to send in the request body for methods like POST.
 * @returns The JSON response from the API.
 * @throws {UserError} If the request fails due to network issues or API errors.
 */
async function feedlyApiCall(
    accessToken: string,
    path: string,
    method: string = 'GET',
    data?: { [key: string]: any }
): Promise<any> {
    const url = `https://cloud.feedly.com/v3/${path}`;
    const headers: HeadersInit = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
    };

    const options: RequestInit = {
        method,
        headers,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new UserError(`Feedly API request to ${url} failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new UserError(`Request to ${url} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Extracts and cleans content from a Feedly article object.
 * @param article - An object representing a Feedly article.
 * @returns The cleaned article content.
 */
function getContent(article: FeedlyArticle): string {
    const articleContent: string =
        article?.content?.content ||
        article?.summary?.content ||
        article?.fullContent ||
        '';
    
    // Remove <img> tags from the content
    return articleContent.replace(/<img .*?>/g, '');
}

const feedly: Tool<
  any,
  z.ZodObject<{}>
> = {
  name: 'get_feedly_news',
  description: `
  Fetches news articles from Feedly, stores them, and returns an array of their titles/headlines.
    
  Args: None, they are hard-coded for this demo.
        
  Returns:
    A JSON object containing an array of article titles.
  `,
  parameters: z.object({}),
  execute: async () => {
    const feedlyToken = '';
    const userId = '';
    
    console.log('Beginning to download articles...');

    const allArticles: FeedlyArticle[] = [];
    let continuation: string | undefined = undefined;

    while (true) {
      try {
        const query = continuation ? `&continuation=${continuation}` : '';
        const path = `streams/contents?streamId=user/${userId}/category/global.all&unreadOnly=true&count=250${query}`;
        
        const res = await feedlyApiCall(feedlyToken, path);
        const items: FeedlyArticle[] = res.items || [];

        if (items.length === 0) {
          console.log('No more unread items found or end of stream.');
          break;
        }

        allArticles.push(...items);
        continuation = res.continuation;

        if (!continuation) {
          break; // Exit loop when there's no more continuation token
        }
      } catch (e) {
        const error = e as Error;
        // The UserError from feedlyApiCall already provides a good message.
        console.error(`An error occurred while fetching articles: ${error.message}`);
        // We re-throw the error to let the MCP framework handle it.
        throw e;
      }
    }
    console.log(`Downloaded ${allArticles.length} items.`);
    const headlines = allArticles.map(article => article.title || 'No Title');
    return JSON.stringify({ headlines, count: allArticles.length });
  }
}

export default feedly
