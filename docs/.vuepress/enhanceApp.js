export default ({ router, Vue, isServer }) => {
  Vue.mixin({
    mounted() {
      // 不加 setTimeout 会有报错，但不影响效果
      setTimeout(() => {
        try {
          docsearch({
            appId: "A9R9407GEB",
            apiKey: "ec25f908cb82f5a9a57f4f09b58d0ea4",
            indexName: "seamew",
            container: "#search-form",
            debug: false,
          });
        } catch (e) {
          console.log(e);
        }
      }, 100);
    },
  });
};
