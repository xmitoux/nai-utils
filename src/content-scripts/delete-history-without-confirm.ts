export const deleteHistoryWithoutConfirm = () => {
    const proc = () => {
        const buttons = document.querySelectorAll('button');

        buttons.forEach((button) => {
            if (button.textContent === 'Delete it!') {
                // 日本語設定でも'Delete it!'
                button.click();
            }
        });
    };

    const observer = new MutationObserver(proc);
    observer.observe(document.body, { childList: true, subtree: true });
};
