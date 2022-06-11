const fs = require("fs");
const readline = require("readline");

let result = [];

fs.readFile("in/example.in.json", "utf8", (err, data) => {
  const obj = JSON.parse(data);

  const testCaseNumber = obj.T;
  let counter = 0;
  for (let i = 0; i < testCaseNumber; i++) {
    const { N, Q, dictionary, queries } = obj.testCases[i];

    for (let index = 0; index < Q; index++) {
      const [first, second] = queries[index];
      result.push(
        checkIfSynonym(
          first.toLowerCase(),
          second.toLowerCase(),
          dictionary.map((d) => [d[0].toLowerCase(), d[1].toLowerCase()])
        )
      );
      counter++;
    }
  }
  console.log(counter);

  let strResult = "";
  result.forEach((r) => (strResult += r === true ? "synonyms\n" : "different\n"));
  fs.writeFile("out/test.out", strResult, (err) => {
    console.log("File successfully written!");
  });
});

function checkIfSynonym(first, second, dictionary) {
  let res = false;

  if (first === second) {
    res = true;
  } else {
    for (let i = 0; i < dictionary.length; i++) {
      const lower = dictionary[i].map((word) => word.toLowerCase());

      if (lower.includes(first) && lower.includes(second)) {
        res = true;
        break;
      } else if (lower.includes(second) && lower.includes(first)) {
        res = true;
        break;
      }
    }

    if (res === false) res = findDerivedSynonymsOfWords(first, second, dictionary, []);
    if (res === false) res = findDerivedSynonymsOfWords(second, first, dictionary, []);
  }

  return res;
}
function findDerivedSynonymsOfWords(first, second, dictionary, processed) {
    
  if (dictionary.some((d) => (d[0] === first && d[1] === second)||(d[0] === second && d[1] === first))) return true;
  else {
    if (dictionary.filter((d) => d[0] == first && !processed.includes(d)).length > 0)
      dictionary
        .filter((d) => d[0] == first && !processed.includes(d))
        .forEach((d) => {
          processed.push(d);
          return findDerivedSynonymsOfWords(d[1], second, dictionary, processed);
        });
    else return false;
  }
}
