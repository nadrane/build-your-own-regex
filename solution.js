//A walkthrough of this solution exists here: http://nickdrane.com/build-your-own-regex/

function matchOne(pattern, text) {
  if (!pattern) return true;
  if (!text) return false;
  return pattern === "." || text === pattern;
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
  else if (pattern[1] === "?") {
    return matchQuestion(pattern, text);
  } else if (pattern[1] === "*") {
    return matchStar(pattern, text);
  } else {
    return matchOne(pattern[0], text[0]) && match(pattern.slice(1), text.slice(1));
  }
}

function matchQuestion(pattern, text) {
  return (
    (matchOne(pattern[0], text[0]) && match(pattern.slice(2), text.slice(1))) ||
    match(pattern.slice(2), text)
  );
}

function matchStar(pattern, text) {
  return (
    (matchOne(pattern[0], text[0]) && match(pattern, text.slice(1))) ||
    match(pattern.slice(2), text)
  );
}

module.exports = {
  matchOne,
  match,
  search
};
