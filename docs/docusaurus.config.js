module.exports = {
    title: 'MiniRx - The RxJS Redux Store',
    tagline: 'Make hard things simple - Keep simple things simple',
    url: 'https://your-docusaurus-test-site.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'MiniRx', // Usually your GitHub org/user name.
    projectName: 'Store', // Usually your repo name.
    themeConfig: {
        navbar: {
            title: 'MiniRx',
            logo: {
                alt: 'My Site Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    to: 'docs/',
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
                    editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};
