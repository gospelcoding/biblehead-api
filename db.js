const pgp = require("pg-promise")();

const password = "biblehead";
const cn = {
  host: "localhost",
  port: 5432,
  database: "bibleheadapi",
  user: "bibleheadapi",
  password: password
};
const db = pgp(cn);

async function getVerses(code) {
  const row = await db.oneOrNone(
    "SELECT verses, format_version FROM verselibs WHERE code=$1;",
    code
  );
  if (!row) return null;
  return { verses: row.verses, formatVersion: row.format_version };
}

async function saveVerses(code, verses, format_version) {
  const timestamp = new Date().toISOString();
  if (!code) {
    code = await nextCode();
    await db.any(
      "INSERT INTO verselibs (code, verses, format_version, created, updated) VALUES($1, $2, $3, $4, $4);",
      [code, verses, format_version, timestamp]
    );
    return code;
  } else {
    await db.any(
      "UPDATE verselibs SET verses=$1, format_version=$2, updated=$3 WHERE code=$4;",
      [verses, format_version, timestamp, code]
    );
    return code;
  }
}

async function nextCode() {
  const row = await db.oneOrNone(
    "SELECT code FROM verselibs ORDER BY created DESC LIMIT 1;"
  );
  if (!row) return firstCode();
  return incrementCode(row.code);
}

function incrementCode(code) {
  const index = code.split("").findIndex(c => c != "Z");
  if (index == -1) return new Array(code.length + 1).fill("A").join("");
  const newChar = String.fromCharCode(code.charCodeAt(index) + 1);
  return code.slice(0, index) + newChar + code.slice(index + 1);
}

function firstCode() {
  return "ABHA";
}

module.exports = { saveVerses: saveVerses, getVerses: getVerses };

// db.one("SELECT $1 AS value", 123)
//   .then(function(data) {
//     console.log("DATA:", data.value);
//   })
//   .catch(function(error) {
//     console.log("ERROR:", error);
//   });
