function matchOne(pattern, text) {
  if (!text) return false;
  return pattern[0] === "." || text[0] === pattern[0];
}

function search(pattern, text) {
  if (pattern[0] === "^") {
    return match(pattern.slice(1), text);
  } else if (!text){
    return match(pattern, text)
  } else {
    // If the pattern works given any starting location in the text
    return text.split("").some((_, index) => {
      return match(pattern, text.slice(index));
    });
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
  console.log("pattern", pattern, "text", text)
  if (matchOne(pattern[0], text[0])) {
    return match(pattern, text.slice(1))
  } else {
    return match(pattern.slice(2), text)
  }
}

module.exports = {
  matchOne,
  matchQuestion,
  match,
  search
};
