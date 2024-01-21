export const shrinkPromptArea = () => {
    const proc = () => {
        const promptTextareaList = document.querySelectorAll<HTMLTextAreaElement>('textarea');
        if (!promptTextareaList.length && promptTextareaList.length < 2) {
            return;
        }

        promptTextareaList[0].style.height = '';
        promptTextareaList[1].style.height = '';
    };

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};
