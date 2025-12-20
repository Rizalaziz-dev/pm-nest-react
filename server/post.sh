#!/bin/bash

curl -X POST http://localhost:3000/users/user\
-H "Content-Type: application/json" \
-d '{
    "name": "John Doe",
    "email": "john@example.com"
    "password": "Rizal1234"
}'