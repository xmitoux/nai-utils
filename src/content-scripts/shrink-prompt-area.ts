export const shrinkPromptArea = () => {
    const proc = () => {
        const promptTextareaList = document.querySelectorAll<HTMLTextAreaElement>('textarea');
        if (!promptTextareaList.length) {
            return;
        }

        promptTextareaList[0].style.height = '';

        if (promptTextareaList[1]) {
            promptTextareaList[1].style.height = '';
        }
    };

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};
