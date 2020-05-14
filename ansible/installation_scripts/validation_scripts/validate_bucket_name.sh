#!/bin/bash

VAL_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$VAL_DIR" ]]; then VAL_DIR="$PWD"; fi


s3_input_bucket=`grep 's3_input_bucket:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
s3_output_bucket=`grep 's3_output_bucket:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
s3_emission_bucket=`grep 's3_emission_bucket:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`

number_err_count=0
for value in $s3_input_bucket $s3_output_bucket $s3_emission_bucket
do
if [[ "$value" == *[0123456789] ]]; then
    tput setaf 1; echo "Bucket name [ $value ] should not end with numbers. Please change the bucket name."; tput sgr0
    number_err_count=1
fi
done
[[ $number_err_count == 1 ]] && exit;

do_validation()
{
bucketstatus=`aws s3api head-bucket --bucket "${1}" 2>&1`
if [ $? == 0 ]
then
    tput setaf 3; echo "Warning: [ $2 ]:[ $1 ] Bucket owned and already exists"; tput sgr0
    while true; do
    read -p "Do you want to continue with same bucket name [$1] as [$2]? (yes/no): " answer
    case $answer in
        yes )
		count=0
		break
	    ;;
        no )
		tput setaf 3; echo "Aborting the installation..."; tput sgr0
		tput setaf 3; echo "Please change the $2 value in vars/main.yml and start the installation."; tput sgr0
		exit;
		break
	    ;;
        * )
		echo "Please enter yer or no ";;
    esac
    done
    count=0
elif [[ $bucketstatus == *"Not Found"* ]]
then
    echo "Bucket name $1 is available."
    count=0
elif [[ "$bucketstatus" == *"Forbidden"* ]]
then
    tput setaf 1; echo "Error: [ $2 : $1 ] Bucket already exists but not owned. Please change the bucket name in vars/main.yml"; tput sgr0
    count=1
elif [[ "$bucketstatus" == *"Bad Request"* ]]
then
  tput setaf 1; echo "Error: [ $2 : $1 ] Bucket name should be between 3 and 63 characters. Please change the bucket name in vars/main.yml"; tput sgr0
  count=1
else
  tput setaf 1; echo "Error: [ $2 : $1 ] $bucketstatus"; tput sgr0
  count=1
fi
return "$count"
}

do_validation $s3_input_bucket s3_input_bucket
i_count=$count
do_validation $s3_output_bucket s3_output_bucket
o_count=$count
do_validation $s3_emission_bucket s3_emission_bucket
e_count=$count

if [ $i_count == 1 ]; then
    tput setaf 1; echo "If bucket name are properly provided as per the naming convention, then aws_access_key and aws_secret_key are invalid or keys doesn't have the permission to create buckets"; tput sgr0
    exit;
elif [ $o_count == 1 ]; then
    tput setaf 1; echo "If bucket name are properly provided as per the naming convention, then aws_access_key and aws_secret_key are invalid or keys doesn't have the permission to create buckets"; tput sgr0
    exit;
elif [ $e_count == 1 ]; then
    tput setaf 1; echo "If bucket name are properly provided as per the naming convention, then aws_access_key and aws_secret_key are invalid or keys doesn't have the permission to create buckets"; tput sgr0
    exit;
else
    echo ""
 fi
