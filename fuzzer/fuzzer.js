const fs = require("fs");
const path = require('path')
const corpus = fs.readFileSync(path.join(__dirname, "corpus.txt")).toString()
const assert = require("assert");
const myRegex = require('../solution').search

const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");
const uppercase = lowercase.map(letter => letter.toUpperCase());
const special = ["?", "*", "."];
const regexGrammar = special.concat(lowercase, uppercase);

function generateRegex(n) {
  let regexString = new Array(n)
    .fill(0)
    .map(chooseOne)
    .join("");
  if (Math.random() < 0.1) regexString = "^" + regexString;
  if (Math.random() < 0.1) regexString = regexString + "$";
  if (!validRegex(regexString)) {
    return generateRegex(n);
  }
  return new RegExp(regexString);
}

function validRegex(regexString) {
  return (
    regexString.indexOf("**") === -1 &&
    regexString.indexOf("??") === -1 &&
    regexString.indexOf("*?") === -1 &&
    regexString.indexOf("?*") === -1 &&
    regexString.indexOf("^?") === -1 &&
    regexString.indexOf("^*") === -1 &&
    !regexString.startsWith('*') &&
    !regexString.startsWith('?')
  );
}

function chooseOne() {
  return regexGrammar[Math.floor(Math.random() * regexGrammar.length)];
}

// Thank you Mozzila :) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function fuzzer(totalTests) {
  const maxRegexLength = 50; // max will actually be this minus 1
  let testsRun = 0;
  while (testsRun < totalTests) {
    const testRegex = generateRegex(getRandomInt(1, 50)); // only test patterns greater than size 1
    const testPattern = testRegex.toString().split('/')[1]
    try {
      assert.equal(testRegex.test(corpus), myRegex(testPattern, corpus))
    } catch(err) {
      console.log('TR:', testRegex)
      console.log('err', err)
    }
    testsRun++;
  }
}

module.exports = fuzzer
