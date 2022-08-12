function buildMatch(arr) {
  if (arr[0] == undefined || arr[0] == "") {
    return { $nin: [] };
  } else {
    return { $in: arr };
  }
}

module.exports = buildMatch;
