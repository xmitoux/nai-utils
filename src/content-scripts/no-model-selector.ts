import { getElementsByStyle } from '@/utils';

export const noModelSelector = () => {
    const observer = new MutationObserver(proc);
    function proc() {
        const targetStyle =
            'display: flex; flex-direction: row; justify-content: space-between; width: 100%; padding: 10px';

        const targets = getElementsByStyle(targetStyle);
        if (!targets.length) return;

        const target = targets[0].parentElement;
        if (!target) return;

        target.style.display = 'none';
        observer.disconnect();
    }

    observer.observe(document.body, { childList: true, subtree: true });
};
