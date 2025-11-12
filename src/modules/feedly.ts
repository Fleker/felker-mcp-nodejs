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

interface FeedlyResponse {
  items: FeedlyArticle[];
  continuation?: string;
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

/**
 * Fetches news articles from Feedly.
 * Note: To register this with an MCP server, you would pass this function 
 * to your MCP SDK's tool definition method.
 */
export async function fetchFeedlyArticles(accessToken?: string, userId?: string) {
  if (!accessToken || !userId) {
    return { error: "Feedly access token or user ID not found in environment variables." };
  }

  const allArticles: FeedlyArticle[] = [];
  let continuation: string | undefined = undefined;

  console.log('Beginning to download articles...');

  // Main pagination loop
  while (true) {
    const query = continuation ? `&continuation=${continuation}` : '';
    const path = `streams/contents?streamId=user/${userId}/category/global.all&unreadOnly=true&count=250${query}`;

    try {
      const res: FeedlyResponse = await feedlyApiCall(accessToken, path);

      const items = res.items || [];
      if (items.length === 0) {
        console.log('No items found or end of stream.');
        break;
      }

      allArticles.push(...items);
      continuation = res.continuation;

      if (!continuation) {
        break; // Exit loop when there's no more continuation token
      }

    } catch (e: any) {
      const errorMessage = e.toString();
      
      if (errorMessage.includes('401')) {
        console.log('Error: Access token expired. Please request a new one.');
      } else if (errorMessage.includes('429')) {
        console.log('Error: API rate limit reached.');
      } else {
        console.log(`An unexpected error occurred: ${errorMessage}`);
      }
      break;
    }
  }

  console.log(`Loaded ${allArticles.length} items.`);

  const contextArticles = allArticles.map(article => ({
    content: getContent(article),
    origin: article.origin,
    title: article.title,
    author: article.author
  }));

  console.log(contextArticles);

  return {
    articles: contextArticles,
  };
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
  execute: async (_, context) => {
    // Fetch header items
    console.log(context.session?.headers)
    const feedlyToken = context.session?.headers?.feedly_access_token;
    const userId = context.session?.headers?.feedly_user_id;
    
    console.log('Beginning to download articles...');

    const res = await fetchFeedlyArticles(feedlyToken, userId)
    return JSON.stringify(res)
  }
}

export default feedly
