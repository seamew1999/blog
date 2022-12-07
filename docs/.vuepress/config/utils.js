const fs = require("fs");
const path = require("path");
const { resolve } = path;

const getMsg = (relativePath) => {
  let path = resolve(__dirname, relativePath);
  let res = fs.readdirSync(path).filter((item) => !item.includes("assets"));
  if (res.length) {
    let arr = res.map((item) => {
      if (String(item).endsWith(".md")) {
        return { title: item.split(".")[0], path: resolve(path, item) };
      } else {
        return {
          title: item.split(".")[0],
          collapsable: false,
          children: getMsg(resolve(path, item)),
        };
      }
    });
    arr = arr.map((item) => {
      item.path && (item.path = encodeURI(translateDir(item.path)));
      return item;
    });
    return arr;
  }
};

/**
 * 格式化字符串
 * @param {string} path
 * @returns 符合侧边栏的格式
 */
function translateDir(path) {
  return path.replace(/\\/g, "/").split("docs")[1].split(".")[0];
}
module.exports = getMsg;
