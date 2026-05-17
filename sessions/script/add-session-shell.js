#!/usr/bin/env node

const path = require('path');

if (path.basename(process.cwd()) === 'sessions' && process.argv[2]?.startsWith('sessions/')) {
  process.argv[2] = process.argv[2].slice('sessions/'.length);
}

require('../../scripts/add-session-shell.js');
