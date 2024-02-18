import { Level } from "level";
const path = window.require("path");
const folder = window.require("electron").remote.app.getPath("userData");

const db = new Level(path.join(folder, "db"), { valueEncoding: "json" });

export default db;
