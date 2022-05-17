export default ({ router, Vue, isServer }) => {
  Vue.mixin({
    mounted() {
      // 不加 setTimeout 会有报错，但不影响效果
      setTimeout(() => {
        try {
          docsearch({
            appId: "A9R9407GEB",
            apiKey: "a17e60b682b6ef00844bede53e3d9b90",
            indexName: "seamew",
            container: ".search-box",
            debug: false,
          });
        } catch (e) {
          console.log(e);
        }
      }, 100);
    },
  });
};
