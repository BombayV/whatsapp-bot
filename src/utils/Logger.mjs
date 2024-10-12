import { red, yellow, green, gray, blue } from 'colorette';

export class Logger {
    constructor(debug) {
        this.debug = debug;
    }

    info(message) {
        const logMessage = `${this.newTimestamp()} ${blue('[INFO]')} ${message}`;
        return console.log(logMessage);
    }

    success(message) {
        if (!this.debug) return;
        const logMessage = `${this.newTimestamp()} ${green('[SUCCESS]')} ${message}`;
        return console.log(logMessage);
    }

    warn(message) {
        const logMessage = `${this.newTimestamp()} ${yellow('[WARN]')} ${message}`;
        return console.log(logMessage);
    }

    error(message) {
        const logMessage = `${this.newTimestamp()} ${red('[ERROR]')} ${message}`;
        return console.log(logMessage);
    }

    debug(data) {
        if (!this.debug) return;
        return console.table(data);
    }

    newTimestamp() {
        return gray(`[${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}]`);
    }
}