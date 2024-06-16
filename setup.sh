#!/bin/bash

# Prompt for Google Maps API key and MapID, with input hidden
read -s -p "Enter your Google Maps API key: " GOOGLE_MAPS_API_KEY
echo
read -s -p "Enter your Google Maps MapID: " GOOGLE_MAPS_MAP_ID
echo

# Create .env.local in the root directory
REACT_ENV_FILE="./.env.local"
echo "Creating $REACT_ENV_FILE with provided values..."
echo "REACT_APP_GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY" > $REACT_ENV_FILE
echo "REACT_APP_GOOGLE_MAPS_MAP_ID=$GOOGLE_MAPS_MAP_ID" >> $REACT_ENV_FILE
echo "REACT_APP_SERVER_DOMAIN=localhost:8080" >> $REACT_ENV_FILE
echo "$REACT_ENV_FILE created successfully."

# Create .env in the proxy-server directory
PROXY_ENV_FILE="./proxy-server/.env"
echo "Creating $PROXY_ENV_FILE with provided values..."
mkdir -p ./proxy-server
echo "GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY" > $PROXY_ENV_FILE
echo "$PROXY_ENV_FILE created successfully."

echo "Environment setup complete."
