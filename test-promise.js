Promise.resolve().then(() => {
  throw new TypeError('wsModule.Server is not a constructor');
});