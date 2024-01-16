const observer = new MutationObserver((_) => {
    const thumbnailContainer = document.getElementById('historyContainer');
    if (thumbnailContainer instanceof HTMLElement) {
        let selectedIndex = 0;

        const selectThumbnail = (index: number) => {
            const thumbnails =
                thumbnailContainer.querySelectorAll<HTMLDivElement>('div[role="button"]');
            if (index >= 0 && index < thumbnails.length) {
                thumbnails[index].click();
                selectedIndex = index;
            }
        };

        const onWheel = (event: WheelEvent) => {
            event.preventDefault();
            const direction = event.deltaY > 0 ? 1 : -1;
            selectThumbnail(selectedIndex + direction);
        };

        // 既にイベントリスナーが追加されていないか確認
        if (!thumbnailContainer.dataset.wheelEventListenerAdded) {
            thumbnailContainer.addEventListener('wheel', onWheel);
            thumbnailContainer.dataset.wheelEventListenerAdded = 'true';
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
