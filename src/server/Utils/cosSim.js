export function calculateCosineSimilarity(setA, setB) {
  try{
      if (setA == null){
        throw "set A is null";
      }else if(setB == null){
        throw "set B is null";
      }
      if(setB.length == 0){
        throw "set B is empty";
      }else if (setA.length == 0){
        throw "set A is empty";
      }
      function termFreqMap(set) {
        var termFreq = {};
        set.forEach(function(str) {
          var words = str.split(' ');
          words.forEach(function(word) {
            termFreq[word] = (termFreq[word] || 0) + 1;
          });
        });
        return termFreq;
      }
    
      function addKeysToDict(map, dict) {
        for (var key in map) {
          dict[key] = true;
        }
      }
    
      function termFreqMapToVector(map, dict) {
        var termFreqVector = [];
        for (var term in dict) {
          termFreqVector.push(map[term] || 0);
        }
        return termFreqVector;
      }
    
      function vecDotProduct(vecA, vecB) {
        var product = 0;
        for (var i = 0; i < vecA.length; i++) {
          product += vecA[i] * vecB[i];
        }
        return product;
      }
    
      function vecMagnitude(vec) {
        var sum = 0;
        for (var i = 0; i < vec.length; i++) {
          sum += vec[i] * vec[i];
        }
        return Math.sqrt(sum);
      }
    
      function cosineSimilarity(vecA, vecB) {
        return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
      }
    
      var termFreqA = termFreqMap(setA);
      var termFreqB = termFreqMap(setB);
    
      var dict = {};
      addKeysToDict(termFreqA, dict);
      addKeysToDict(termFreqB, dict);
    
      var termFreqVecA = termFreqMapToVector(termFreqA, dict);
      var termFreqVecB = termFreqMapToVector(termFreqB, dict);
    
      var cos = cosineSimilarity(termFreqVecA, termFreqVecB);
      return cos.toFixed(2);
  }catch(err){
      console.log(err);
      return {error: err};
  }
};

// The above function will generate a simple check on the content of two questions to determine how similar they are based on words used

export function checkValues(array, singleValue) {
  try{
    if (array == null){
      throw "array of cosSim is null";
    }
    if (array.length == 0){
      throw "array of cosSim is empty";
    }
    for (let i = 0; i < array.length; i++) {
      if (array[i] > singleValue) {
        return true; // If any value is greater, return true
      }
    }
    return false; // If no value is greater, return false
  }catch(err){
    console.log(err);
    return {error: err};
  }
};

export function getCosSims(stringSet, string){
    try{
      if(stringSet == null){
        throw "string set is null";
      }
      if(string == null){
        throw "string is null";
      }
      if(string.length == 0){
        throw "string is empty"
      }
      let scoreList = stringSet.map((item) => {
          const score = calculateCosineSimilarity([item], [string]);
          return score;
      });
      let final = scoreList.length == 0 ? false : checkValues(scoreList, 0.85)
      return final
    }catch(err){
      console.log(err);
      return {error: err}
    }
};
