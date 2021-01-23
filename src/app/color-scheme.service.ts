import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

// Started from: https://gist.github.com/SvenBudak/62d117f813b67a54fb0067db3de829f0#file-color-scheme-service-ts
@Injectable({
    providedIn: 'root'
})
export class ColorSchemeService {

    private renderer: Renderer2;
    public colorScheme: 'light' | 'dark' = 'light';
    public overwritten: boolean = false;
    static readonly DARK_THEME_CLASS = 'infinitd-dark-theme';

    constructor(rendererFactory: RendererFactory2) {
        // Create new renderer from renderFactory, to make it possible to use renderer2 in a service
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    _detectPrefersColorScheme() {
        // Detect if prefers-color-scheme is supported
         if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
             // Set colorScheme to Dark if prefers-color-scheme is dark. Otherwise set to light.
             this.colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
             // If the browser doesn't support prefers-color-scheme, set it as default to light
            this.colorScheme = 'light';
        }
    }

    _setColorScheme(scheme: 'default' | 'light' | 'dark') {
        if (scheme === 'default') {
          localStorage.removeItem('prefers-color');
          this.overwritten = false;
          this._detectPrefersColorScheme();
          return;
        }
        this.colorScheme = scheme;
        // Save prefers-color-scheme to localStorage
        this.overwritten = true;
        localStorage.setItem('prefers-color', scheme);
    }

    _getColorScheme() {
        // Check if any prefers-color-scheme is stored in localStorage
        if (localStorage.getItem('prefers-color')) {
            // Load prefers-color-scheme from localStorage.
            this.colorScheme = localStorage.getItem('prefers-color') === 'dark' ? 'dark' : 'light';
            this.overwritten = true;
        } else {
            // If no prefers-color-scheme is stored in localStorage, try to detect OS default prefers-color-scheme
            this._detectPrefersColorScheme();
        }
    }

    load() {
        this._getColorScheme();
        if (this.colorScheme === 'dark') {
          this.renderer.addClass(document.body, ColorSchemeService.DARK_THEME_CLASS);
        }
    }

    update(scheme: 'default' | 'light' | 'dark') {
        const oldScheme = this.colorScheme;
        if (this.colorScheme === scheme) {
          return;
        }
        this._setColorScheme(scheme);
        if (this.colorScheme === oldScheme) {
          return;
        }
        if (this.colorScheme == 'light') {
          // Remove dark theme class
          this.renderer.removeClass(document.body, ColorSchemeService.DARK_THEME_CLASS);
        } else {
          // Add the dark theme class
          this.renderer.addClass(document.body, ColorSchemeService.DARK_THEME_CLASS);
        }
    }

    getColorSchemeOrDefault(): 'default' | 'light' | 'dark' {
      if (this.overwritten) {
        return this.colorScheme;
      }
      return 'default';
    }
}