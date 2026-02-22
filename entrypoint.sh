#!/bin/sh
set -e

echo "$SERVER_CODE" >server.js

mkdir -p functions

echo "$USER_FUNC_CODE" | jq -r 'to_entries[] | @base64' | while read -r entry; do
  _jq() { echo "$entry" | base64 --decode | jq -r "$1"; }

  filename=$(_jq '.key')
  content=$(_jq '.value')

  case "$filename" in
  *.js) ;;
  *) filename="$filename.js" ;;
  esac

  echo "$content" >"functions/$filename"
done

node server.js
