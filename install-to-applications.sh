#!/bin/bash

# Install PacificWaves to Applications folder

echo "🌊 Installing PacificWaves to Applications..."

# Check if app exists
if [ ! -d "PacificWaves.app" ]; then
    echo "❌ Error: PacificWaves.app not found in current directory"
    exit 1
fi

# Copy to Applications
if [ -d "/Applications/PacificWaves.app" ]; then
    echo "⚠️  PacificWaves.app already exists in Applications"
    read -p "Overwrite? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
    rm -rf "/Applications/PacificWaves.app"
fi

cp -R "PacificWaves.app" "/Applications/"

if [ $? -eq 0 ]; then
    echo "✅ PacificWaves installed to /Applications"
    echo ""
    echo "You can now:"
    echo "  • Find it in Launchpad"
    echo "  • Pin it to your Dock"
    echo "  • Launch with Spotlight (Cmd+Space, type 'PacificWaves')"
    echo ""
    read -p "Open Applications folder? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open /Applications
    fi
else
    echo "❌ Installation failed"
    exit 1
fi
