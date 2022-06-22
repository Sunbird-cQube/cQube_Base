#!/bin/bash

base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' ~/cQube_Base/migrate_config.yml)

dir=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_INPUT_DIRECTORY )
input_path=$(cut -d "=" -f2 <<< "$dir")

echo $input_path
