import { createClassName } from '@/utils';

export const watchHistoryScripts = () => {
    let overlayParentClass = '';
    let overlay: HTMLDivElement | null = null;

    const overlayObserver = () => {
        // 生成画像の親要素を取得
        // (ページ表示後最初の1回はprojection-id、以降(i2iで再描画時)は保持したclass名で特定)
        const overlayParent = overlayParentClass
            ? document.querySelector<HTMLDivElement>(overlayParentClass)
            : document.querySelector<HTMLDivElement>('div[data-projection-id="7"]');
        if (!overlayParent) {
            return;
        }

        // 親要素特定用にclass名を1回だけ保持
        if (!overlayParentClass) {
            // querySelector用に"."で結合
            overlayParentClass = createClassName(overlayParent.className);
        }

        const createOverlay = () => {
            const overlayTmp = document.createElement('div');
            overlayTmp.style.display = 'none';
            overlayTmp.style.position = 'absolute';
            overlayTmp.style.top = '0';
            overlayTmp.style.left = '0';
            overlayTmp.style.right = '0';
            overlayTmp.style.bottom = '0';
            overlayTmp.style.background = 'rgba(128, 128, 128, 0.3)';
            overlayTmp.style.zIndex = '10'; // ないとオーバーレイされない

            return overlayTmp;
        };

        if (!overlayParent.dataset.overlayAdded) {
            // オーバーレイがまだないなら追加
            overlay = createOverlay();

            // imgタグができる前に追加すると画面が止まる(謎)のでちょっと待つ
            setTimeout(() => {
                // 親要素の最初の子(生成画像の上)にオーバーレイを追加
                overlayParent.insertBefore(overlay!, overlayParent.firstChild);
            }, 100);

            overlayParent.dataset.overlayAdded = 'true';
        }
    };

    // inpaint等で画面が切り替わると各要素が再生成されるので変更を監視
    new MutationObserver(overlayObserver).observe(document.body, {
        childList: true,
        subtree: true,
    });

    let selectedIndex = 0;
    let thumbnails: NodeListOf<HTMLDivElement>;
    let historyObserver: MutationObserver | null = null;

    const hisotryObserver = () => {
        const hisotryContainer = document.getElementById('historyContainer');
        if (!hisotryContainer) {
            historyObserver = null;
            return;
        }

        if (historyObserver) {
            return;
        }

        const historyObserve: MutationCallback = () => {
            thumbnails = hisotryContainer.querySelectorAll<HTMLDivElement>('div[role="button"]');

            const onWheel = (event: WheelEvent) => {
                const selectThumbnail = (index: number) => {
                    if (index >= 0 && index < thumbnails.length) {
                        thumbnails[index].click();
                    }
                };

                event.preventDefault();

                const direction = event.deltaY > 0 ? 1 : -1;
                selectThumbnail(selectedIndex + direction);
            };

            if (!hisotryContainer.dataset.wheelEventListenerAdded) {
                // wheelイベントリスナが未登録なら登録
                hisotryContainer.addEventListener('wheel', onWheel);
                hisotryContainer.dataset.wheelEventListenerAdded = 'true';
            }

            // サムネclickイベント
            const onThumbnailClick = (thumbnail: HTMLDivElement, index: number) => {
                // ホイール選択とインデックスを一致させる
                selectedIndex = index;

                // 視聴済みオーバーレイ表示処理
                // (クリック直後はオーバーレイしないようにフラグは後で設定)
                overlay!.style.display = thumbnail.dataset.watched ? '' : 'none';

                if (!thumbnail.dataset.watched) {
                    // 視聴済みフラグを登録
                    thumbnail.dataset.watched = 'true';
                }
            };

            // 視聴済みフラグの作業用リストを作成
            // (生成後にdiv要素が子要素の最後に追加されるが、実際の画像は一番上に来るのでフラグをそれに合わせる)
            const watchedWorkList = [...thumbnails].map((thumbnail) => thumbnail.dataset.watched);
            watchedWorkList.unshift(watchedWorkList.pop());

            thumbnails.forEach((thumbnail, index) => {
                if (!thumbnail.dataset.clickEventListenerAdded) {
                    thumbnail.addEventListener('click', () => onThumbnailClick(thumbnail, index));
                    thumbnail.dataset.clickEventListenerAdded = 'true';
                }

                // 視聴済みフラグを更新する
                if (watchedWorkList[index]) {
                    thumbnail.dataset.watched = 'ture';
                } else {
                    // delete演算子で削除(undefinedを入れると文字列'undefined'になる)
                    delete thumbnail.dataset.watched;
                }
            });

            // 新規生成時はオーバーレイを消す
            overlay!.style.display = 'none';
        };

        // フラグの管理がややこしくなるので、画面全体ではなく履歴サムネが増えるのだけを監視する
        historyObserver = new MutationObserver(historyObserve);
        historyObserver.observe(hisotryContainer.childNodes[1], { childList: true, subtree: true });
    };

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    new MutationObserver(hisotryObserver).observe(document.body, {
        childList: true,
        subtree: true,
    });
};
