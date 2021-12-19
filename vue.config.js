module.exports = {
  devServer: {
    proxy: {
      "^/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/auth": "/auth" },
        logLevel: "debug",
      },
    },
  },
};
