export const deleteHistoryWithoutConfirm = () => {
    const observer = new MutationObserver((_) => {
        const buttons = document.querySelectorAll('button');

        buttons.forEach((button) => {
            if (button.textContent === 'Delete it!') {
                // 日本語設定でも'Delete it!'
                button.click();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
};
