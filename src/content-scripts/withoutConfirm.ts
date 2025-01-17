import { BUTTON_TEXT_DELETE_HISTORY } from '@/constants/nai';

export const withoutConfirm = ({ enableDeleteHistoryWithoutConfirm }: ExtensionSettings) => {
    const proc = () => {
        const buttons = document.querySelectorAll('button');

        buttons.forEach((button) => {
            if (
                enableDeleteHistoryWithoutConfirm &&
                button.textContent === BUTTON_TEXT_DELETE_HISTORY
            ) {
                button.click();
            }
        });
    };

    const observer = new MutationObserver(proc);
    observer.observe(document.body, { childList: true, subtree: true });
};
