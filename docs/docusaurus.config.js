module.exports = {
    title: 'MiniRx - RxJS state management',
    tagline: 'Make hard things simple - Keep simple things simple',
    url: 'https://mini-rx.io',
    baseUrl: '/',
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
                            label: 'Component Store',
                            to: 'docs/component-store',
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
                            label: 'GitHub',
                            href: 'https://github.com/spierala/mini-rx-store',
                        },
                        {
                            label: 'Mastodon',
                            href: 'https://mas.to/tags/MiniRx',
                        },
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/spierala',
                        },
                    ],
                },
                {
                    title: 'Demos',
                    items: [
                        {
                            label: 'Angular Demo',
                            href: 'https://angular-demo.mini-rx.io',
                        },
                        {
                            label: 'Svelte Demo',
                            href: 'https://svelte-demo.mini-rx.io',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'MiniRx Feature Store vs. NgRx Component Store vs. Akita',
                            href: 'https://dev.to/this-is-angular/minirx-feature-store-vs-ngrx-component-store-vs-akita-4983',
                        },
                        {
                            label: 'Angular state management comparison',
                            href: 'https://github.com/spierala/angular-state-management-comparison',
                        },
                        {
                            label: 'Angular Jira Clone',
                            href: 'https://github.com/spierala/jira-clone-angular-mini-rx',
                        },
                        {
                            label: 'Angular Spotify',
                            href: 'https://github.com/spierala/angular-spotify-mini-rx',
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
