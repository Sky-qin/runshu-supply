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

const getUrlParam = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = decodeURIComponent(window.location.search.substr(1)).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

export { transferTree, transferList, getUrlParam };
