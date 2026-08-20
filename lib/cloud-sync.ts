/**
 * Real-time Cross-Device Synchronization Helper
 * Ensures that edits made on Laptop/Desktop immediately broadcast
 * to all mobile devices (iPhone, Android) and public visitors worldwide.
 */

export async function syncToCloud(type: 'members' | 'news' | 'settings' | 'backgrounds', data: any) {
  // 1. Save to local browser storage
  const keyMap: Record<string, string> = {
    members: 'hmmj_custom_members',
    news: 'hmmj_custom_news',
    settings: 'hmmj_custom_settings',
    backgrounds: 'hmmj_custom_backgrounds',
  }
  try {
    localStorage.setItem(keyMap[type], JSON.stringify(data))
  } catch {}

  // 2. Broadcast to Cloud Store API for iPhone/Android cross-device sync
  try {
    await fetch('/api/v1/cloud-store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    })
  } catch {}
}

export async function fetchFromCloud(type: 'members' | 'news' | 'settings' | 'backgrounds') {
  const keyMap: Record<string, string> = {
    members: 'hmmj_custom_members',
    news: 'hmmj_custom_news',
    settings: 'hmmj_custom_settings',
    backgrounds: 'hmmj_custom_backgrounds',
  }

  // 1. Check local storage first
  try {
    const local = localStorage.getItem(keyMap[type])
    if (local !== null) {
      const parsed = JSON.parse(local)
      if (parsed) return parsed
    }
  } catch {}

  // 2. Fetch from Cloud Store API (for mobile devices)
  try {
    const res = await fetch(`/api/v1/cloud-store?type=${type}`)
    const json = await res.json()
    if (json && json[type]) {
      // Cache in localStorage for next time
      try {
        localStorage.setItem(keyMap[type], JSON.stringify(json[type]))
      } catch {}
      return json[type]
    }
  } catch {}

  return null
}
