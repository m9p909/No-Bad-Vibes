export const convertToArray = (...args) => {
  if (args.length != 1) {
    return args;
  }

  if (Array.isArray(args[0])) {
    return args[0];
  }

  return [args[0]];
};

export const isObject = (value) =>
  !!value && Object.getPrototypeOf(value) === Object.prototype;

export const convertToObjects = (templateKeys, convertToTemplate, ...args) => {
  const entries = convertToArray(...args);
  const matchesTemplate = (entry) =>
    isObject(entry) && templateKeys.every(Object.hasOwnProperty.bind(entry));
  return entries.map((entry) =>
    matchesTemplate(entry) ? entry : convertToTemplate(convertToArray(entry))
  );
};

export const wrapWithObject = (key, mapper) => (value) => ({
  [key]: mapper(value),
});

export const id =
  (fn, n = 1) =>
  (...args) =>
    fn(...args.slice(0, n));
