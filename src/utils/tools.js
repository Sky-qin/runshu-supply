const transferTree = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }
  for (let i = 0; i < data.length; i++) {
    data[i].title = data[i].label;
    data[i].key = data[i].value;
    if (data[i].children) {
      transferTree(data[i].children);
    }
  }
  return data;
};

export { transferTree };
