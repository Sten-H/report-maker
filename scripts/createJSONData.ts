const fs = require("fs");

try {
  const data = fs.readFileSync("./data/test-data.txt", "UTF-8");
  let lines = data.split(/\n/);
  lines = lines.splice(0, lines.length - 2);

  const contractEvents = lines.map(JSON.parse);
  fs.writeFile(
    "./src/generated/contract-data.json",
    JSON.stringify(contractEvents, null, 4),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
  console.log("JSON data generated");
} catch (err) {
  console.error(err);
}
