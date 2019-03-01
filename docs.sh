#!/usr/bin/env bash

# Build docs w/ Java 8
# This exists mainly for me because javadoc tooling is dumb with lombok

rm -rf docs
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk/"
mvn clean compile javadoc:javadoc
cp -r target/site/apidocs ./docs