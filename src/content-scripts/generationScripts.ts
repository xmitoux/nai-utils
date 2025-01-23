import { generateButton } from '@/content-scripts/setupContents';

export const generationScripts = ({ generateEverywhere }: ExtensionSettings) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (!event.target) {
            return;
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
