import * as utils from "../Utils/utils.js";

describe("Pair Grab Test Suit:", () => {
    test("Normal Input", () => {
        const tlist = ["Javascript", "1", "Python", "2"];
        const res = utils.pairGrab(tlist);
        expect(res).toEqual([
            { id: "1", name: "Javascript" },
            { id: "2", name: "Python" },
        ]);
    });

    test("Empty List Argument", () => {
        const tlist = [];
        const res = utils.pairGrab(tlist);
        expect(res.error).toBe("The list sent was empty");
    });

    test("List sent is null", () => {
        const tlist = null;
        const res = utils.pairGrab(tlist);
        expect(res.error).toBe("The list is null");
    });
});

describe("Filter By Language Id", () => {
    test("Normal Input", () => {
        const data = [
            {
                id: 1,
                title: "Arrays",
                level: 0,
                numBug: 5,
                languages: [
                    {
                        id: "1",
                        name: "Java",
                    },
                    {
                        id: "2",
                        name: "JavaScript",
                    },
                    {
                        id: "3",
                        name: "Python",
                    },
                    {
                        id: "4",
                        name: "C#",
                    },
                    {
                        id: "5",
                        name: "C++",
                    },
                    {
                        id: "6",
                        name: "PHP",
                    },
                    {
                        id: "8",
                        name: "Ruby",
                    },
                    {
                        id: "9",
                        name: "Swift",
                    },
                    {
                        id: "10",
                        name: "Go",
                    },
                    {
                        id: "11",
                        name: "R",
                    },
                ],
            },
        ];
        const langId = ["2"];
        const res = utils.filterByLanguageIds(data, langId);
        expect(res.length).toBe(1);
    });

    test("Empty Data Object", () => {
        const data = [];
        const langId = ["2"];
        const res = utils.filterByLanguageIds(data, langId);
        expect(res.error).toBe("Data Object is empty");
    });

    test("Null Data Object", () => {
        const data = null;
        const langId = [];
        const res = utils.filterByLanguageIds(data, langId);
        expect(res.error).toBe("Data Object is null");
    });
});

// Test Suite
describe("checkStringMatches", () => {
    // Test Case 1
    test("should return true when all elements have a partial or full string match", () => {
        const strings = ["apple pie", "banana", "orange"];
        const singleString = "A";

        const result = utils.checkStringMatches(strings, singleString);

        expect(result).toBe(true);
    });

    // Test Case 2
    test("should return false when at least one element has no partial or full string match", () => {
        const strings = ["apple", "banana", "orange"];
        const singleString = "grapefruit";

        const result = utils.checkStringMatches(strings, singleString);

        expect(result).toBe(false);
    });

    // Test Case 3
    test("should throw an error and return an error object when the array is null", () => {
        const strings = null;
        const singleString = "apple";

        const result = utils.checkStringMatches(strings, singleString);

        expect(result).toEqual({ error: "Array of topic titles is null" });
    });

    // Test Case 4
    test("should throw an error and return an error object when the array is empty", () => {
        const strings = [];
        const singleString = "apple";

        const result = utils.checkStringMatches(strings, singleString);

        expect(result).toEqual({ error: "Array of topic titles is empty" });
    });

    // Test Case 5
    test("should throw an error and return an error object when the single string is null", () => {
        const strings = ["apple", "banana", "orange"];
        const singleString = null;

        const result = utils.checkStringMatches(strings, singleString);

        expect(result).toEqual({ error: "Single string is null" });
    });

    // Test Case 6
    test("should throw an error and return an error object when the single string is empty", () => {
        const strings = ["apple", "banana", "orange"];
        const singleString = "";

        const result = utils.checkStringMatches(strings, singleString);

        expect(result).toEqual({ error: "Single string is empty" });
    });
});

describe("timeDifference", () => {
    // Test Case 1
    test("should calculate the correct time difference in hours", async () => {
        const timestamp = "2023-07-09 21:34:39";

        const result = await utils.timeDifference(timestamp);

        // Assuming the current time is 2023-07-11 12:00:00,
        // the difference should be approximately 38.42 hours
        expect(result).toBeGreaterThanOrEqual(38.42);
    });

    // Test Case 2
    test("should throw an error and return an error object when the timestamp is null", async () => {
        const timestamp = null;

        const result = await utils.timeDifference(timestamp);

        expect(result).toEqual({ error: "timestamp is null" });
    });

    // Edge Case 1
    test("should calculate the time difference as 0 when the timestamp is the current time", async () => {
        const currentTimestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        const result = await utils.timeDifference(currentTimestamp);

        expect(Math.floor(result)).toBe(0);
    });

    // Edge Case 2
    test("should calculate the time difference as a negative value when the timestamp is in the future", async () => {
        const futureTimestamp = "2024-07-11 12:00:00";

        const result = await utils.timeDifference(futureTimestamp);

        expect(result).toBeLessThan(0);
    });
});

describe("findNumber", () => {
    // Test Case 1
    test("should return the correct number when a 0 is found in the string", () => {
        const str = "This is a test string containing a 0";

        const result = utils.findNumber(str);

        expect(result).toBe(0);
    });

    // Test Case 2
    test("should return the correct number when a 1 is found in the string", () => {
        const str = "This is a test string containing a 1";

        const result = utils.findNumber(str);

        expect(result).toBe(1);
    });

    // Test Case 3
    test("should return -1 when no match is found in the string", () => {
        const str = "This is a test string";

        const result = utils.findNumber(str);

        expect(result).toBe(-1);
    });

    // Edge Case 1
    test("should return the correct number when the string starts with a number", () => {
        const str = "0 is the first character in this string";

        const result = utils.findNumber(str);

        expect(result).toBe(0);
    });

    // Edge Case 2
    test("should return the correct number when the string ends with a number", () => {
        const str = "This string ends with a 1";

        const result = utils.findNumber(str);

        expect(result).toBe(1);
    });

    // Edge Case 3
    test("should return the correct number when the string contains multiple numbers", () => {
        const str = "This string contains both 0 and 1";

        const result = utils.findNumber(str);

        expect(result).toBe(0);
    });

    test("should throw an error when string is null", () => {
        const str = null;
        const result = utils.findNumber(str);
        expect(result).toEqual({ error: "string sent is null" });
    });

    test("should throw an error when string is empty", () => {
        const str = "";
        const result = utils.findNumber(str);
        expect(result).toEqual({ error: "string sent is empty" });
    });
});

describe("getCurrentDate", () => {
    // Test Case 1
    test("should return the current date in the correct format", () => {
        // Get the current date using JavaScript's Date object
        const currentDate = new Date();

        // Get the month, day, and year from the current date
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const year = String(currentDate.getFullYear());

        // Format the expected date
        const expectedDate = `${month}/${day}/${year}`;

        // Call the function to get the current date
        const result = utils.getCurrentDate();

        // Check if the result matches the expected date
        expect(result).toBe(expectedDate);
    });
});
