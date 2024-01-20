export const saveHistoryShortcut = () => {
    const observer = new MutationObserver((_) => {
        // 保存ボタンの親要素を取得
        const parentDiv = document.querySelector('div[data-projection-id="10"]');
        if (!parentDiv) {
            return;
        }

        const saveButton = parentDiv.querySelector('button') as HTMLButtonElement;

        const onSave = (event: MouseEvent) => {
            event.preventDefault();
            saveButton.click();
        };

        const thumbnailContainer = document.getElementById('historyContainer')!;

        // 既にイベントリスナが追加されていないか確認
        if (!thumbnailContainer.dataset.contextmenuListenerAdded) {
            thumbnailContainer.addEventListener('contextmenu', onSave);
            thumbnailContainer.dataset.contextmenuListenerAdded = 'true';
        }
    });

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    observer.observe(document.body, { childList: true, subtree: true });
};
