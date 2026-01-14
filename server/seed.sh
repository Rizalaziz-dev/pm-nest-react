#!/bin/bash

# CONFIGURATION
# Change this to your actual backend URL (usually localhost:3000)
API_URL="http://localhost:3000"

echo "🌱 STARTING DATABASE SEEDING..."
echo "--------------------------------"

# 1. CREATE A PM USER
# We save the response to extract the ID, or you can hardcode a UUID if you have one.
echo "1. Creating Project Manager (Alice)..."

# Assuming you have a /users endpoint. If not, paste an existing UUID below.
# Generating a random email to avoid unique constraint errors on re-runs
RANDOM_NUM=$((1 + $RANDOM % 10000))
PM_EMAIL="alice_pm_${RANDOM_NUM}@sevendayflow.com"

PM_RESPONSE=$(curl -s -X POST "$API_URL/users/user" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Manager",
    "email": "'"$PM_EMAIL"'",
    "password": "securepassword123",
    "role": "PM"
  }')

# Extract ID using grep/sed (simple method to avoid installing jq)
# This looks for "id":"some-uuid" string
PM_ID=$(echo $PM_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -n1)

if [ -z "$PM_ID" ]; then
  echo "❌ Error: Could not create User or get ID. Response: $PM_RESPONSE"
  echo "   (If you haven't made the Users endpoint yet, paste a real UUID in the script)"
  exit 1
fi

echo "✅ Created PM with ID: $PM_ID"
echo "--------------------------------"


# 2. CREATE PROJECT A: REGULAR (Hino Trucks)
# "Standard timeline, plenty of time"
echo "2. Creating Project A (Regular - Hino Trucks)..."

curl -s -X POST "$API_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "assyNumber": "821-4402-AB",
    "customer": "Hino Trucks",
    "totalPo": "200 Sets",
    "plotting": "REGULAR",
    "orderDate": "2026-01-08T09:00:00.000Z",
    "etd": "2026-01-20T17:00:00.000Z",
    "pmId": "'"$PM_ID"'"
  }' | grep "id" > /dev/null && echo "   -> Success! (6 Work Orders generated)" || echo "   -> Failed"


# 3. CREATE PROJECT B: PROTOTYPE (Volvo Bus)
# "Rush job! Deadlines should be tighter in the DB"
echo "3. Creating Project B (PROTOTYPE - Volvo Bus)..."

curl -s -X POST "$API_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "assyNumber": "900-1120-XC",
    "customer": "Volvo Bus",
    "totalPo": "5 Sets",
    "plotting": "PROTOTYPE",
    "orderDate": "2026-01-08T10:00:00.000Z",
    "etd": "2026-01-12T17:00:00.000Z",
    "pmId": "'"$PM_ID"'"
  }' | grep "id" > /dev/null && echo "   -> Success! (Prototype schedule created)" || echo "   -> Failed"


# 4. CREATE PROJECT C: SCANIA (Already in Production)
# "This one simulates a project that is already halfway done"
echo "4. Creating Project C (Regular - Scania)..."

# Note: We create it, and theoretically, you would update the productionStage later
curl -s -X POST "$API_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "assyNumber": "772-5501-AA",
    "customer": "Scania",
    "totalPo": "50 Sets",
    "plotting": "REGULAR",
    "orderDate": "2026-01-01T09:00:00.000Z",
    "etd": "2026-01-15T17:00:00.000Z",
    "pmId": "'"$PM_ID"'"
  }' | grep "id" > /dev/null && echo "   -> Success!" || echo "   -> Failed"

echo "--------------------------------"
echo "🎉 SEEDING COMPLETE!"
echo "   Run 'npx prisma studio' to verify you have 3 Projects and 18 WorkOrders."