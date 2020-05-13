#!/bin/bash
  
VAL_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$VAL_DIR" ]]; then VAL_DIR="$PWD"; fi

while read line; do
  r_vars=$(awk -v var="$line" '$0 ~ var { if ($2 !~ /#.*/) {print $2}}' $VAL_DIR/../vars/main.yml)
  if [[ $r_vars == "" ]]
  then
      echo "Error in vars/main.yml file: $line is not defined"
  fi
done <$VAL_DIR/required_vars.yml

#p="system_user_name: "
#testing=$(awk -v var="$p" '$0 ~ var { if ($2 !~ /#.*/) {print $2}}' filed.txt)
#if [[ $testing == "" ]]
#then
#    echo "$p pls fill"
#fi

