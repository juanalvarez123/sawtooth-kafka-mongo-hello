#!/bin/bash

#Start newtork before app to avoid connection error

# HOST1="localhost:4000"
# HOST2="localhost:4000"

HOST1="192.168.99.100:30001"
HOST2="192.168.99.100:30002"


HOST="$HOST1"
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"axficionado@hotmail.com","name":"Carlos Mario Sarmiento","role":"coordinador","password":"sasuke22"}' \
  "$HOST"/api/auth/create

echo ""
sleep 1

TOKEN=$(curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"axficionado@hotmail.com","password":"sasuke22"}' \
  "$HOST"/api/auth | jq '.token' | cut -c 2- | rev | cut -c 2- | rev)

echo "TOKEN:"
echo "$TOKEN"
echo ""
sleep 1

curl --header "Content-Type: application/json" \
  --header "Authorization: ${TOKEN}" \
  --request POST \
  --data '{"id":"2","bloodType":"O+"}' \
  "$HOST"/api/hemocomponents

echo ""
sleep 5

echo "---GET---"

curl --header "Content-Type: application/json" \
  --header "Authorization: ${TOKEN}" \
  --request GET \
  "$HOST"/api/hemocomponents/2

echo


#----------

HOST="$HOST2"
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"axficionado2@hotmail.com","name":"Carlos Mario Sarmiento","role":"coordinador","password":"sasuke22"}' \
  "$HOST"/api/auth/create

echo ""
sleep 1

TOKEN=$(curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"axficionado2@hotmail.com","password":"sasuke22"}' \
  "$HOST"/api/auth | jq '.token' | cut -c 2- | rev | cut -c 2- | rev)

echo "TOKEN:"
echo "$TOKEN"
echo ""
sleep 1

curl --header "Content-Type: application/json" \
  --header "Authorization: ${TOKEN}" \
  --request POST \
  --data '{"id":"3","bloodType":"O+"}' \
  "$HOST"/api/hemocomponents

echo ""
sleep 5

echo "---GET---"

curl --header "Content-Type: application/json" \
  --header "Authorization: ${TOKEN}" \
  --request GET \
  "$HOST"/api/hemocomponents/3

echo