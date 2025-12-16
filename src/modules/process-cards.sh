#!/bin/bash

# nvm use 20
# Check if the URL file exists
if [ ! -f "/mnt/c/Users/handn/Development/mcp-felker/card-urls.txt" ]; then
    echo "Error: card-urls.txt not found!"
    exit 1
fi

echo "hello"
#
    # "browsermcp": {
    #   "command": "npx",
    #   "args": ["@browsermcp/mcp@latest"]
    # },
# gemini --yolo --prompt "hello"

# Read each URL from the file line by line
while read -r url; do
  echo "------------------------------------"
  echo "Processing URL: $url"
  echo "------------------------------------"

  # Send a focused, two-step prompt to the Gemini CLI for the current URL.
  # Note the use of double quotes around the whole prompt and single quotes inside.
  gemini --yolo --model gemini-2.5-flash --prompt "First, go to the URL $url. Wait a second and then press the button and wait a second."

  # Optional: Add a small delay to be respectful to the server
  sleep 2
done < "/mnt/c/Users/handn/Development/mcp-felker/card-urls.txt"

gemini --yolo --model gemini-2.5-flash --prompt "Go to the shopping cart page https://www.tcgplayer.com/cart. Then, press the Optimize button. Wait until the optimization is done. Then select the option with the fewest packages."
gemini --yolo --model gemini-2.5-flash --prompt "You are on the shopping webpage of TCG Player. Look at the contents of each package. If there is one item in the package from that shop, remove that package. Check the shipping details of that package in the cart. If they do not offer discounted or free shipping, remove that package."

echo "All URLs have been processed."