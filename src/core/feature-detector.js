/**
 * Browser Feature Detection
 * @module core/feature-detector
 * @version 1.0.0
 *
 * Detects browser capabilities and displays appropriate messages
 * for unsupported browsers.
 */

export class FeatureDetector {
    /**
     * Check all required features
     * @returns {{supported: boolean, missing: string[]}} Detection results
     */
    static check() {
        const required = {
            canvas: () => {
                const canvas = document.createElement('canvas');
                return !!(canvas.getContext && canvas.getContext('2d'));
            },
            webWorkers: () => typeof Worker !== 'undefined',
            es6: () => {
                try {
                    // Test arrow functions
                    eval('() => {}');
                    // Test const/let
                    eval('const x = 1;');
                    // Test template literals
                    eval('`test`');
                    // Test classes
                    eval('class Test {}');
                    return true;
                } catch {
                    return false;
                }
            },
            typedArrays: () => typeof Float32Array !== 'undefined',
            es6Modules: () => 'noModule' in document.createElement('script'),
            requestAnimationFrame: () => typeof requestAnimationFrame !== 'undefined',
            localStorage: () => {
                try {
                    const test = '__test__';
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch {
                    return false;
                }
            }
        };

        const missing = [];
        for (const [name, test] of Object.entries(required)) {
            if (!test()) missing.push(name);
        }

        return { supported: missing.length === 0, missing };
    }

    /**
     * Get browser information
     * @returns {{name: string, version: string}} Browser info
     */
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let name = 'Unknown';
        let version = 'Unknown';

        if (ua.includes('Firefox/')) {
            name = 'Firefox';
            version = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Chrome/') && !ua.includes('Edg')) {
            name = 'Chrome';
            version = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
            name = 'Safari';
            version = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Edg/')) {
            name = 'Edge';
            version = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
        }

        return { name, version };
    }

    /**
     * Check if browser meets minimum version requirements
     * @returns {boolean} True if browser is supported
     */
    static checkBrowserVersion() {
        const { name, version } = this.getBrowserInfo();
        const minVersions = {
            'Chrome': 90,
            'Firefox': 88,
            'Safari': 14,
            'Edge': 90
        };

        if (!(name in minVersions)) {
            return true; // Unknown browser, allow it
        }

        const majorVersion = parseInt(version.split('.')[0]);
        return majorVersion >= minVersions[name];
    }

    /**
     * Display unsupported browser message
     * @param {string[]} missing - List of missing features
     */
    static showUnsupportedMessage(missing) {
        const { name, version } = this.getBrowserInfo();

        document.body.innerHTML = `
            <div style="
                max-width: 600px;
                margin: 100px auto;
                padding: 40px;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            ">
                <h1 style="color: #d32f2f; margin: 0 0 20px 0;">
                    ⚠️ Unsupported Browser
                </h1>

                <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    Your browser (<strong>${name} ${version}</strong>) is missing required features
                    to run PacificWaves.
                </p>

                <div style="
                    background: #fff3e0;
                    border-left: 4px solid #ff9800;
                    padding: 16px;
                    margin: 20px 0;
                ">
                    <h3 style="margin: 0 0 10px 0; color: #e65100;">Missing Features:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #555;">
                        ${missing.map(f => `<li><strong>${f}</strong></li>`).join('')}
                    </ul>
                </div>

                <h3 style="margin: 30px 0 15px 0; color: #333;">Recommended Browsers:</h3>
                <ul style="line-height: 2; color: #555;">
                    <li>Google Chrome 90+ (<a href="https://www.google.com/chrome/">Download</a>)</li>
                    <li>Mozilla Firefox 88+ (<a href="https://www.mozilla.org/firefox/">Download</a>)</li>
                    <li>Microsoft Edge 90+ (<a href="https://www.microsoft.com/edge">Download</a>)</li>
                    <li>Safari 14+ (macOS/iOS)</li>
                </ul>

                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
                    If you believe this is an error, please
                    <a href="https://github.com/stonezone/PacificWaves/issues">report it on GitHub</a>.
                </p>
            </div>
        `;
    }

    /**
     * Display warning for old browser version
     */
    static showOutdatedWarning() {
        const { name, version } = this.getBrowserInfo();

        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #fff3cd;
            border-bottom: 2px solid #ffc107;
            padding: 12px 20px;
            text-align: center;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            color: #856404;
        `;

        banner.innerHTML = `
            ⚠️ <strong>${name} ${version}</strong> is outdated.
            Some features may not work correctly. Please update your browser for the best experience.
            <button style="
                margin-left: 20px;
                padding: 4px 12px;
                background: #ffc107;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
            " onclick="this.parentElement.remove()">Dismiss</button>
        `;

        document.body.prepend(banner);
    }

    /**
     * Run all feature checks and display appropriate message
     * @returns {boolean} True if all features supported
     */
    static runChecks() {
        const { supported, missing } = this.check();

        if (!supported) {
            this.showUnsupportedMessage(missing);
            return false;
        }

        // Check browser version (warning only, doesn't block)
        if (!this.checkBrowserVersion()) {
            this.showOutdatedWarning();
        }

        return true;
    }
}
