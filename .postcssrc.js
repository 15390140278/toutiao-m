module.exports = {
  plugins: {
    //  vue-cli内部已经配置了该插件，不需要重复配置
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8'],
    // },
    'postcss-pxtorem': {
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],
      exclude: 'github-markdown'
    }
  }
}
