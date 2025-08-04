/*!
 * @fileoverview logger.js – CLIENT-SIDE DEVELOPMENT LOGGER WITH MULTI-LEVEL CONSOLE WRAPPERS AND DYNAMIC ENV CHECKS
 *
 * @author © 2025 sandokan.cat – https://sandokan.cat
 * @license MIT – https://opensource.org/licenses/MIT
 * @version 1.0.0
 * @since 1.0.0
 * @date 2025-08-04
 * @see https://open-utils-dev-sandokan-cat.vercel.app/js/README.md
 *
 * @module logger
 * @exports logEnable
 * @exports logDisable
 * @exports logClear
 * @exports logError
 * @exports logWarn
 * @exports logInfo
 * @exports logDebug
 * @exports logNormal
 * @exports logTrace
 * @exports logAssert
 * @exports logDir
 * @exports logTable
 * @exports logCount
 * @exports logCountReset
 * @exports logTime
 * @exports logTimeEnd
 * @exports logTimeLog
 * @exports logWithGroup
 * @exports logWithGroupCollapse
 *
 * @description
 * This module provides enhanced logging utilities for browser-based development.
 * Logs are environment-aware (development only) and can be globally silenced via localStorage.
 * It supports standard and custom log levels with fallback handling for invalid ones.
 * It also wraps advanced console methods like groups, timers, counters, and structured outputs.
 *
 * @function logEnable – Enables logs explicitly via localStorage
 * @function logDisable – Silences all logs regardless of environment
 * @function logClear – Clears the console if logging is enabled
 * @function logError – Prints errors with ❌ prefix and timestamp
 * @function logWarn – Prints warnings with ⚠️ prefix and timestamp
 * @function logInfo – Prints informational logs with ℹ️ prefix and timestamp
 * @function logDebug – Prints debug logs with 🛠️ prefix and timestamp
 * @function logNormal – Standard console.log with 📋 prefix and timestamp
 * @function logTrace – Prints stack trace with 🔎 prefix and timestamp
 * @function logAssert – Uses console.assert with timestamped feedback
 * @function logDir – Logs object structure with timestamp
 * @function logTable – Logs data in tabular format with timestamp
 * @function logCount – Increments a named log counter
 * @function logCountReset – Resets a named counter
 * @function logTime – Starts a named timer
 * @function logTimeEnd – Ends and logs a named timer
 * @function logTimeLog – Logs the current time of an ongoing timer
 * @function logWithGroup – Groups logs together in an expanded group
 * @function logWithGroupCollapse – Groups logs together in a collapsed group
 *
 * @param {string} [label="default"] – Optional label for timers, counters, or groups
 * @param {boolean} [condition] – Boolean condition for logAssert
 * @param {...any} args – Arguments to be logged
 *
 * @returns {void}
 *
 * @throws {TypeError} – If called with incorrect parameter types (in rare edge cases)
 *
 * @example
 * logError("Something went wrong", error);
 * logWithGroup("Fetch Results", () => {
 *   logInfo("User:", user);
 *   logTable(data);
 * });
 *
 * @internal Invalid log levels are caught and deferred using setTimeout
 *
 * @todo Add optional log persistence in localStorage for debugging after reloads
 * @todo Expose configuration to override default log icons or behaviors
 */

// GLOBAL CONSTANTS
const isDev = import.meta.env?.MODE === 'development' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' || 
    location.hostname === '0.0.0.0';

const isSilent = localStorage.getItem('log:silent') === 'true';

const icons = {
    error: '❌',
    warn: '⚠️',
    info: 'ℹ️',
    debug: '🛠️',
    log: '📋',
    trace: '🔎',
};

const invalidLogsByLevel = new Map();

// MAIN FUNCTION
const log = (level = 'log', msg, ...args) => {
    if (!isDev || isSilent) return;

    const timestamp = new Date().toLocaleString();
    const method = console[level] ?? console.log;

    if (icons[level]) {
        method(`${icons[level]} ${timestamp} ${msg}`, ...args);
    } else {
        if (!invalidLogsByLevel.has(level)) {
            invalidLogsByLevel.set(level, []);
        }
        invalidLogsByLevel.get(level).push({ timestamp, msg, args });

        if (invalidLogsByLevel.get(level).length === 1) {
            setTimeout(() => {
                const logs = invalidLogsByLevel.get(level);
                console.group(`⚠️ Invalid log level: "${level}" — Fallback to console.log`);
                logs.forEach(({ timestamp, msg, args }) => {
                    console.log(`${timestamp} ${msg}`, ...args);
                });
                console.groupEnd();
                invalidLogsByLevel.delete(level);
            }, 0);
        }
    }
};

// LOGGER API EXPORT
const logger = {
    enable: () => localStorage.setItem('log:silent', 'false'),
    disable: () => localStorage.setItem('log:silent', 'true'),
    clear: () => { if (isDev && !isSilent) console.clear(); },

    error: (...args) => log('error', ...args),
    warn: (...args) => log('warn', ...args),
    info: (...args) => log('info', ...args),
    debug: (...args) => log('debug', ...args),
    normal: (...args) => log('log', ...args),
    trace: (...args) => log('trace', ...args),

    assert: (condition, ...args) => {
        if (isDev && !isSilent) {
            const timestamp = new Date().toLocaleString();
            console.assert(condition, `🧪 ${timestamp}`, ...args);
        }
    },

    dir: (...args) => {
        if (isDev && !isSilent) {
            const timestamp = new Date().toLocaleString();
            console.dir(`${timestamp}`, ...args);
        }
    },

    table: (...args) => {
        if (isDev && !isSilent) {
            const timestamp = new Date().toLocaleString();
            console.table(`${timestamp}`, ...args);
        }
    },

    count: (label = 'default') => { if (isDev && !isSilent) console.count(label); },
    countReset: (label = 'default') => { if (isDev && !isSilent) console.countReset(label); },

    time: (label = 'default') => { if (isDev && !isSilent) console.time(label); },
    timeEnd: (label = 'default') => { if (isDev && !isSilent) console.timeEnd(label); },
    timeLog: (label = 'default') => { if (isDev && !isSilent) console.timeLog(label); },

    withGroup: (label, callback) => {
        if (!isDev || isSilent) return;
        console.group(label);
        callback();
        console.groupEnd();
    },

    withGroupCollapse: (label, callback) => {
        if (!isDev || isSilent) return;
        console.groupCollapsed(label);
        callback();
        console.groupEnd();
    }
};

export default logger;