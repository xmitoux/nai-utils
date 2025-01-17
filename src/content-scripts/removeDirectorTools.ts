import { BUTTON_TEXT_DIRECTOR_TOOLS_EN, BUTTON_TEXT_DIRECTOR_TOOLS_JA } from '@/constants/nai';

// Director Toolsボタンを非表示にする
export const removeDirectorTools = () => {
    const observer = new MutationObserver(proc);

    function proc() {
        const buttons = document.querySelectorAll('button');
        const target = Array.from(buttons).find(
            (button) =>
                button.textContent?.includes(BUTTON_TEXT_DIRECTOR_TOOLS_EN) ||
                button.textContent?.includes(BUTTON_TEXT_DIRECTOR_TOOLS_JA),
        );

        if (!target) return;

        target.style.display = 'none';
        observer.disconnect();
    }

    observer.observe(document.body, { childList: true, subtree: true });
};
