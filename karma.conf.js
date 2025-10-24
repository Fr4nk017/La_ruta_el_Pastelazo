const esbuild = require('@esbuild-kit/cjs-loader');
const { createServer } = require('vite');

module.exports = function karmaConfig(config) {
  config.set({
    // Base path que se utilizará para resolver todos los patrones
    basePath: '',

    // Frameworks a utilizar
    frameworks: ['jasmine'],

    // Lista de archivos/patterns para cargar en el navegador
    files: [
      // Setup de pruebas
      { pattern: 'src/test/setup.js', type: 'module' },
      // Archivos de prueba
      { pattern: 'src/**/*.test.{js,jsx}', type: 'module' },
      { pattern: 'src/**/*.spec.{js,jsx}', type: 'module' },
      // Archivos de origen
      { pattern: 'src/**/*.{js,jsx}', type: 'module', included: false }
    ],

    // Lista de archivos a excluir
    exclude: [
      'node_modules/**',
      'dist/**'
    ],

    // Preprocesadores para las fuentes
    preprocessors: {
      'src/**/*.{js,jsx}': ['esbuild', 'coverage']
    },

    // Configuración de esbuild para manejar JSX
    esbuild: {
      loader: '@esbuild-kit/cjs-loader',
      options: {
        jsx: 'automatic', // Para React 17+
        jsxImportSource: 'react',
        target: 'es2020',
        format: 'esm',
      }
    },

    // Configuración de Vite
    vite: {
      server: {
        hmr: false
      },
      plugins: [
        require('@vitejs/plugin-react')()
      ]
    },

    // Configuración del reporter de cobertura
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text' },
        { type: 'text-summary' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    },

    // Reporteros a usar
    reporters: ['progress', 'coverage'],

    // Puerto del servidor web
    port: 9876,

    // Habilitar/deshabilitar colores en la salida
    colors: true,

    // Nivel de logging
    logLevel: config.LOG_INFO,

    // Habilitar/deshabilitar observación de archivos y ejecución automática de pruebas
    autoWatch: true,

    // Navegadores a iniciar
    browsers: ['ChromeHeadless'],

    // Karma se puede ejecutar en modo continuo o CI
    // si es true, Karma captura los navegadores, ejecuta las pruebas y sale
    singleRun: false,

    // Límite de concurrencia
    concurrency: Infinity,

    // Plugins necesarios
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-esbuild-preprocessor'
    ],

    // Configuración del cliente
    client: {
      jasmine: {
        // Configuración de Jasmine
        random: true,
        seed: '4321',
        oneFailurePerSpec: true,
        failFast: true,
        timeoutInterval: 5000
      },
      clearContext: false // deja el contexto de Jasmine visible en la página
    }
  });
};