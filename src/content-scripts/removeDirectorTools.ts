import { BUTTON_TEXT_DIRECTOR_TOOLS_EN, BUTTON_TEXT_DIRECTOR_TOOLS_JA } from '@/constants/nai';

// Director Toolsボタンを非表示にする
export const removeDirectorTools = () => {
    function proc() {
        const buttons = document.querySelectorAll('button');
        const target = Array.from(buttons).find(
            (button) =>
                button.textContent?.includes(BUTTON_TEXT_DIRECTOR_TOOLS_EN) ||
                button.textContent?.includes(BUTTON_TEXT_DIRECTOR_TOOLS_JA),
        );

        if (!target) return;

        if (target.style.display !== 'none') {
            target.style.display = 'none';
        }
    }

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};
