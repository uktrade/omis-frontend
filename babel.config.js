module.exports = {
  sourceType: 'unambiguous',
  plugins: ['@babel/plugin-transform-class-properties'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', 'ie >= 11'],
        },
      },
    ],
  ],
}
