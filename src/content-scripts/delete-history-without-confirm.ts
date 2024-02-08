import {
    BUTTON_TEXT_DELETE_HISTORY,
    BUTTON_TEXT_IMPORT_IMAGE_EN,
    BUTTON_TEXT_IMPORT_IMAGE_JA,
} from '@/constants/nai';

export const deleteHistoryWithoutConfirm = ({
    enableDeleteHistoryWithoutConfirm,
    importImageWithoutConfirm,
}: ExtensionSettings) => {
    const proc = () => {
        const buttons = document.querySelectorAll('button');

        buttons.forEach((button) => {
            if (
                enableDeleteHistoryWithoutConfirm &&
                button.textContent === BUTTON_TEXT_DELETE_HISTORY
            ) {
                button.click();
            }

            if (
                importImageWithoutConfirm &&
                (button.textContent === BUTTON_TEXT_IMPORT_IMAGE_EN ||
                    button.textContent === BUTTON_TEXT_IMPORT_IMAGE_JA)
            ) {
                button.click();
            }
        });
    };

    const observer = new MutationObserver(proc);
    observer.observe(document.body, { childList: true, subtree: true });
};
