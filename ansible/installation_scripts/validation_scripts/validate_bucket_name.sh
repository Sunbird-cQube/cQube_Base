#!/bin/bash

VAL_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$VAL_DIR" ]]; then VAL_DIR="$PWD"; fi


s3_input_bucket=`grep 's3_input_bucket:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
s3_output_bucket=`grep 's3_output_bucket:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
s3_emission_bucket=`grep 's3_emission_bucket:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`

do_validation()
{
bucketstatus=`aws s3api head-bucket --bucket "${1}" 2>&1`
if [ $? == 0 ]
then
    echo "Error: [ $2 ] Bucket Owned or exists. Please change the bucket name"
#elif [[ $bucketstatus == *"Not Found"* ]]
#then
#    echo "Success! Bucket name available." 
elif [[ "$bucketstatus" == *"Forbidden"* ]]
then
    echo "Error: [ $2 ] Bucket exists but not owned. Please change the bucket name"
elif [[ "$bucketstatus" == *"Bad Request"* ]]
then
  echo "Error: [ $2 ] Bucket name should be between 3 and 63 characters. Please change the bucket name"
else
  echo "Error: [ $2 ] $bucketstatus";
fi
}

do_validation $s3_input_bucket s3_input_bucket
do_validation $s3_output_bucket s3_output_bucket
do_validation $s3_emission_bucket s3_emission_bucket

