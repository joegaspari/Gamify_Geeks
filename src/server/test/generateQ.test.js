import * as openAI from '../controller/generate.js';

const mockRes = {
  write: () => {}
}

describe('generate', () => {
    test('should return a string', async () => {
      const topic = 'test topic';
      const language = 'JavaScript';
      const difficulty = 'medium';
  
      const res = mockRes;
      const response = await openAI.generateQuestion(topic, language, difficulty, res);

      expect(typeof response).toBe('string');
    }, 70000);
  
    // test('should return a generated response with correct input', async () => {
    //   const topic = 'test topic';
    //   const language = 'JavaScript';
    //   const difficulty = 'medium';
  
    //   const res = mockRes;
    //   const response = await openAI.generateQuestion(topic, language, difficulty, res);

    //   expect(response.length).toBeGreaterThan(1);
    // }, 70000);
  
    test('should throw an error for missing topic', async () => {
      const language = 'JavaScript';
      const difficulty = 'medium';
  
      const res = mockRes;

      try {
        await openAI.generateQuestion(null, language, difficulty, res);
      } catch (error) {
        expect(error).toBe('Missing Fields {topic, language, difficulty} in open AI prompt');
      }
    }, 70000);
  
    test('should throw an error for missing language', async () => {
      const topic = 'test topic';
      const difficulty = 'medium';
  
      const res = mockRes;

      try {
        await openAI.generateQuestion(topic, null, difficulty, res);
      } catch (error) {
        expect(error).toBe('Missing Fields {topic, language, difficulty} in open AI prompt');
      }
    }, 70000);
  
    test('should throw an error for missing difficulty', async () => {
      const topic = 'test topic';
      const language = 'JavaScript';

      const res = mockRes;
  
      try {
        await openAI.generateQuestion(topic, language, null, res);
      } catch (error) {
        expect(error).toBe('Missing Fields {topic, language, difficulty} in open AI prompt');
      }
    }, 70000);
  });