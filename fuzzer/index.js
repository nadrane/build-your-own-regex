const fs = require("fs");
const path = require("path");
const fuzzer = require('./fuzzer')
const corpus = fs.readFileSync(path.join(__dirname, "corpus.txt")).toString();
fuzzer(99999, corpus)