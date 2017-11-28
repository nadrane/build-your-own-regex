const { expect } = require("chai");
const mocha = require("mocha");
const { matchOne, match, search, matchQuestion } = require("./regex");

describe("regex", () => {
  describe("matchOne", () => {
    it("should return true when the text matches the pattern.", () => {
      const pattern = "a";
      const text = "a";
      expect(matchOne(pattern, text)).to.equal(true);
    });
    it("should return false when the text is an empty string", () => {
      const pattern = "b";
      const text = "";
      expect(matchOne(pattern, text)).to.equal(false);
    });
    it("should return false when the text does not match the pattern", () => {
      const pattern = "a";
      const text = "c";
      expect(matchOne(pattern, text)).to.equal(false);
    });
    it("should match any character against a '.'", () => {
      expect(matchOne(".", "c")).to.equal(true);
      expect(matchOne(".", "q")).to.equal(true);
    });
  });

  describe("match", () => {
    it("should return true if given an empty pattern", () => {
      expect(match("", "abc")).to.equal(true);
      expect(match("", "cab")).to.equal(true);
    });
    it("should match an empty string to the end of line pattern '$'", () => {
      expect(match("", "$")).to.equal(true);
    });
  });
  describe("search", () => {
    describe("patterns starting with '^'", () => {
      it("should match a longer sequence of characters", () => {
        expect(search("^please work", "please work")).to.equal(true);
        expect(search("^good test", "good test")).to.equal(true);

        expect(search("^bad", "test")).to.equal(false);
        expect(search("^also bad test", "also bad tst")).to.equal(false);
      });
      it("should still support the wildcard character '.'", () => {
        expect(search("^a good t.st", "a good test")).to.equal(true);
        expect(search("^an.ther g..d test", "another good test")).to.equal(true);

        expect(search("^b.d test", "baad test")).to.equal(false);
      });
      it("should still support end of string character '$'", () => {
        expect(search("^match end$", "match end")).to.equal(true);

        expect(search("^match$", "match end")).to.equal(false);
      });
      it("should support partial matches", () => {
        expect(search("^partial", "partial match")).to.equal(true);
        expect(search("^good", "good test")).to.equal(true);

        expect(search("^bad", "ba test")).to.equal(false);
      });
    });
    describe("patterns not starting with '^'", () => {
      it("should match a sequence of characters inside a larger text body", () => {
        expect(search("match", "this is a match")).to.equal(true);
        expect(search("what", "this is what we are doing")).to.equal(true);
        expect(search("is what", "this is what we are doing")).to.equal(true);

        expect(search("iswhat", "this is what we are doing")).to.equal(false);
        expect(search("blah", "this is what we are doing")).to.equal(false);
      });
    });
  });
  describe("should match 0 or 1 of the following character a '?'", () => {
    it("supports `?` anywhere in the pattern", () => {
      expect(search("this is? it", "this is it")).to.equal(true);
      expect(search("this is? it", "this is it")).to.equal(true);
      expect(search("this is? it", "this i it")).to.equal(true);

      expect(search("i?", "this i it")).to.equal(true);
      expect(search("one?", "i am the one")).to.equal(true);
      expect(search("one?", "i am the on")).to.equal(true);

      expect(search("is? it? r?e?a?lly", "is it really")).to.equal(true);
      expect(search("is? it? r?e?a?lly", "i i lly")).to.equal(true);

      expect(search("is? it? r?e?a?lly", "i i ly")).to.equal(false);
    });
  });

  describe("should match 0 or more characters following an '*'", () => {
    it.only("supports `*` anywhere in the pattern", () => {
      expect(search("a*", "")).to.equal(true);
      expect(search("a*", "a")).to.equal(true);
      expect(search("a*", "aaaaa")).to.equal(true);

      expect(search("b*", "aaaaa")).to.equal(true);
      expect(search("ab*", "aaaaa")).to.equal(true);
      expect(search("aaaab*", "aaaaa")).to.equal(true);

      expect(search("this* i*s the str*ing", "thissss s the strrring")).to.equal(true);
      expect(search("this* i*s the str*ing", "thissss i the strrrng")).to.equal(false);
      expect(search("this* i*s the str*ing", "thissss i the srrrng")).to.equal(false);
    });
  });
});
