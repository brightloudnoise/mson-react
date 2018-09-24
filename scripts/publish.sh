#!/usr/bin/env bash

# For safety
git add -A && git stash
git checkout master

# Get current version
VERSION=$(node --eval "console.log(require('./package.json').version);")

# Set the version in master
git add -A
git commit -m "$VERSION"
git push origin master

# Compile JS
yarn compile

# Publish npm release
npm publish

# Tag and push
git tag $VERSION
git push origin master --tags $VERSION