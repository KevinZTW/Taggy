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

let obj1 = [
  { id: "2rewfrwe", memberid: "werwe" },
  { id: "2r32", memberid: "werwe" },
];
let obj2 = [
  { id: "2r32", memberid: "werwe" },
  { id: "2r32", memberid: "werwe" },
];

obj1.forEach((item) => {
  for (let i in obj2) {
    if (obj2[i].id === item.id) {
      console.log("same");
    } else console.log("nono");
  }
});
