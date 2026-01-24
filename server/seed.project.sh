#!/bin/bash

# ==========================================
# CONFIGURATION
# ==========================================
API_URL="http://localhost:3000"
EMAIL="alice2390@example.com"          # Let's use a fresh email
PASSWORD="Alice12345"
NAME="Admin Seeder"
COUNT=5

# ==========================================
# 1. ENSURE USER EXISTS (Register First)
# ==========================================
echo "👤 Checking/Creating User..."

# Try to Register. If it fails (409 Conflict), that's fine—it means user exists.
# We use -s (silent) but capture output to check.
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$EMAIL"'",
    "password": "'"$PASSWORD"'",
    "confirmPassword": "'"$PASSWORD"'",
    "name": "'"$NAME"'",
    "role": "ADMIN"
  }')

echo "   (Registration check complete)"

# ==========================================
# 2. LOGIN (With Error Debugging)
# ==========================================
echo "🔑 Logging in as $EMAIL..."

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$EMAIL"'",
    "password": "'"$PASSWORD"'"
  }')

# Extract Token (Using a cleaner method usually works better)
# Note: This assumes your API returns {"access_token": "..."}
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# DEBUG: If Token is empty, print the server response so you see WHY it failed
if [ -z "$TOKEN" ]; then
  echo "❌ Login Failed!"
  echo "   Server Response: $LOGIN_RESPONSE"
  echo "   (Check if your API uses '/auth/login' or just '/login')"
  exit 1
fi

echo "✅ Login Successful!"
echo "--------------------------------------"

# ==========================================
# 3. GENERATE PROJECTS
# ==========================================
CUSTOMERS=("Toyota" "Honda" "Suzuki" "Daihatsu")
SCOPES=("NEW_ASSY" "MODIF_MAJOR" "MODIF_MINOR")
PLOTTINGS=("REGULAR" "PROTOTYPE")

for ((i=1; i<=COUNT; i++)); do
  
  RAND_NUM=$((1000 + RANDOM % 9000))
  ASSY="821-${RAND_NUM}-AB"
  CUSTOMER=${CUSTOMERS[$((RANDOM % ${#CUSTOMERS[@]}))]}
  SCOPE=${SCOPES[$((RANDOM % ${#SCOPES[@]}))]}
  PLOTTING=${PLOTTINGS[$((RANDOM % ${#PLOTTINGS[@]}))]}
  BD_DAYS=$((3 + RANDOM % 5))
  
  # Dates
  ORDER_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
  # Cross-platform date math (Linux/Mac)
  if date -v+30d > /dev/null 2>&1; then
     ETD=$(date -v+30d -u +"%Y-%m-%dT%H:%M:%S.000Z") # Mac
  else
     ETD=$(date -d "+30 days" -u +"%Y-%m-%dT%H:%M:%S.000Z") # Linux
  fi

  JSON_DATA=$(cat <<EOF
{
  "assyNumber": "$ASSY",
  "customer": "$CUSTOMER",
  "totalPo": ${RAND_NUM},
  "plotting": "$PLOTTING",
  "scope": "$SCOPE",
  "breakdownDays": $BD_DAYS,
  "orderDate": "$ORDER_DATE",
  "etd": "$ETD"
}
EOF
)

  echo "🚀 [$i/$COUNT] Sending $ASSY..."
  
  RESPONSE=$(curl -s -X POST "$API_URL/projects/project" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$JSON_DATA")

  if [[ $RESPONSE == *"error"* ]]; then
     echo "   ❌ Error: $RESPONSE"
  else
     echo "   ✅ Success"
  fi

done