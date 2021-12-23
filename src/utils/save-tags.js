const axios = require("axios");
const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "./data/");

function createDataFolder() {
  if (fs.existsSync(folderPath))
    throw new Error("Folder already exists, please delete it first");

  fs.mkdirSync(folderPath);
}

(async function () {
  try {
    createDataFolder();

    let tags = [];
    let response = null;
    let page = 1;

    do {
      response = await axios.get(
        `https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow&pagesize=100&page=${page}`,
        {
          Headers: {
            Accept: "application/json",
          },
        }
      );
      response = response.data;

      tags.push(...response.items);

      fs.writeFileSync(
        path.join(__dirname, "./data/data.json"),
        JSON.stringify(tags)
      );

      console.log(`${page} pages done`);

      page++;
    } while (response.has_more);

    return tags;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
