export const wheelHistory = () => {
    let selectedIndex = 0;
    let thumbnails: NodeListOf<HTMLDivElement>;

    const proc = () => {
        const thumbnailContainer = document.getElementById('historyContainer');
        if (!thumbnailContainer) {
            return;
        }

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

        if (!thumbnailContainer.dataset.wheelEventListenerAdded) {
            // wheelイベントリスナが未登録なら登録
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
    };

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    const observer = new MutationObserver(proc);
    observer.observe(document.body, { childList: true, subtree: true });
};
