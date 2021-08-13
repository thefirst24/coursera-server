const Papa = require("papaparse")
const fs = require("fs/promises")

const fetchAndParseCsv = async (fileName) => {
    return await fs.readFile(`${__dirname}/../files/${fileName}`)
    .then(buffer => buffer.toString("utf-8"))
    .then(text => {
      let result = Papa.parse(text).data
      return result;
    })
}

module.exports =  fetchAndParseCsv;