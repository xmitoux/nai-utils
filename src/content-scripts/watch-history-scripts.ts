import dayjs from 'dayjs';
import { createClassName } from '@/utils';
import { saveButton } from '@/content-scripts/setupContent';

export const watchHistoryScripts = (extensionSettings: ExtensionSettings) => {
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
    extensionSettings.highlightViewedHistory &&
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

            // サムネwheelイベント
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

            if (
                extensionSettings.selectHistoryWithMouseWheel &&
                !hisotryContainer.dataset.wheelEventListenerAdded
            ) {
                // wheelイベントリスナが未登録なら登録
                hisotryContainer.addEventListener('wheel', onWheel);
                hisotryContainer.dataset.wheelEventListenerAdded = 'true';
            }

            // サムネ保存イベント
            const saveThumbnail = () => {
                downloadDatetimeNamedImage();
                saveButton.style.opacity = '0.4';
                thumbnails[selectedIndex].dataset.saved = 'true';
            };
            const onSave = (event: Event) => {
                saveThumbnail();
                event.stopPropagation();
            };
            if (extensionSettings.datetimeFilename && !saveButton.dataset.saveOverrided) {
                // clickイベントリスナが未登録なら登録
                saveButton.addEventListener('click', onSave);
                saveButton.dataset.saveOverrided = 'true';
            }

            // 履歴エリアに右クリック保存イベントを追加
            const onContextmenu = (event: Event) => {
                event.preventDefault();
                extensionSettings.datetimeFilename ? saveThumbnail() : saveButton.click();
            };
            if (
                extensionSettings.enableHistorySaveShortcut &&
                !hisotryContainer.dataset.contextmenuListenerAdded
            ) {
                hisotryContainer.addEventListener('contextmenu', onContextmenu);
                hisotryContainer.dataset.contextmenuListenerAdded = 'true';
            }

            // サムネclickイベント
            const onThumbnailClick = (thumbnail: HTMLDivElement, index: number) => {
                // ホイール選択とインデックスを一致させる
                selectedIndex = index;

                if (overlay) {
                    // 視聴済みオーバーレイ表示処理
                    // (クリック直後はオーバーレイしないようにフラグは後で設定)
                    overlay.style.display = thumbnail.dataset.watched ? '' : 'none';
                }

                if (!thumbnail.dataset.watched) {
                    // 視聴済みフラグを登録
                    thumbnail.dataset.watched = 'true';
                }

                if (thumbnail.dataset.saved) {
                    // 保存済み画像のとき保存ボタンを灰色にする
                    saveButton.style.opacity = '0.4';
                } else {
                    saveButton.style.opacity = '';
                }
            };

            // 視聴済みフラグの作業用リストを作成
            // (生成後にdiv要素が子要素の最後に追加されるが、実際の画像は一番上に来るのでフラグをそれに合わせる)
            type ThumbnailFlag = {
                watched: boolean;
                saved: boolean;
            };
            const thumbnailFlagWorkList: ThumbnailFlag[] = [...thumbnails].map((thumbnail) => {
                return {
                    watched: !!thumbnail.dataset.watched,
                    saved: !!thumbnail.dataset.saved,
                };
            });
            thumbnailFlagWorkList.unshift(thumbnailFlagWorkList.pop()!);

            thumbnails.forEach((thumbnail, index) => {
                if (!thumbnail.dataset.clickEventListenerAdded) {
                    thumbnail.addEventListener('click', () => onThumbnailClick(thumbnail, index));
                    thumbnail.dataset.clickEventListenerAdded = 'true';
                }

                // サムネイルフラグを更新する
                const thumbnailFlag = thumbnailFlagWorkList[index];
                if (thumbnailFlag.watched) {
                    thumbnail.dataset.watched = 'true';
                } else {
                    // delete演算子で削除(undefinedを入れると文字列'undefined'になるので注意)
                    delete thumbnail.dataset.watched;
                }
                if (thumbnailFlag.saved) {
                    thumbnail.dataset.saved = 'true';
                } else {
                    delete thumbnail.dataset.saved;
                }
            });

            if (overlay) {
                // 新規生成時はオーバーレイを消す
                overlay.style.display = 'none';
                // 保存ボタンの色をデフォルトに戻す
                saveButton.style.opacity = '';
            }
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

const downloadDatetimeNamedImage = async () => {
    const imageElement = document.querySelector<HTMLImageElement>('img')!;

    // Blob URLからBlobを取得
    const response = await fetch(imageElement.src);
    const blob = await response.blob();

    // Blobからダウンロード用のURLを作成
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const now = dayjs().format('YYYYMMDDHHmmss');

    const getSeed = (): string | null => {
        const spans = document.querySelectorAll('span');

        // シードコピーボタンの直前にあるシード値span要素を探してシードを取得
        for (const span of spans) {
            if (span.textContent?.trim() === 'Copy to Seed') {
                const previousElement = span.previousElementSibling as HTMLSpanElement;
                return previousElement?.textContent?.trim() ?? null;
            }
        }
        return null;
    };

    const seed = getSeed() || '';
    const fileName = `${now}-${seed}.png`;
    link.download = fileName;

    link.click();
    URL.revokeObjectURL(url);
};
