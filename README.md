# Fitbit fetch

This is a WIP project that aims to have a nice way to just `fetch` from the device.
Something like:
```typescript
const req = {
  url: "https://uinames.com/api"
};

fetch(req).then(({ name }) => {
  console.log(name);
});
```
