function matchOne(pattern, text) {
  if (!text) return false;
  return pattern[0] === "." || text[0] === pattern[0];
}

function search(pattern, text) {
  if (pattern[0] === "^") {
    return match(pattern.slice(1), text);
  } else {
    return match(".*" + pattern, text);
  }
}

function match(pattern, text) {
  if (!pattern) return true;
  else if (!text && pattern === "$") return true;
  else if (pattern.length > 1 && "?" === pattern[1]) {
    return matchQuestion(pattern, text);
  } else if (pattern.length > 1 && "*" === pattern[1]) {
    return matchStar(pattern, text);
  } else {
    return matchOne(pattern[0], text[0]) && match(pattern.slice(1), text.slice(1));
  }
}

function matchQuestion(pattern, text) {
  if (matchOne(pattern[0], text[0]) && match(pattern.slice(2), text.slice(1))) {
    return true;
  } else {
    return match(pattern.slice(2), text);
  }
}

function matchStar(pattern, text) {
  return (
    (matchOne(pattern[0], text[0]) && match(pattern, text.slice(1))) ||
    match(pattern.slice(2), text)
  );
}

module.exports = {
  matchOne,
  matchQuestion,
  match,
  search
};
