import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'Flutterwave Node.js SDK',
    description: 'Unofficial Flutterwave v4 API SDK for Node.js',
    base: '/',
    head: [
        ['link', { rel: 'icon', href: 'https://flutterwave.toneflix.net/banner.png' }],
        ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
        ['meta', { name: 'theme-color', content: '#0d1117' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['link', { rel: 'apple-touch-icon', href: 'https://flutterwave.toneflix.net/banner.png' }],
        ['link', { rel: 'mask-icon', href: 'https://flutterwave.toneflix.net/banner.png', color: '#0d1117' }],
        ['meta', { name: 'msapplication-TileImage', content: 'https://flutterwave.toneflix.net/banner.png' }],
        ['meta', { property: 'og:title', content: 'Flutterwave Node.js SDK' }],
        ['meta', { property: 'og:description', content: 'Unofficial Flutterwave v4 API SDK for Node.js' }],
        ['meta', { property: 'og:image', content: 'https://flutterwave.toneflix.net/banner.png' }],
        ['meta', { property: 'og:url', content: 'https://flutterwave.toneflix.net' }],
        ['meta', { name: 'og:type', content: 'website' }],
        ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:title', content: 'Flutterwave Node.js SDK' }],
        ['meta', { name: 'twitter:description', content: 'Unofficial Flutterwave v4 API SDK for Node.js' }],
        ['meta', { name: 'twitter:image', content: 'https://flutterwave.toneflix.net/banner.png' }],
        ['meta', { name: 'twitter:site', content: '@toneflixx' }],
        ['meta', { name: 'twitter:creator', content: '@toneflixx' }],
    ],
    themeConfig: {
        logo: '/logo.png',

        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'API Reference', link: '/api/overview' },
            { text: 'GitHub', link: 'https://github.com/toneflix/flutterwave-4-nodejs-sdk' }
        ],

        sidebar: [
            {
                text: 'Introduction',
                items: [
                    { text: 'What is Flutterwave SDK?', link: '/guide/introduction' },
                    { text: 'Getting Started', link: '/guide/getting-started' },
                    { text: 'Configuration', link: '/guide/configuration' },
                    { text: 'Authentication', link: '/guide/authentication' }
                ]
            },
            {
                text: 'Core Concepts',
                items: [
                    { text: 'Error Handling', link: '/guide/error-handling' },
                    { text: 'Webhook Validation', link: '/guide/webhooks' },
                    { text: 'TypeScript Support', link: '/guide/typescript' }
                ]
            },
            {
                text: 'API Reference',
                items: [
                    { text: 'Overview', link: '/api/overview' },
                    { text: 'Banks', link: '/api/banks' },
                    { text: 'Charges', link: '/api/charges' },
                    { text: 'Chargebacks', link: '/api/chargebacks' },
                    { text: 'Customers', link: '/api/customers' },
                    { text: 'Fees', link: '/api/fees' },
                    { text: 'Mobile Networks', link: '/api/mobile-networks' },
                    { text: 'Orchestration', link: '/api/orchestration' },
                    { text: 'Orders', link: '/api/orders' },
                    { text: 'Payment Methods', link: '/api/payment-methods' },
                    { text: 'Refunds', link: '/api/refunds' },
                    { text: 'Settlements', link: '/api/settlements' },
                    { text: 'Transfer Rates', link: '/api/transfer-rates' },
                    { text: 'Transfer Recipients', link: '/api/transfer-recipients' },
                    { text: 'Transfers', link: '/api/transfers' },
                    { text: 'Transfer Senders', link: '/api/transfer-senders' },
                    { text: 'Virtual Accounts', link: '/api/virtual-accounts' },
                    { text: 'Wallets', link: '/api/wallets' }
                ]
            },
            {
                text: 'Examples',
                items: [
                    { text: 'Direct Transfers', link: '/examples/direct-transfers' },
                    { text: 'Virtual Accounts', link: '/examples/virtual-accounts' },
                    { text: 'Wallet Operations', link: '/examples/wallet-operations' }
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/toneflix/flutterwave-4-nodejs-sdk' },
            { icon: 'twitter', link: 'https://twitter.com/toneflixx' },
            { icon: 'npm', link: 'https://www.npmjs.com/package/flutterwave-node-v4' }
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: `Copyright © ${new Date().getFullYear()} Toneflix`
        },

        search: {
            provider: 'local'
        }
    }
})
