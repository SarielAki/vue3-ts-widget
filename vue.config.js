const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: config => {
        config.optimization.delete('splitChunks')
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.customElement = true
                return options
            })
        config.output
            .filename('weather-widget.js')
            .chunkFilename('weather-widget.js')

    }
})

