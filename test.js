function test(one, two) {
  return "Bento says: " + ((typeof one === "string" && typeof two === "string") ? (one + two) : 'not a string!');
}

console.log(test("one", "two"));

function addPre(pre) {
  return function(one, two) {
    return (pre + one + two);
  }
}

console.log(addPre("Two ")("3 ", "4"));
