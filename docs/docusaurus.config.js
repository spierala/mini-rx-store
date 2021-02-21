module.exports = {
    title: 'MiniRx - The RxJS Redux Store',
    tagline: 'Make hard things simple - Keep simple things simple',
    url: 'https://github.com/spierala/mini-rx-store',
    baseUrl: '/mini-rx-store/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'spierala', // Usually your GitHub org/user name.
    projectName: 'mini-rx-store', // Usually your repo name.
    themeConfig: {
        navbar: {
            title: 'MiniRx',
            logo: {
                alt: 'MiniRx Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    to: 'docs/intro',
                    activeBasePath: 'docs',
                    label: 'Docs',
                    position: 'left',
                },
                {
                    href: 'https://github.com/spierala/mini-rx-store',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'QuickStart',
                            to: 'docs/intro',
                        },
                        {
                            label: 'Store (Redux)',
                            to: 'docs/redux',
                        },
                        {
                            label: 'Feature Store',
                            to: 'docs/fs-quick-start',
                        },
                        {
                            label: 'Extensions',
                            to: 'docs/ext-quick-start',
                        },
                        {
                            label: 'Angular Integration',
                            to: 'docs/angular',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/spierala',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/spierala/mini-rx-store',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()}`,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl: 'https://github.com/spierala/mini-rx-store/edit/master/docs/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};
