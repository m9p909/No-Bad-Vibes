import { isObject } from "../../utils";

export default (els) =>
  (...args) => {
    let props = { type: "text" };
    if (args.length) {
      if (isObject(args[0])) {
        props = { ...args.shift(), ...props };
      } else {
        props = { value: args.shift(), ...props };
      }
    }
    return els.input({ type: "text", ...props }, ...args);
  };
