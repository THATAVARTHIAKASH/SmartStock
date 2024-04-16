function generateRandomData() {
  key = "7X3QZLFCRL7JE9UT";

  var field1 = Math.floor(Math.random() * 400);
  var field2 = Math.floor(Math.random() * 2500) + 10;
  var field3 = Math.floor(Math.random() * 80) - 10;
  var field4 = Math.floor(Math.random() * 2400) + 300;
  var field5 = Math.floor(Math.random() * 100);
  var field6 = Math.floor(Math.random() * 100);
  var field7 = Math.floor(Math.random() * 3000) + 100;
  var field8 = Math.floor(Math.random() * 40) + 30;

  return `https://api.thingspeak.com/update?api_key=${key}&field1=${field1}&field2=${field2}&field3=${field3}&field4=${field4}&field5=${field5}&field6=${field6}&field7=${field7}&field8=${field8}`;
}

let interval = setInterval(() => {
  let url = generateRandomData();
  console.log(url);
  fetch(url);
}, 30000);
clearInterval(interval);
