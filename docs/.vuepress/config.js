const getMsg = require("./config/utils");
const nav = require("./config/nav");
module.exports = {
  title: "seamew的妙妙屋",
  description: "学习开发日常记录",
  head: [
    // ["link", { rel: "icon", href: "/assets/img/logo.jpg" }],
    [
      "link",
      {
        href: "https://cdn.jsdelivr.net/npm/@docsearch/css@3",
        rel: "stylesheet",
      },
      { href: "/assets/img/logo.jpg", rel: "icon" },
    ],
    ["script", { src: "https://cdn.jsdelivr.net/npm/@docsearch/js@3" }],
  ],
  themeConfig: {
    search: true, //展示搜索
    algolia: {
      apiKey: "3567df3de577c581e518b8d4d81bff98",
      indexName: "blog",
      appId: "46ERBY68LK",
      container: '.search-box',
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
