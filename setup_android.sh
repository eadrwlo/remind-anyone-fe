#!/bin/bash
set -e

SDK_DIR="$HOME/android-sdk"
mkdir -p "$SDK_DIR/cmdline-tools"

# Use local zip file
ZIP_FILE="$HOME/commandlinetools-linux-14742923_latest.zip"

if [ ! -f "$ZIP_FILE" ]; then
    echo "Error: Zip file not found at $ZIP_FILE"
    exit 1
fi

if [ ! -d "$SDK_DIR/cmdline-tools/latest" ]; then
    echo "Extracting Command Line Tools..."
    unzip -q "$ZIP_FILE" -d "$SDK_DIR/cmdline-tools"

    # Fix structure for sdkmanager (needs to be cmdline-tools/latest/bin)
    # The zip usually contains a "cmdline-tools" folder
    mv "$SDK_DIR/cmdline-tools/cmdline-tools" "$SDK_DIR/cmdline-tools/latest"
else
    echo "Command Line Tools already present."
fi

echo "Installing SDK components..."
# We install platform-tools here as it is required for building.
# It will be installed in $SDK_DIR/platform-tools.
# Your existing adb in /usr/lib/android-sdk/platform-tools/adb will ideally remain untouched.
# You can choose which one to use by adjusting your PATH.
yes | "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK_DIR" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo "Setup complete."
echo ""
echo "To use this SDK, run:"
echo "export ANDROID_HOME=$SDK_DIR"
echo "export PATH=\$ANDROID_HOME/platform-tools:\$ANDROID_HOME/cmdline-tools/latest/bin:\$PATH"
