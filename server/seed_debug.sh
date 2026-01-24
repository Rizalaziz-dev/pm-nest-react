#!/bin/bash

# ==========================================
# CONFIGURATION
# ==========================================
API_URL="http://localhost:3000"
EMAIL="alice6668@example.com"  # Use your existing admin email
PASSWORD="Alice12345"
COUNT=1

# ==========================================
# 1. LOGIN
# ==========================================
echo "🔑 Logging in as $EMAIL..."

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

# Try to get 'token' OR 'access_token' (Handling both cases)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "❌ Login Failed!"
  echo "👉 Server Said: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login Successful!"
echo "--------------------------------------"

# ==========================================
# 2. GENERATE A SINGLE DEBUG PROJECT
# ==========================================

# Randomize to avoid Unique Constraint (assyNumber) errors
RAND_NUM=$((1000 + RANDOM % 9000))
ASSY="821-${RAND_NUM}-DEBUG"

# Hardcoded Safe ISO Dates to rule out date math errors
ORDER_DATE="2026-01-20T09:00:00.000Z"
ETD="2026-02-20T09:00:00.000Z"

# Construct JSON
JSON_DATA=$(cat <<EOF
{
  "assyNumber": "$ASSY",
  "customer": "Debug Motors",
  "totalPo": "PO-${RAND_NUM}",
  "plotting": "REGULAR",
  "scope": "NEW_ASSY",
  "breakdownDays": 5,
  "orderDate": "$ORDER_DATE",
  "etd": "$ETD"
}
EOF
)

echo "🚀 Sending Payload:"
echo "$JSON_DATA"
echo "--------------------------------------"

# Send Request & CAPTURE RESPONSE CODE
HTTP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/projects/project" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$JSON_DATA")

# Split Body and Status Code
HTTP_BODY=$(echo "$HTTP_RESPONSE" | head -n -1)
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tail -n 1)

if [[ "$HTTP_STATUS" == "201" || "$HTTP_BODY" == *"id"* ]]; then
   echo "✅ SUCCESS! (Status: $HTTP_STATUS)"
   echo "📄 Created Project: $HTTP_BODY"
else
   echo "❌ FAILED (Status: $HTTP_STATUS)"
   echo "⚠️ ERROR MESSAGE: $HTTP_BODY"
   echo ""
   echo "👉 CHECK THESE COMMON FIXES:"
   echo "1. If it says 'pmId should not be empty' -> Fix your DTO (Make pmId optional)."
   echo "2. If it says 'Unauthorized' -> Check your AuthGuard or Token."
   echo "3. If it says 'assyNumber already exists' -> Run the script again (Random collision)."
fi