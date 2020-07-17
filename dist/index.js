"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const child_process_1 = require("child_process");
const path_1 = require("path");
const os_1 = require("os");
let registeredEvents = [];
let mouseProcess = false;
class MouseEvents extends events_1.EventEmitter {
    constructor() {
        super();
        if (os_1.platform() !== "win32")
            return;
        this.on("newListener", event => {
            if (registeredEvents.indexOf(event) !== -1)
                return;
            if ((event === "mouse-up" ||
                event === "mouse-down" ||
                event === "mouse-move") &&
                !mouseProcess) {
                mouseProcess = child_process_1.fork(path_1.join(__dirname, "../mouse.js"));
                mouseProcess.on("message", msg => {
                    this.emit(msg.event, { x: msg.x, y: msg.y, button: msg.button });
                });
            }
            else {
                return;
            }
            registeredEvents.push(event);
        });
        this.on("removeListener", event => {
            if (this.listenerCount(event) > 0)
                return;
            if ((event === "mouse-up" ||
                event === "mouse-down" ||
                event === "mouse-move") &&
                mouseProcess) {
                mouseProcess.kill();
                mouseProcess = false;
            }
            registeredEvents = registeredEvents.filter(x => x !== event);
        });
    }
}
const mouseEvents = new MouseEvents();
//exports.default = mouseEvents;
module.exports = mouseEvents;
//# sourceMappingURL=index.js.map