const { expect } = require("chai");
const mocha = require("mocha");
const regex = require("./solution");
const search = regex.search;

describe("regex", () => {
  describe("matchOne", () => {
    it("should return true when the text matches the pattern.", () => {
      expect(regex.matchOne("a", "a")).to.equal(true);
    });
    it("should return true when the pattern is empty or undefined", () => {
      expect(regex.matchOne("", "")).to.equal(true);
      expect(regex.matchOne(undefined, "")).to.equal(true);
    });
    it("should return false when the text is an empty string or undefined but the pattern is defined", () => {
      expect(regex.matchOne("b", "")).to.equal(false);
      expect(regex.matchOne("b", undefined)).to.equal(false);
    });
    it("should return false when the text does not match the pattern", () => {
      expect(regex.matchOne("a", "c")).to.equal(false);
    });
    it("should match any character against a '.'", () => {
      expect(regex.matchOne(".", "c")).to.equal(true);
      expect(regex.matchOne(".", "q")).to.equal(true);
    });
  });

  describe("match", () => {
    it("should return true if given an empty pattern", () => {
      expect(regex.match("", "abc")).to.equal(true);
      expect(regex.match("", "cab")).to.equal(true);
    });
    it("should match an empty string to the end of line pattern '$'", () => {
      expect(regex.match("$", "")).to.equal(true);
      expect(regex.match("$", "abc")).to.equal(false);
    });

    it("should match an exact sequence of characters", () => {
      expect(regex.match("abc", "abc")).to.equal(true);
      expect(regex.match("bac", "bac")).to.equal(true);
    });

    /*
    If you passed the previous test with something like this:
        if (pattern === text) return true
    you probably want to go back and use the matchOne function. You should be able to come up with a
    recursive expression where you invoke both match and matchOne, advancing the regex engine one
    step closer to completion each time.
    // In general, this problem will lend itself exceptionally well to recursion.
    */
    it("should match an exact sequence of characters with wildcards", () => {
      expect(regex.match("a.c", "abc")).to.equal(true);
      expect(regex.match("b.c", "bac")).to.equal(true);
    });
  });
  describe("search", () => {
    /* You should not need to modify your match function to get this entire describe block to pass.
       Furthermore, you should invoke match from every code path of your search function
    */
    describe("patterns starting with '^'", () => {
      it("should match a longer sequence of characters", () => {
        expect(search("^please work", "please work")).to.equal(true);
        // expect(search("^good test", "good test")).to.equal(true);

        // expect(search("^bad", "test")).to.equal(false);
        // expect(search("^also bad test", "also bad tst")).to.equal(false);
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
      it("should match a sequence of characters starting at any position inside the text", () => {
        expect(search("match", "this is a match")).to.equal(true);
        expect(search("what", "this is what we are doing")).to.equal(true);
        expect(search("is what", "this is what we are doing")).to.equal(true);

        expect(search("blah", "this is what we are doing")).to.equal(false);
        expect(search("iswhat", "this is what we are doing")).to.equal(false);
      });
      it("returns the expected result if text is an empty string", () => {
        expect(search("pattern", "")).to.equal(false)
        expect(search("", "")).to.equal(true)
        expect(search("$", "")).to.equal(true)
      })
    });
  });
  describe("should match 0 or 1 of the following character a '?'", () => {
    /* You should not need to modify your search function from this point on.
    Everything should be contained to the match function and any helper functions
    you create */

    it("matches 0 characters if none are present", () => {
      expect(search("a?", "")).to.equal(true);
      expect(search("a?", "b")).to.equal(true);
    });
    it("matches 0 characters inside a larger string", () => {
      expect(search("thi?s", "ths")).to.equal(true);
      expect(search("this is?", "this i")).to.equal(true);

      expect(search("this is? it", "this i")).to.equal(false);
    });
    it("matches 1 character if it is present", () => {
      expect(search("a?", "a")).to.equal(true);
      expect(search("b?", "b")).to.equal(true);
    });
    it("matches 1 character inside a larger string", () => {
      expect(search("one?", "one")).to.equal(true);
      expect(search("one? of us", "one of us")).to.equal(true);

      expect(search("is it one? of us", "is it one")).to.equal(false);
    });
    it("works with multiple '?' characters", () => {
      expect(search("is? it? r?e?a?lly", "is it really")).to.equal(true);
      expect(search("is? it? r?e?a?lly", "i i lly")).to.equal(true);

      expect(search("is? it? r?e?a?lly", "i i ly")).to.equal(false);
    });
  });

  describe("should match 0 or more characters following an '*'", () => {
    it('matches 0 characters if none are present', () => {
      expect(search("a*", "")).to.equal(true);
      expect(search("a*", "b")).to.equal(true);
      expect(search("b*", "aaaaa")).to.equal(true);
    })
    it("one to many many characters", () => {
      expect(search("a*", "a")).to.equal(true);
      expect(search("a*", "aaaaa")).to.equal(true);
    })
    it("is not overly greedy", () => {
      // You could envision an implementation where the 'a*' portion consumes the entire
      // text, resulting in a failed match. In reality, this match should succeed.
      expect(search("a*a", "aaaaa")).to.equal(true);
    });
    it("works with multiple '*' characters", ()=> {
      expect(search("this* i*s the str*ing", "thissss s the strrring")).to.equal(true);
      expect(search("this* i*s the str*ing", "thissss i the strrrng")).to.equal(false);
      expect(search("this* i*s the str*ing", "thissss i the srrrng")).to.equal(false);
    })
  });

  describe('grouping', () => {
    it('matches all characters placed within grouping operators', () => {
      expect(search("(the)", "the")).to.equal(true);
      expect(search("i am (the) hulk", "i am the hulk")).to.equal(true);

      expect(search("(th.e)", "the")).to.equal(false);
    })
    it('allows the ? metacharacter to apply to groups', () => {
      expect(search("(the)?", "")).to.equal(true);
      expect(search("(the)?", "the")).to.equal(true);
      expect(search("i am (the)? hulk", "i am  hulk")).to.equal(true);
      expect(search("i am (the)? hulk", "i am the hulk")).to.equal(true);

      expect(search("i am (the)? hulk", "i am hulk")).to.equal(false);
    })
    it('allows the * metacharacter to apply to groups', () => {
      expect(search("(the)*", "")).to.equal(true);
      expect(search("(the)*", "")).to.equal(true);
      expect(search("(the)*", "the")).to.equal(true);
      expect(search("(the)*", "thethe")).to.equal(true);

      expect(search("i am (the)* hulk", "i am the hulk")).to.equal(true);

      expect(search("i am (the)*e hulk", "i am the hulk")).to.equal(false);
    })
    it('supports multiple groupings in a single pattern', () => {
      expect(search("i went (to)? (school)* last (sunday)*", "i went to school last sunday")).to.equal(true)
      expect(search("i went (to)? (school)* last (sunday)*", "i went  schoolschoolschool last ")).to.equal(true)
    })
  })
});
