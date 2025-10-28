module.exports = {
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false, // allows using without a separate babel config
        babelOptions: {
            presets: ['@babel/preset-react'], // React JSX support
        },
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    plugins: [
        'react',
    ],
    rules: {
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'max-len': [
            'error',
            {
                code: 120,
                ignoreUrls: true,
                ignoreComments: true,
            },
        ],
        'keyword-spacing': 'warn',
        'space-infix-ops': 'error',
        'no-unused-vars': [
            'warn',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: false,
            },
        ],
        'react/prop-types': 'off',
        'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
    },
    overrides: [
        {
            files: ['*ML.js'],
            rules: {
                indent: ['error', 2],
            },
        },
    ],
    settings: {
        'import/ignore': [
            '.css$',
            'node_modules/*',
        ],
    },
};
