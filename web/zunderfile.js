require('zunder').setConfig({
  resolutions: ['react', 'react-dom', 'lodash'],
  staticGlobs: {
    'static/**': '',
    'node_modules/font-awesome/fonts/**': '/fonts',
  },
})
