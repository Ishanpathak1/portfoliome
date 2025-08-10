#!/usr/bin/env node

/*
Usage:
  node scripts/broadcast-notification.js "Your message here" [--title "Optional Title"]

This appends an announcement into data/announcements.json.
The notifications API will read from this file and the NotificationProvider
will fetch and display it for all users.
*/

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { message: '', title: 'Announcement' };
  const parts = argv.slice(2);
  if (!parts[0]) {
    console.error('Error: message is required.');
    process.exit(1);
  }
  args.message = parts[0];
  for (let i = 1; i < parts.length; i++) {
    if (parts[i] === '--title' && parts[i + 1]) {
      args.title = parts[i + 1];
      i += 1;
    }
  }
  return args;
}

function ensureDataFile(filePath) {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ announcements: [] }, null, 2));
  }
}

function main() {
  const { message, title } = parseArgs(process.argv);
  const dataFile = path.join(process.cwd(), 'data', 'announcements.json');
  ensureDataFile(dataFile);

  const raw = fs.readFileSync(dataFile, 'utf-8');
  const data = JSON.parse(raw || '{"announcements": []}');
  const now = Date.now();
  const id = `announce-${now}`;
  const item = {
    id,
    kind: 'announcement',
    title,
    message,
    createdAt: now,
    read: false
  };
  data.announcements = [item, ...(Array.isArray(data.announcements) ? data.announcements : [])].slice(0, 100);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  console.log(`Broadcasted announcement: ${title}`);
}

main();

