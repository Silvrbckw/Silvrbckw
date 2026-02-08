#!/bin/bash
echo "🔱 [DETROIT-ALPHA] : Initiating Morning Pulse Check..."
echo "---------------------------------------------------------"

# 1. Check Local Integrity
echo "📂 [LOCAL] : Verifying Vault and Logic..."
ls -F | grep -E 'README.md|sentinel_monitor.ts|.env.local'

# 2. Check AI Gateway
echo "🤖 [SENTINEL] : Testing AI Handshake..."
npx tsx sentinel_monitor.ts | grep "STATUS"

# 3. Check Cloud Sync
echo "☁️  [CLOUD] : Checking GitHub Alignment..."
git fetch origin
LOCAL_HASH=$(git rev-parse @)
REMOTE_HASH=$(git rev-parse @{u})
if [ $LOCAL_HASH = $REMOTE_HASH ]; then
    echo "✅ [SYNC] : Detroit Node and GitHub HQ are perfectly aligned."
else
    echo "⚠️  [SYNC] : Divergence detected. Manual sync required."
fi

echo "---------------------------------------------------------"
echo "🔱 [SEQUENCE COMPLETE] : System Ready for Swap API Integration."
