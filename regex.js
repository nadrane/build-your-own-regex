function matchOne(pattern, text) {
  if (text.length === 0) return false;
  return pattern[0] === "." || text[0] === pattern[0];
}

function search(pattern, text) {
  if (pattern[0] === "^") {
    return match(pattern.slice(1), text);
  } else if (pattern.length > 0){
    // If the pattern works given any starting location in the text
    return text.split('').some((_, index) => {
      return match(pattern, text.slice(index))
    })
  } else {
    return match(pattern, text)
  }
}

function match(pattern, text) {
  if (!pattern) return true;
  else if (!text && pattern === "$") return true;
  else {
    return matchOne(pattern[0], text[0]) && match(pattern.slice(1), text.slice(1));
  }
}

module.exports = {
  matchOne,
  search
};
