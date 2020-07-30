const pgp = require("pg-promise")();
const secrets = require("./secrets.js");

const cn = {
  database: "bibleheadapi",
  user: "bibleheadapi",
  password: secrets.dbPassword
};
const db = pgp(cn);

async function getVerses(code) {
  const row = await db.oneOrNone(
    "SELECT verses, format_version FROM verselibs WHERE code=$1;",
    code
  );
  if (!row) return null;
  return { verses: JSON.parse(row.verses), formatVersion: row.format_version };
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
  const max = "Y";
  const min = "B";

  if (code.length == 0) return min;

  const char = code[0];
  if (char == max) return min + incrementCode(code.slice(1));

  return String.fromCharCode(char.charCodeAt(0) + 1) + code.slice(1);
}

function firstCode() {
  return "ABHA";
}

module.exports = { saveVerses, getVerses, incrementCode };

// db.one("SELECT $1 AS value", 123)
//   .then(function(data) {
//     console.log("DATA:", data.value);
//   })
//   .catch(function(error) {
//     console.log("ERROR:", error);
//   });
