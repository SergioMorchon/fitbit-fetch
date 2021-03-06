import { outbox, inbox } from "file-transfer";
import { encode, decode } from "cbor";
import { readFileSync } from "fs";

const nextName = (() => {
  let i = 0;
  return () => `${Date.now()}${i++}`;
})();

type AsyncTask = {
  promise: Promise<any>;
  resolve: (data: any) => void;
  reject: (data: any) => void;
};

const tasks: { [name: string]: AsyncTask } = {};

const processInputs = () => {
  let name: string;
  while ((name = inbox.nextFile())) {
    const [ok, data] = decode(readFileSync(`/private/data/${name}`));
    const { [name]: task } = tasks;
    if (task) {
      if (ok) {
        task.resolve(data);
      } else {
        task.reject(data);
      }
      delete tasks[name];
    }
  }
};

inbox.addEventListener("newfile", processInputs);
processInputs();

export default (data: any) => {
  const name = nextName();
  let resolve: (value?: any) => void, reject: (reason?: any) => void;
  const promise = new Promise<any>((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });
  const task = {
    promise,
    resolve,
    reject
  };
  tasks[name] = task;
  outbox.enqueue(name, encode(data));
  return promise;
};
