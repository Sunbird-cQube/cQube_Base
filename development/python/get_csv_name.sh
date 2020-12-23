#!/bin/bash
unzip -l $1 | grep csv | awk '{print $4}'
