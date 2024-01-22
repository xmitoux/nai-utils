import { createClassName } from '@/utils';

export const noModelSelector = () => {
    const proc = () => {
        const modelSelectorChildClass = 'select css-vopfii-container';
        const modelSelectorChild = document.querySelector(createClassName(modelSelectorChildClass));
        if (!modelSelectorChild) {
            return;
        }

        const parent = modelSelectorChild.parentNode as HTMLDivElement;
        if (!parent) {
            return;
        }

        if (parent.style.display !== 'none') {
            parent.style.display = 'none';
        }
    };

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};
