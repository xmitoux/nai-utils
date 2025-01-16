import { createClassName } from '@/utils';

export const noModelSelector = () => {
    const proc = () => {
        const modelSelectorClass = 'sc-a1af5457-12 bypOGh';
        const modelSelector = document.querySelector<HTMLDivElement>(
            createClassName(modelSelectorClass),
        );
        if (!modelSelector) {
            return;
        }

        if (modelSelector.style.display !== 'none') {
            modelSelector.style.display = 'none';
        }
    };

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};
