import moment from "moment";

export function formatDuration(duration) {
    return moment
        .duration(duration, "seconds")
        .format("mm:ss", { trim: false });
}

export function formatDurationInMin(duration) {
    return moment
        .duration(duration, "seconds")
        .format("hh:mm", { trim: false });
}

module.exports = {
    formatDuration,
    formatDurationInMin
  }