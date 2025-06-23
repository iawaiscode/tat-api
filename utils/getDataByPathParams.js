export const getDataByPathParams = (destinations, keyName, keyValue) =>
  destinations.filter(
    (item) => item[keyName].toLowerCase() === keyValue.toLowerCase(),
  );
