import { inbox, outbox } from "file-transfer";
import { encode } from "cbor";

const getInputs = async function*() {
  while (true) {
    const input = await inbox.pop();
    if (!input) {
      return;
    }
    yield input;
  }
};

const processInbox = async () => {
  for await (const input of getInputs()) {
    const { name } = input;
    const { url, ...rawRequest } = await input.cbor();
    const request = new Request(
      // @ts-ignore
      url
    );
    Object.assign(request, rawRequest);
    let ok = true;
    let data: any;
    try {
      const response = await fetch(request);
      if (!response.ok) {
        throw new Error(await response.text());
      }

      data = await response.json();
    } catch (e) {
      ok = false;
      data = {
        name: e.name,
        message: e.message
      };
    }
    outbox.enqueue(name, encode([ok, data]));
  }
};

inbox.addEventListener("newfile", processInbox);
processInbox();
