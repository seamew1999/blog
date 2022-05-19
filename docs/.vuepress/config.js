const getMsg = require("./config/utils");
const nav = require("./config/nav");
module.exports = {
  title: "seamew的妙妙屋",
  description: "学习开发日常记录",
  head: [
    ["link", { rel: "icon", href: "/assets/img/logo.jpg" }],
    [
      "link",
      {
        href: "/assets/css/css@3.css",
        rel: "stylesheet",
      },
    ],
    ["script", { src: "/assets/js/js@3.js" }],
  ],
  themeConfig: {
    search: true, //展示搜索
    algolia: {
      appId: "A9R9407GEB",
      apiKey: "a17e60b682b6ef00844bede53e3d9b90",
      indexName: "seamew",
      container: "#search-form",
      debug: false,
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
