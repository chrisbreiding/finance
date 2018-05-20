require('zunder').setConfig({
  deployBranch: 'production',
  resolutions: ['react', 'react-dom', 'lodash'],
  staticGlobs: {
    'static/**': '',
    'node_modules/font-awesome/fonts/**': '/fonts',
  },
})
