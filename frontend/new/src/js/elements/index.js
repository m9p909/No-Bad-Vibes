import {
  isObject,
  convertToObjects,
  wrapWithObject,
  convertToArray,
} from "../utils";
import compositeElementFactories from "./composite";

const makeEl = (type, settings = {}) => {
  const { hasChildren = true } = settings;
  return (...args) => {
    const children = [];
    while (args.length) {
      if (isObject(args[0])) {
        break;
      }
      children.push(...convertToArray(args.shift()));
    }
    const [props = {}, attrs = {}, ...rest] = args;
    children.push(...rest.flatMap(convertToArray));

    const element = document.createElement(type);

    // Add all properties.
    Object.entries(props).forEach(([key, value]) => {
      element[key] = value;
    });

    // Add all attributes.
    Object.entries(attrs).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );

    // Add all children.
    if (hasChildren) {
      element.append(...children);
    }

    return element;
  };
};

const elementsToCreate = [
  "button",
  "span",
  "label",
  "div",
  "tr",
  "th",
  "td",
  {
    elements: ["input"],
    settings: { hasChildren: false },
  },
];

const els = Object.fromEntries(
  convertToObjects(
    ["elements", "settings"],
    wrapWithObject("elements", convertToArray),
    elementsToCreate
  ).flatMap(({ elements, settings }) =>
    elements.map((el) => [el, makeEl(el, settings)])
  )
);

export default Object.freeze({
  ...els,
  c: compositeElementFactories(els),
});
