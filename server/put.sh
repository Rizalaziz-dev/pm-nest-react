#!/bin/bash

curl -X PUT http://localhost:3000/users/23hfy56 \
-H "Content-Type: application/json" \
-d '{
    "name": "John Doe",
    "description": "A sample user"
}'