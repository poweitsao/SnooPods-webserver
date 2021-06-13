import moment from "moment";

export default function formatDuration(duration) {
    return moment
        .duration(duration, "seconds")
        .format("mm:ss", { trim: false });
}

