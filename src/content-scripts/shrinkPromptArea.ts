export const shrinkPromptArea = () => {
    const proc = () => {
        const promptTextareaList = document.querySelectorAll<HTMLTextAreaElement>('textarea');
        if (!promptTextareaList.length) {
            return;
        }

        promptTextareaList[0].style.height = '200px';

        if (promptTextareaList[1]) {
            promptTextareaList[1].style.height = '200px';
        }
    };

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};
