#!/bin/bash/

base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' ~/cQube_Base/migrate_config.yml)
s3_output_bucket=$(awk ''/^s3_output_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' ~/cQube_Base/migrate_config.yml)
bucket=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_S3_OUTPUT )
output_bucket=$(cut -d "=" -f2 <<< "$bucket")
echo $output_bucket

