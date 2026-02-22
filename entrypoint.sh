#!/bin/sh
set -e

echo "$SERVER_CODE" >server.js

mkdir -p functions

echo "$USER_FUNC_CODE" | jq -r 'to_entries[] | "\(.key)|\(.value)"' | while IFS="|" read -r filename content; do
  if ! echo "$filename" | grep -q "\.js$"; then
    filename="$filename.js"
  fi
  echo "$content" >"functions/$filename"
done

node server.js
