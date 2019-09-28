import fetch from "./fetch";

const req = {
  url: "https://uinames.com/api"
};

const logName = ({ name }) => console.log(name);
fetch(req).then(logName);
fetch(req).then(logName);
fetch(req).then(logName);
