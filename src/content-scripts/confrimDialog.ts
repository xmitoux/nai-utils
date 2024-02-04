import {
    generateButton,
    upscaleButtonText,
    upscaleButton,
    variationButton,
} from '@/content-scripts/setupContents';
import { addEvent } from '@/utils';

export const confirmDialog = ({ confirmDialog }: ExtensionSettings) => {
    const proc = () => {
        if (generateButton) {
            addEvent(generateButton, 'click', 'confirmAdded', onClick);
        }

        if (upscaleButtonText) {
            addEvent(upscaleButtonText, 'click', 'confirmAdded', onClick);
        }

        // バリエーションボタン
        if (variationButton) {
            addEvent(variationButton, 'click', 'confirmAdded', onClick);
        }

        // upscaleボタン
        if (upscaleButton) {
            addEvent(upscaleButton, 'click', 'confirmAdded', onClick);
        }
    };

    confirmDialog &&
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
