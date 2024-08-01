#!/bin/sh
keys=$(curl -s "http://typesense:8108/keys" \
    -H "X-TYPESENSE-API-KEY: $TYPESENSE_API_KEY")

keys_length=$(echo "$keys" | jq ".keys | length")

if [ "$keys_length" -gt 1 ]; then
    exit 0
else
    curl "http://typesense:8108/keys" \
        -f \
        -H "X-TYPESENSE-API-KEY: $TYPESENSE_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "description": "Search-only plugins key.",
            "actions": ["documents:search"],
            "collections": ["plugins"],
            "value": "'"${TYPESENSE_SEARCH_API_KEY}"'"
        }'
fi