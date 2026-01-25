#!/bin/bash

# CONFIGURATION
API_URL="http://localhost:3000"

echo "🌱 STARTING USER SEEDING..."
echo "--------------------------------"

# Define all roles and their display names
ROLES=(
  "ADMIN:Alice"
  "PM:Bob"
  "REQUESTER:Customer"
  "PRODUCTION_LEAD:David"
  "OPERATOR_BREAKDOWN:Operator"
  "ENGINEER_JOINT:Joint"
  "ENGINEER_HOUSING:Housing"
  "ENGINEER_JIG:Jig"
  "ENGINEER_VISUAL:Visual"
  "ENGINEER_JS_ACC:Acc"
  "ENGINEER_JS_FIN:Fin"
)

# Loop through each role and create the user
for ENTRY in "${ROLES[@]}"; do
  # Split the string by the colon
  ROLE="${ENTRY%%:*}"
  NAME="${ENTRY##*:}"
  
  # ✅ FIXED: Universally compatible lowercase conversion
  LOWER_NAME=$(echo "$NAME" | tr '[:upper:]' '[:lower:]')
  
  RANDOM_NUM=$((1 + $RANDOM % 10000))
  EMAIL="${LOWER_NAME}${RANDOM_NUM}@example.com"
  PASSWORD="${NAME}12345"

  echo "👤 Creating $ROLE ($NAME)..."

  RESPONSE=$(curl -s -X POST "$API_URL/users/user" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "'"$NAME"'",
      "email": "'"$EMAIL"'",
      "password": "'"$PASSWORD"'",
      "role": "'"$ROLE"'"
    }')

  if [[ $RESPONSE == *"\"id\""* ]]; then
    echo "✅ Success! (Email: $EMAIL | Pass: $PASSWORD)"
  else
    echo "❌ Failed. Response: $RESPONSE"
  fi
  echo "--------------------------------"
done

echo "🎉 DONE!"