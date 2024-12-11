/*
Implementation was copied from Nano ID (https://github.com/ai/nanoid)
For more details, see LICENSE
 */
export const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

export function generateId(size = 6): string {
    let id = '';
    // A compact alternative for `for (var i = 0; i < step; i++)`.
    let i = size | 0;
    while (i--) {
        // `| 0` is more compact and faster than `Math.floor()`.
        id += urlAlphabet[(Math.random() * 64) | 0];
    }
    return id;
}
