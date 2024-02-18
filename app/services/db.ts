import { Level } from "level";

const db = new Level("../db", { valueEncoding: "json" });
db.open();

export default db;
