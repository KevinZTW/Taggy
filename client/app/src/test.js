const pets = ["cat", "dog", "bat", "mouse"];
let list = [["cat", "dog"], ["cat", "dog"], ["dog"], ["cat", "bat"]];
let bundle = [];

for (let i in pets) {
  console.log(i);
  console.log(typeof i);
  for (let j = i + 1; j < pets.length; j++) {
    console.log(i, j);
  }
  i++;
}

// Since you only want pairs, there's no reason
// to iterate over the last element directly
for (let i = 0; i < pets.length - 1; i++) {
  console.log(i);
  console.log(typeof i);
  // This is where you'll capture that last value
  for (let j = i + 1; j < pets.length; j++) {
    console.log(i, j);
  }
}
console.log(bundle);
