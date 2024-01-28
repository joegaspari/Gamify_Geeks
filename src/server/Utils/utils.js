
export function pairGrab(list){
    try{
        if(list == null ){
            throw "The list is null"
        }
        if(list.length == 0){
            throw "The list sent was empty";
        }
        var Obj = []
        for(let index = 0; index<list.length; index+=2){
            const ID = list[index+1];
            const NAME = list[index];
            Obj.push({
                id: ID,
                name: NAME,
            })
        }
        return Obj;
    }catch(err){
        console.log(err);
        return {error: err};
    }
};

export function filterByLanguageIds(obj, languageIds) {
    try{
        if (obj == null){
            throw "Data Object is null";
        }
        if (obj.length == 0){
            throw "Data Object is empty";
        }
        return obj.filter((item) => {
            const itemLanguageIds = item.languages.map((language) => language.id);
            return languageIds.every((id) => itemLanguageIds.includes(id));
          });
    }catch(err){
        console.log(err);
        return {error: err};
    }
 
};

export function checkStringMatches(array, singleString) {
    try{
        if(array == null){
            throw 'Array of topic titles is null'
        }
        if(array.length == 0){
            throw 'Array of topic titles is empty'
        }
        if(singleString == null){
            throw 'Single string is null'
        }
        if(singleString.length == 0){
            throw 'Single string is empty'
        }
        const LowerCaseArray = array.map((item)=>{
            return item.toLowerCase();
        })
        let bool = true;
        for (let i = 0; i < LowerCaseArray.length; i++) {
            let singleST = singleString.toLowerCase();
            if (!LowerCaseArray[i].includes(singleST)) {
                bool = false; // Match found, continue to next element
            }
        }
        return bool; // All elements have a match, return true

    }catch(err){
        console.log(err);
        return {error: err};
    }
};

export async function timeDifference(timestamp){
    try{
        if(timestamp == null){
            throw "timestamp is null";
        }
        const date = new Date(timestamp);
        const unixTimestamp = Math.round(date.getTime() / 1000);
        
        const currentTime = Math.round(Date.now() / 1000);
        // Difference will calculate the time difference in hours
        const difference = parseFloat((currentTime-unixTimestamp)/60/60);
        return difference;
    }catch(err){
        console.log(err);
        return {error: err};
    }
};

export function findNumber(str) {
    try{
        if(str == null){
            throw "string sent is null";
        }
        if(str.length == 0){
            throw "string sent is empty";
        }
        const regex =  /(?<!\S)[01](?!\S)/; // Regular expression to match '0' or '1'
        const match = str.match(regex); // Find the first occurrence of '0' or '1'
        
        if (match) {
        return Number(match[0]); // Convert the matched character to a number
        } else {
        return -1; // Return -1 if no match is found
        }
    }catch(err){
        console.log(err);
        return {error: err}
    }
};

export function getCurrentDate() {
    const date = new Date();
    
    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear());
    
    // Return the formatted date
    return `${month}/${day}/${year}`;
};

export function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
};

export function getDaysInMonth(year, monthName) {
    const months = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
  
    const monthIndex = months.findIndex(m => m === monthName.toLowerCase());
    if (monthIndex === -1) {
      throw new Error("Invalid month name");
    }
  
    const date = new Date(`${year}-${monthIndex + 1}-01`);
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
    const dayList = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      dayList.push(`${year}-${monthIndex + 1 < 10 ? "0" : ""}${monthIndex + 1}-${formattedDay}`);
    }
  
    return dayList;
};
  
export function previousDate(dateString) {
    const currentDate = new Date(dateString);
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
  
    const year = previousDay.getFullYear();
    const month = (previousDay.getMonth() + 1).toString().padStart(2, '0');
    const day = previousDay.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
};
  
export function evaluateObjects(objectsList) {
    let allCompleted = true;
    let anyPartialAnswerNotNull = false;
    let allPartialAnswersNull = true;
  
    for (const obj of objectsList) {
      if (obj.completed !== 1) {
        allCompleted = false;
      }
  
      if (obj.partialAnswer !== null) {
        anyPartialAnswerNotNull = true;
        allPartialAnswersNull = false;
      }
    }
    if(objectsList.length == 0){
        return 1;
    }
  
    if (allCompleted) {
      return 3;
    } else if (anyPartialAnswerNotNull) {
      return 2;
    } else if (allPartialAnswersNull) {
      return 1;
    }
  
    return 1;
  };