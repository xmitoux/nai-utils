import { getElementsByStyle } from '@/utils';

export const noModelSelector = () => {
    function proc() {
        const targetStyle =
            'display: flex; flex-direction: row; justify-content: space-between; width: 100%; padding: 10px';

        const targets = getElementsByStyle(targetStyle);
        if (!targets.length) return;

        const target = targets[0].parentElement;
        if (!target) return;

        if (target.style.display !== 'none') {
            target.style.display = 'none';
        }
    }

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};
