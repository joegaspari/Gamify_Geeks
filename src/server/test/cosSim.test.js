import * as cosSim from '../Utils/cosSim.js';

describe('calculateCosineSimilarity', () => {
    // Test case 1
    test('should return the correct cosine similarity for two sets of strings', () => {
      const setA = ['apple banana', 'orange apple'];
      const setB = ['apple', 'orange apple'];
      const expected = '0.91'; // expected cosine similarity with 2 decimal places
      const result = cosSim.calculateCosineSimilarity(setA, setB);
      expect(result).toBe(expected);
    });
  
    // Test case 3
    test('should throw error for empty setB', () => {
        const setA = ['apple banana'];
        const setB = [];
        const result = cosSim.calculateCosineSimilarity(setA, setB);
        expect(result.error).toBe("set B is empty");
        });

    // Test case 4
    test('should throw error for empty setA', () => {
    const setA = [];
    const setB = ['apple banana'];
    const result = cosSim.calculateCosineSimilarity(setA, setB);
    expect(result.error).toBe("set A is empty");
    });

    // Test case 5
    test('should return 0 for sets with no common terms', () => {
      const setA = ['apple', 'banana'];
      const setB = ['orange', 'grape'];
      const expected = '0.00'; // expected cosine similarity with 2 decimal places
      const result = cosSim.calculateCosineSimilarity(setA, setB);
      expect(result).toBe(expected);
    });
  
    // Test case 6
    test('should handle sets with repeated terms', () => {
      const setA = ['apple apple', 'banana'];
      const setB = ['apple', 'banana banana'];
      const expected = '0.80'; // expected cosine similarity with 2 decimal places
      const result = cosSim.calculateCosineSimilarity(setA, setB);
      expect(result).toBe(expected);
    });

    // Test case 7
    test('should throw null error when setA is null', () => {
        const setA = null;
        const setB = ['apple', 'banana'];
        const result = cosSim.calculateCosineSimilarity(setA, setB);
        expect(result.error).toBe("set A is null");
    });

    // Test case 8
    test('should throw null error when setB is null', () => {
        const setA = ['apple', 'banana'];
        const setB = null;
        const result = cosSim.calculateCosineSimilarity(setA, setB);
        expect(result.error).toBe("set B is null");
    });
});



describe('checkValues', () => {
    // Test case 1
    test('should return true if any value in the array is greater than the single value', () => {
      const array = [0.5, 0.8, 0.6, 0.3];
      const singleValue = 0.7;
      const result = cosSim.checkValues(array, singleValue);
      expect(result).toBe(true);
    });
  
    // Test case 2
    test('should return false if no value in the array is greater than the single value', () => {
      const array = [0.5, 0.3, 0.2, 0.1];
      const singleValue = 0.7;
      const result = cosSim.checkValues(array, singleValue);
      expect(result).toBe(false);
    });

    // Test case 3
    test('should throw an error if the array is null', () => {
      const array = null;
      const singleValue = 0.5;
      const result = cosSim.checkValues(array, singleValue);
      expect(result).toEqual({ error: 'array of cosSim is null' });
    });
  
    // Test case 4
    test('should throw an error if the array is empty', () => {
      const array = [];
      const singleValue = 0.5;
      const result = cosSim.checkValues(array, singleValue);
      expect(result).toEqual({ error: 'array of cosSim is empty' });
    });
});

  
describe('getCosSims', () => {
    // Test case 1
    test('should return true if any score in the score list is greater than the threshold', () => {
      const stringSet = ['apple', 'banana', 'orange'];
      const string = 'apple';
      const result = cosSim.getCosSims(stringSet, string);
      expect(result).toBe(true);
    });
  
    // Test case 2
    test('should return false if no score in the score list is greater than the threshold', () => {
      const stringSet = ['apple', 'banana', 'orange'];
      const string = 'kiwi';
      const result = cosSim.getCosSims(stringSet, string);
      expect(result).toBe(false);
    });
  
    // Test case 3
    test('should throw an error if the string set is null', () => {
      const stringSet = null;
      const string = 'apple';
      const result = cosSim.getCosSims(stringSet, string);
      expect(result).toEqual({ error: 'string set is null' });
    });
  
    // Test case 4
    test('should throw an error if the string is null', () => {
      const stringSet = ['apple', 'banana', 'orange'];
      const string = null;
      const result = cosSim.getCosSims(stringSet, string);
      expect(result).toEqual({ error: 'string is null' });
    });
  
    // Test case 5
    test('should throw an error if the string is empty', () => {
      const stringSet = ['apple', 'banana', 'orange'];
      const string = '';
      const result = cosSim.getCosSims(stringSet, string);
      expect(result).toEqual({ error: 'string is empty' });
    });
});