export const wheelHistory = () => {
    let selectedIndex = 0;
    let thumbnails: NodeListOf<HTMLDivElement>;

    const observer = new MutationObserver((_) => {
        const thumbnailContainer = document.getElementById('historyContainer');

        if (thumbnailContainer instanceof HTMLElement) {
            thumbnails = thumbnailContainer.querySelectorAll<HTMLDivElement>('div[role="button"]');

            const onWheel = (event: WheelEvent) => {
                const selectThumbnail = (index: number) => {
                    if (index >= 0 && index < thumbnails.length) {
                        thumbnails[index].click();
                        selectedIndex = index;
                    }
                };

                event.preventDefault();
                const direction = event.deltaY > 0 ? 1 : -1;
                selectThumbnail(selectedIndex + direction);
            };

            // 既にイベントリスナが追加されていないか確認
            if (!thumbnailContainer.dataset.wheelEventListenerAdded) {
                thumbnailContainer.addEventListener('wheel', onWheel);
                thumbnailContainer.dataset.wheelEventListenerAdded = 'true';
            }

            // ホイール選択とselectedIndexを一致させるためのサムネclickイベントを追加
            thumbnails.forEach((thumbnail, index) => {
                if (!thumbnail.dataset.clickEventListenerAdded) {
                    thumbnail.addEventListener('click', () => {
                        selectedIndex = index;
                    });
                    thumbnail.dataset.clickEventListenerAdded = 'true';
                }
            });
        }
    });

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    observer.observe(document.body, { childList: true, subtree: true });
};