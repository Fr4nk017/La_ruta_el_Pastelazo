import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', function() {
  let container;
  
  beforeEach(function() {
    const result = render(
      React.createElement(BrowserRouter, null,
        React.createElement(Navbar)
      )
    );
    container = result.container;
  });

  it('renders basic structure', function() {
    const header = container.querySelector('header');
    const nav = container.querySelector('nav');
    
    expect(header).toBeDefined();
    expect(nav).toBeDefined();
    expect(header.classList.contains('sticky-top')).toBe(true);
    expect(nav.classList.contains('navbar-collapse')).toBe(true);
  });

  it('handles mobile menu', function() {
    const toggle = container.querySelector('.navbar-toggler');
    const menu = container.querySelector('.navbar-collapse');
    
    expect(toggle).toBeDefined();
    expect(menu.classList.contains('show')).toBe(false);
    
    toggle.click();
    expect(menu.classList.contains('show')).toBe(true);
  });

  it('handles modals', function() {
    const loginButton = container.querySelector('[data-testid="login-button"]');
    expect(loginButton).toBeDefined();
    
    loginButton.click();
    
    const modal = document.querySelector('.modal');
    expect(modal).toBeDefined();
    expect(modal.classList.contains('show')).toBe(true);
  });
});