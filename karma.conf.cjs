// Configuración de Karma (CommonJS)
module.exports = function(config) {
  config.set({
    // Base path para resolver archivos
    basePath: '',

    // Frameworks a usar
    frameworks: ['jasmine'],

    // Lista de archivos/patrones a cargar en el navegador
    files: [
      'spec/karma-simple.spec.js'
    ],

    // Lista de archivos a excluir
    exclude: [
      'node_modules/**/*'
    ],

    // Preprocesadores
    preprocessors: {},

    // Reportes de test
    reporters: ['progress'],

    // Puerto del servidor web
    port: 9876,

    // Habilitar/deshabilitar colores en la salida
    colors: true,

    // Nivel de logging
    logLevel: config.LOG_INFO,

    // Habilitar/deshabilitar watching de archivos
    autoWatch: false,

    // Navegadores a ejecutar (vacío para evitar Chrome)
    browsers: [],

    // Configuración para CI
    singleRun: true,

    // Timeout para capture
    captureTimeout: 60000,

    // Configuración específica para ChromeHeadless
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-web-security', '--headless', '--disable-gpu']
      }
    }
  });
};