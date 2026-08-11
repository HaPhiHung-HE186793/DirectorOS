#!/bin/sh
# ----------------------------------------------------------------------------
# Apache Maven Wrapper Startup Batch Script
# ----------------------------------------------------------------------------
set -e

# Find JAVA_HOME or java executable
if [ -n "$JAVA_HOME" ] && [ -x "$JAVA_HOME/bin/java" ]; then
    JAVACMD="$JAVA_HOME/bin/java"
else
    JAVACMD="java"
fi

if ! command -v "$JAVACMD" >/dev/null 2>&1; then
    echo "Error: JAVA_HOME is not set and 'java' command was not found in PATH." >&2
    exit 1
fi

MAVEN_PROJECTBASEDIR="${MAVEN_BASEDIR:-$(pwd)}"
MAVEN_WRAPPER_JAR="$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar"
WRAPPER_PROPERTIES="$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.properties"

# Download wrapper jar if not present
if [ ! -f "$MAVEN_WRAPPER_JAR" ]; then
    mkdir -p "$MAVEN_PROJECTBASEDIR/.mvn/wrapper"
    echo "Downloading Maven Wrapper JAR..."
    WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
    if command -v curl >/dev/null 2>&1; then
        curl -s -L "$WRAPPER_URL" -o "$MAVEN_WRAPPER_JAR"
    elif command -v wget >/dev/null 2>&1; then
        wget -q "$WRAPPER_URL" -O "$MAVEN_WRAPPER_JAR"
    else
        echo "Error: Neither curl nor wget found to download maven-wrapper.jar" >&2
        exit 1
    fi
fi

exec "$JAVACMD" \
    -classpath "$MAVEN_WRAPPER_JAR" \
    "-Dmaven.home=$MAVEN_PROJECTBASEDIR/.mvn/wrapper" \
    "-Dmaven.multiModuleProjectDirectory=$MAVEN_PROJECTBASEDIR" \
    org.apache.maven.wrapper.MavenWrapperMain "$@"
