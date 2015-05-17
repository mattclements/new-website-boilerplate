#!/bin/bash
rm -Rf .git
rm -f cleanup.sh

git init
git add .
git commit -m 'Initial Commit'

echo "All ready to go!"