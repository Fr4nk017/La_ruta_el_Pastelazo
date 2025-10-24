import '@testing-library/jasmine-dom';
import { configure } from '@testing-library/dom';
import * as matchers from '@testing-library/jasmine-dom/matchers';

// Configurar el timeout por defecto para las consultas
configure({ asyncUtilTimeout: 1000 });

// Agregar los matchers personalizados de testing-library
beforeAll(() => {
  jasmine.addMatchers(matchers);
});