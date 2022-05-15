const getMsg = require("./config/utils");
const nav = require("./config/nav");
module.exports = {
  title: "seamew的妙妙屋",
  description: "学习开发日常记录",
  head: [["link", { rel: "icon", href: "/assets/img/logo.jpg" }]],
  themeConfig: {
    search: true, //展示搜索
    algolia: {
      // appKey: "",
      // indexName: "",
      // searchParameters: {
      //   faeFilters: ["tags:guide,api"],
      // },
      apiKey: "a17e60b682b6ef00844bede53e3d9b90",
      indexName: "seamew",
      appId: "A9R9407GEB",
      debug: false
    },
    logo: "/assets/img/logo.jpg",
    nav,
    sidebar: {
      "/": getMsg(),
    },
    lastUpdated: "Last Updated",
  },
  markdown: {
    extendMarkdown: (md) => {
      md.use(require("markdown-it-disable-url-encode"));
    },
  },
  plugins: [
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp) => {
          return new Date(timestamp).toLocaleDateString();
        },
      },
    ],
    [
      "sitemap",
      {
        hostname: "https://www.seamew.top",
      },
    ],
    ["@vuepress/back-to-top"],
  ],
};
