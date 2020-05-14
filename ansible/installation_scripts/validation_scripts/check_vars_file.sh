#!/bin/bash
  
VAL_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$VAL_DIR" ]]; then VAL_DIR="$PWD"; fi

count=0

while read line; do
  filtered_line=`grep ^$line $VAL_DIR/../vars/main.yml`
  r_vars=`echo $filtered_line | awk -v var="$line" '$0 ~ var{ if ($2 !~ /#.*/) {print $2}}'`
  #r_vars=$(awk -v var="$line" '$1 ^var{ if ($2 !~ /#.*/) {print $2}}' $VAL_DIR/../vars/main.yml)
  if [[ $r_vars == "" ]]
  then
      tput setaf 1; echo "Error in vars/main.yml file: $line is not defined"; tput sgr0
      count=1
  fi
done <$VAL_DIR/required_vars.yml
if [ $count == 1 ]; then
    exit;
fi

