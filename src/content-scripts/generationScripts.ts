import { generateButton } from '@/content-scripts/setupContents';

export const generationScripts = ({
    disableEnterKeyGeneration,
    generateEverywhere,
}: ExtensionSettings) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (!event.target) {
            return;
        }

        const el = event.target as HTMLElement;

        // プロンプト欄でのEnterキー生成を抑制
        if (disableEnterKeyGeneration) {
            if (
                el.tagName === 'TEXTAREA' &&
                !(event.ctrlKey || event.metaKey) &&
                event.key == 'Enter'
            ) {
                event.stopPropagation();
                return;
            }
        }

        // ページ内のどこでも Ctrl * Enter で生成
        if (generateEverywhere) {
            if ((event.ctrlKey || event.metaKey) && event.key == 'Enter') {
                generateButton?.click();
                return;
            }
        }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
};
