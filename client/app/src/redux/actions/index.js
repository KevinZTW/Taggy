const SWITCHCARDINLIST = (listId, destination, source) => {
  console.log(listId);
  return {
    type: "SWITCHCARDINLIST",
    listId: listId,
    destination: destination,
    source: source,
  };
};

export { SWITCHCARDINLIST };
