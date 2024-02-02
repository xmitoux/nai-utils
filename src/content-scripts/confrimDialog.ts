import {
    BUTTON_TEXT_GENERATE_EN,
    BUTTON_TEXT_GENERATE_JA,
    BUTTON_TEXT_UPSCALE_EN,
    BUTTON_TEXT_UPSCALE_JA,
} from '@/constants/nai';
import { upscaleButton, variationButton } from '@/content-scripts/setupContent';
import { addEventListener } from '@/utils';

export const confirmDialog = () => {
    const proc = () => {
        const buttons = document.querySelectorAll<HTMLButtonElement>('button');

        // 生成ボタンとi2iのupscaleボタンをテキストで探す
        for (const button of buttons) {
            const buttonText = button.textContent;
            if (
                buttonText?.includes(BUTTON_TEXT_GENERATE_EN) ||
                buttonText?.includes(BUTTON_TEXT_GENERATE_JA) ||
                buttonText?.includes(BUTTON_TEXT_UPSCALE_EN) ||
                buttonText?.includes(BUTTON_TEXT_UPSCALE_JA)
            ) {
                addEventListener(button, 'click', 'confirmAdded', onClick);
            }
        }

        // バリエーションボタン
        if (variationButton) {
            addEventListener(variationButton, 'click', 'confirmAdded', onClick);
        }

        // upscaleボタン
        if (upscaleButton) {
            addEventListener(upscaleButton, 'click', 'confirmAdded', onClick);
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
