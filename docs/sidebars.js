module.exports = {
    docs: [
        {
            type: 'doc',
            id: 'intro',
        },
        {
            type: 'doc',
            id: 'installation',
        },
        {
            type: 'doc',
            id: 'setup',
        },
        {
            type: 'category',
            label: 'Store (Redux API)',
            items: [
                'redux',
                'redux-setup',
                'actions',
                'reducers',
                'selectors',
                'effects',
                'ts-action',
            ],
        },
        {
            type: 'category',
            label: 'Feature Store',
            items: [
                'fs-quick-start',
                'fs-setup',
                'fs-set-state',
                'fs-select',
                'fs-effect',
                'fs-config',
            ],
        },
        {
            type: 'category',
            label: 'Extensions',
            items: [
                'ext-quick-start',
                'ext-redux-dev-tools',
                'ext-immutable',
                'ext-undo-extension',
                'ext-logger',
            ],
        },
        {
            type: 'doc',
            id: 'angular',
        },
    ],
};
