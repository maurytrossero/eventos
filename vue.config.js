const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  configureWebpack: {
    optimization: {
      splitChunks: false // 🔥 Esto empaqueta todo en un solo archivo
    }
  }
})
