import addRules from "../addRules";

export default async (data) => {
  const [response, error] = await addRules([data]);
  if (!response?.length) return [[], null];
  return [response[0], error];
};
