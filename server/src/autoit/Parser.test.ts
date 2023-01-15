import Parser from "./Parser";

describe("Parser", function () {
    test("isPositionWithinLocation out of scope before", function () {
        expect(
            Parser.isPositionWithinLocation(
                1,
                1,
                {
                    "source": undefined,
                    "start": { "offset": 15, "line": 2, "column": 5 },
                    "end": { "offset": 23, "line": 3, "column": 1 }
                }
            )
        ).toEqual(false);
        
        expect(
            Parser.isPositionWithinLocation(
                2,
                4,
                {
                    "source": undefined,
                    "start": { "offset": 15, "line": 2, "column": 5 },
                    "end": { "offset": 23, "line": 3, "column": 1 }
                }
            )
        ).toEqual(false);
    });

    test("isPositionWithinLocation in scope within", function () {
        expect(
            Parser.isPositionWithinLocation(
                2,
                17,
                {
                    "source": undefined,
                    "start": { "offset": 15, "line": 2, "column": 5 },
                    "end": { "offset": 23, "line": 3, "column": 1 }
                }
            )
        ).toEqual(true);
    });
    
    test("isPositionWithinLocation out of scope after", function () {
        expect(
            Parser.isPositionWithinLocation(
                3,
                2,
                {
                    "source": undefined,
                    "start": { "offset": 15, "line": 2, "column": 5 },
                    "end": { "offset": 23, "line": 3, "column": 1 }
                }
            )
        ).toEqual(false);

        expect(
            Parser.isPositionWithinLocation(
                4,
                1,
                {
                    "source": undefined,
                    "start": { "offset": 15, "line": 2, "column": 5 },
                    "end": { "offset": 23, "line": 3, "column": 1 }
                }
            )
        ).toEqual(false);
    });
});
