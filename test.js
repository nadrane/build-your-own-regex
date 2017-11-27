const { expect } = require("chai");
const mocha = require("mocha");
const { matchOne, search } = require("./regex");

describe("regex", function() {
  describe("matchOne", function() {
    it("should return true when the text matches the pattern.", function() {
      const pattern = "a";
      const text = "a";
      expect(matchOne(pattern, text)).to.equal(true);
    });
    it("should return false when the text is an empty string", function() {
      const pattern = "b";
      const text = "";
      expect(matchOne(pattern, text)).to.equal(false);
    });
    it("should return false when the text does not match the pattern", function() {
      const pattern = "a";
      const text = "c";
      expect(matchOne(pattern, text)).to.equal(false);
    });
    it("should match any character against a '.'", function() {
      expect(matchOne(".", "c")).to.equal(true);
      expect(matchOne(".", "q")).to.equal(true);
    });
  });

  describe("search", function() {
    it("should return true if given an empty pattern", function() {
      expect(search("", "abc")).to.equal(true);
      expect(search("", "cab")).to.equal(true);
    });
    it("should match an empty string to the end of line pattern '$'", function() {
      expect(search("", "$")).to.equal(true);
    });

    describe("patterns starting with '^'", function() {
      it("should match a longer sequence of characters", function() {
        expect(search("^please work", "please work")).to.equal(true);
        expect(search("^good test", "good test")).to.equal(true);

        expect(search("^bad", "test")).to.equal(false);
        expect(search("^also bad test", "also bad tst")).to.equal(false);
      });
      it("should still support the wildcard character '.'", function() {
        expect(search("^a good t.st", "a good test")).to.equal(true);
        expect(search("^an.ther g..d test", "another good test")).to.equal(true);

        expect(search("^b.d test", "baad test")).to.equal(false);
      });
      it("should still support end of string character '$'", function() {
        expect(search("^match end$", "match end")).to.equal(true);

        expect(search("^match$", "match end")).to.equal(false);
      });
      it("should support partial matches", function() {
        expect(search("^partial", "partial match")).to.equal(true);
        expect(search("^good", "good test")).to.equal(true);

        expect(search("^od te", "good test")).to.equal(false);
        expect(search("^oos", "good test")).to.equal(false);
      });
    });
    describe("patterns not starting with '^'", function() {
      it("should match a sequence of characters inside a larger text body", function() {
        expect(search("match", "this is a match")).to.equal(true);
        expect(search("what", "this is what we are doing")).to.equal(true);
        expect(search("is what", "this is what we are doing")).to.equal(true);

        expect(search("iswhat", "this is what we are doing")).to.equal(false);
        expect(search("blah", "this is what we are doing")).to.equal(false);
      });
    });
  });
});
