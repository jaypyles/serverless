#!/bin/sh
set -e

# Write the JS code from the environment variable to index.js
echo "$USER_FUNC_CODE" >index.js

# Run Node
node index.js
