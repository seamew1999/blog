export default ({ router, Vue, isServer }) => {
  Vue.mixin({
    mounted() {
      // 不加 setTimeout 会有报错，但不影响效果
      setTimeout(() => {
        try {
          docsearch({
            apiKey: "3567df3de577c581e518b8d4d81bff98",
            indexName: "blog",
            appId: "46ERBY68LK",
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
