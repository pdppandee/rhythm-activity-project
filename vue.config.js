module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    // GraphQL Loader
    config.module
      .rule("file")
      .test(/\.(midi|pem|key|crt)$/)
      .use("file-loader")
      .loader("file-loader")
      .end();
  },
};
