// Configuración simplificada de Karma sin navegador
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'spec/**/*.spec.js'
    ],
    exclude: [
      'node_modules/**/*'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    // Usar PhantomJS o configuración headless
    browsers: [],
    // Solo ejecutar si hay navegadores disponibles
    processKillTimeout: 2000
  });
};