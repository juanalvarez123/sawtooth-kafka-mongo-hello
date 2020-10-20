#!/bin/bash

# kubectl get services -o json | jq '.items[].spec.ports[]'

RES=$(kubectl get services -o go-template \
  --template='{{range .items}}{{range .spec.ports}}{{if .nodePort}}{{.targetPort}}{{"\t"}}{{.nodePort}}{{"\n"}}{{end}}{{end}}{{end}}')


# echo "$RES"


while read line ; do
  nodePort=$(echo "$line" | sed 's/^\(\S\+\)\s*\(\S*\)/\1/g')
  nodeTarget=$(echo "$line" | sed 's/^\(\S\+\)\s*\(\S*\)/\2/g')
 
  if [[ "$nodePort" == "kafka-external" ]]; then
    echo "HOST_CONSUMER=192.168.99.100:$nodeTarget" 
    echo "HOST_PRODUCER=192.168.99.100:$nodeTarget" 
  fi 
done <<< "$RES"

