import { DIV_TEXT_GET_STARTED_EN, DIV_TEXT_GET_STARTED_JA } from '@/constants/nai';

// Get Started表示を非表示にする
export const removeGetStarted = () => {
    function proc() {
        const divElements = document.querySelectorAll('div');
        const target = Array.from(divElements).find(
            (div) =>
                div.textContent?.trim() === DIV_TEXT_GET_STARTED_EN ||
                div.textContent?.trim() === DIV_TEXT_GET_STARTED_JA,
        );

        console.log('getStarted target:', target);

        if (!target) return;

        // 親要素ごと削除
        const parentElement = target.parentElement;
        if (parentElement && parentElement.style.display !== 'none') {
            parentElement.style.display = 'none';
        }
    }

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};
