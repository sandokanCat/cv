<?php

declare(strict_types=1);

return [
    'directives' => [
        'fetch' => [
            'default-src',
            'child-src',
            'connect-src',
            'font-src',
            'frame-src',
            'img-src',
            'manifest-src',
            'media-src',
            'object-src',
            'script-src',
            'script-src-elem',
            'script-src-attr',
            'style-src',
            'style-src-elem',
            'style-src-attr',
            'worker-src',
        ],
        'document' => [
            'base-uri',
            'sandbox',
        ],
        'navigation' => [
            'form-action',
            'frame-ancestors',
            'navigate-to',
        ],
        'reporting' => [
            'report-to',
            'report-uri',
        ],
        'security' => [
            'upgrade-insecure-requests',
            'block-all-mixed-content',
        ],
        'trusted-types' => [
            'require-trusted-types-for',
            'trusted-types',
        ],
        'legacy' => [
            'plugin-types',
            'referrer',
            'reflected-xss',
            'require-sri-for',
        ],
        'experimental' => [
            'prefetch-src',
            'webrtc-src',
        ],
    ],

    'status' => [
        'standard' => [
            'default-src',
            'child-src',
            'connect-src',
            'font-src',
            'frame-src',
            'img-src',
            'manifest-src',
            'media-src',
            'object-src',
            'script-src',
            'script-src-elem',
            'script-src-attr',
            'style-src',
            'style-src-elem',
            'style-src-attr',
            'worker-src',
            'base-uri',
            'sandbox',
            'form-action',
            'frame-ancestors',
            'report-to',
            'upgrade-insecure-requests',
        ],
        'deprecated' => [
            'report-uri',
            'block-all-mixed-content',
            'plugin-types',
            'referrer',
            'reflected-xss',
            'require-sri-for',
            'prefetch-src',
        ],
        'non-standard-or-proposed' => [
            'navigate-to',
            'webrtc-src',
        ],
        'extension-specifications' => [
            'require-trusted-types-for',
            'trusted-types',
        ],
    ],

    'syntax' => [
        'source-list' => [
            'default-src',
            'child-src',
            'connect-src',
            'font-src',
            'frame-src',
            'img-src',
            'manifest-src',
            'media-src',
            'object-src',
            'script-src',
            'script-src-elem',
            'script-src-attr',
            'style-src',
            'style-src-elem',
            'style-src-attr',
            'worker-src',
            'base-uri',
            'form-action',
            'navigate-to',
            'prefetch-src',
        ],
        'ancestor-list' => [
            'frame-ancestors',
        ],
        'valueless' => [
            'upgrade-insecure-requests',
            'block-all-mixed-content',
        ],
        'sandbox-flags' => [
            'sandbox',
        ],
        'reporting-group' => [
            'report-to',
        ],
        'report-uri' => [
            'report-uri',
        ],
        'trusted-types-policies' => [
            'trusted-types',
        ],
        'trusted-types-sinks' => [
            'require-trusted-types-for',
        ],
        'mime-types' => [
            'plugin-types',
        ],
        'legacy-referrer' => [
            'referrer',
        ],
        'legacy-reflected-xss' => [
            'reflected-xss',
        ],
        'legacy-sri' => [
            'require-sri-for',
        ],
        'webrtc-mode' => [
            'webrtc-src',
        ],
    ],

    'source-keywords' => [
        'common' => [
            "'self'",
            "'none'",
        ],
        'script' => [
            "'unsafe-eval'",
            "'wasm-unsafe-eval'",
            "'strict-dynamic'",
            "'trusted-types-eval'",
        ],
        'script-style' => [
            "'unsafe-inline'",
            "'unsafe-hashes'",
            "'report-sample'",
        ],
    ],

    'schemes' => [
        'https:',
        'http:',
        'data:',
        'blob:',
        'filesystem:',
        'ws:',
        'wss:',
        'ftp:',
    ],

    'sandbox-flags' => [
        'allow-downloads',
        'allow-forms',
        'allow-modals',
        'allow-orientation-lock',
        'allow-pointer-lock',
        'allow-popups',
        'allow-popups-to-escape-sandbox',
        'allow-presentation',
        'allow-same-origin',
        'allow-scripts',
        'allow-storage-access-by-user-activation',
        'allow-top-navigation',
        'allow-top-navigation-by-user-activation',
        'allow-top-navigation-to-custom-protocols',
    ],

    'trusted-types' => [
        'keywords' => [
            "'none'",
            "'allow-duplicates'",
            "'default'",
        ],
        'require-sinks' => [
            "'script'",
        ],
    ],

    'legacy-values' => [
        'referrer' => [
            'no-referrer',
            'none-when-downgrade',
            'origin',
            'origin-when-cross-origin',
            'same-origin',
            'strict-origin',
            'strict-origin-when-cross-origin',
            'unsafe-url',
        ],
        'reflected-xss' => [
            'allow',
            'block',
            'filter',
        ],
        'require-sri-for' => [
            'script',
            'style',
        ],
    ],

    'experimental-values' => [
        'webrtc-src' => [
            "'allow'",
        ],
    ],

    'reporting' => [
        'default-group' => 'csp-endpoint',
    ],
];
