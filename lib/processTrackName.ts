export default function processTrackName(trackName: string, charLimit: number) {
  if (trackName.length > charLimit) {
    for (var i = charLimit; trackName[i] !== " "; i--) {}
    return trackName.substring(0, i) + "...";
  } else {
    return trackName;
  }
}
