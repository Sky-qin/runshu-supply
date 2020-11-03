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

const transferTreeList = (data, parentValue) => {
  if (!Array.isArray(data)) {
    return [];
  }
  for (let i = 0; i < data.length; i++) {
    data[i].title = data[i].categoryName;
    data[i].key = parentValue
      ? `${parentValue}-${data[i].categoryCode}-${data[i].categoryName}`
      : data[i].categoryCode;
    if (data[i].children) {
      transferTreeList(data[i].children, data[i].categoryCode);
    }
  }
  return data;
};

const transferList = (data, value, label) => {
  let list = [];
  if (!Array.isArray(data)) {
    return list;
  }
  list = data.map((item) => {
    return { ...item, value: item[value], label: item[label] };
  });

  return list;
};

const transferSimpleList = (data, value, label) => {
  let list = [];
  if (!Array.isArray(data)) {
    return list;
  }
  list = data.map((item) => {
    return { value: item[value], label: item[label] };
  });

  return list;
};

export { transferTree, transferTreeList, transferList, transferSimpleList };
