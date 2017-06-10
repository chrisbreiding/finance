require('zunder').setConfig({
  cacheBust: false,
  devDir: 'app-dist',
  prodDir: 'app-dist-prod',
  resolutions: ['react', 'react-dom', 'lodash'],
  staticGlobs: {
    'node_modules/font-awesome/fonts/**': '/fonts',
  },
})
