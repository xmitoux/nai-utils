import {
    BUTTON_TEXT_GENERATE_EN,
    BUTTON_TEXT_GENERATE_JA,
    BUTTON_TEXT_UPSCALE_EN,
    BUTTON_TEXT_UPSCALE_JA,
} from '@/constants/nai';

export const confirmDialog = () => {
    const proc = () => {
        const buttons = document.querySelectorAll<HTMLButtonElement>('button');

        // 生成ボタンをテキストで探す
        for (const button of buttons) {
            const buttonText = button.textContent;
            if (
                buttonText?.includes(BUTTON_TEXT_GENERATE_EN) ||
                buttonText?.includes(BUTTON_TEXT_GENERATE_JA) ||
                buttonText?.includes(BUTTON_TEXT_UPSCALE_EN) ||
                buttonText?.includes(BUTTON_TEXT_UPSCALE_JA)
            ) {
                if (!button.dataset.confirmAdded) {
                    button.addEventListener('click', onClick);
                    button.dataset.confirmAdded = 'true';
                }
            }
        }
    };

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

const onClick = (event: Event) => {
    // イベントからボタンを取得(子要素をclickしたときもcurrentTargetにはbuttonが入っている)
    const target = event.currentTarget as HTMLElement;

    // 消費Anlas部分のspanを取得
    const spans = target.querySelectorAll('span');
    const lastSpan = spans[spans.length - 1];

    if (lastSpan.textContent! !== '0') {
        const isConfirmed = confirm('Anlasを消費してこの操作を実行します。よろしいですか？');
        if (!isConfirmed) {
            event.stopPropagation();
        }
    }
};
