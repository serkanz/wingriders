const fs = require("fs");

const inputFile = "test";
const result = [];

fs.readFile("in/" + inputFile + ".in.json", "utf8", (err, data) => {
  const obj = JSON.parse(data);

  const testCaseNumber = obj.T;
  let counter = 0;
  for (let i = 0; i < testCaseNumber; i++) {
    const { N, Q, dictionary, queries } = obj.testCases[i];

    const finalDictionary = dictionary.map((d) => [d[0].toLowerCase(), d[1].toLowerCase()]).concat(dictionary.map((d) => [d[1].toLowerCase(), d[0].toLowerCase()]));

    for (let index = 0; index < Q; index++) {
      const [first, second] = queries[index];
      result.push(checkIfSynonym(first.toLowerCase(), second.toLowerCase(), finalDictionary));
      counter++;
    }
  }
  console.log(counter);

  let strResult = "";
  result.forEach((r) => (strResult += r === true ? "synonyms\n" : "different\n"));
  fs.writeFile("out/" + inputFile + "_.out", strResult, (err) => {
    console.log("File successfully written!");
  });
});

function checkIfSynonym(first, second, dictionary) {
  if (first === second) return true;
  if (dictionary.some((d) => d[0] === first && d[1] === second)) return true;
  if (checkIfDerivedSynonym(first, second, dictionary, [])) return true;
  else return false;
}

function checkIfDerivedSynonym(first, second, dictionary, processed) {
  if (dictionary.some((d) => d[0] === first && d[1] === second)) return true;
  else {
    const arr = dictionary.filter((d) => d[0] === first && !processed.includes(d));

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (dictionary.some((d) => d[0] === first && d[1] === second)) return true;
      else {
        processed.push(element);
        if (checkIfDerivedSynonym(element[1], second, dictionary, processed)) return true;
      }
    }

    return false;
  }
}
