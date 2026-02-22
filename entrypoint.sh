#!/bin/sh
set -e

mkdir functions

echo "$SERVER_CODE" >server.js

echo "$USER_FUNC_CODE" | jq -r 'to_entries[] | "\(.key)|\(.value)"' | while IFS="|" read -r filename content; do
  echo "$content" >"functions/$filename"
done

node server.js
