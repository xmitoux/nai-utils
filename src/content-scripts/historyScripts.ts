import dayjs from 'dayjs';
import { addEventListener } from '@/utils';
import { saveButton, overlay } from '@/content-scripts/setupContents';
import { BUTTON_TEXT_SEED_EN, BUTTON_TEXT_SEED_JA } from '@/constants/nai';

export const historyScripts = (extensionSettings: ExtensionSettings) => {
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
                if (event.altKey) {
                    // Altキーが押されている場合はスクロール
                    return;
                }

                const selectThumbnail = (index: number) => {
                    if (index >= 0 && index < thumbnails.length) {
                        thumbnails[index].click();
                    }
                };

                event.preventDefault();

                const direction = event.deltaY > 0 ? 1 : -1;
                selectThumbnail(selectedIndex + direction);
            };

            if (extensionSettings.selectHistoryWithMouseWheel) {
                addEventListener(hisotryContainer, 'wheel', 'wheelEventListenerAdded', onWheel);
            }

            // サムネ保存イベント
            const saveThumbnail = () => {
                downloadDatetimeNamedImage();
                saveButton!.style.opacity = '0.4';
                thumbnails[selectedIndex].dataset.saved = 'true';
            };
            const onSave = (event: Event) => {
                saveThumbnail();
                event.stopPropagation();
            };
            if (extensionSettings.datetimeFilename) {
                addEventListener(saveButton!, 'click', 'saveOverrided', onSave);
            }

            // 履歴エリアに右クリック保存イベントを追加
            const onContextmenu = (event: Event) => {
                event.preventDefault();
                extensionSettings.datetimeFilename ? saveThumbnail() : saveButton!.click();
            };
            if (extensionSettings.enableHistorySaveShortcut) {
                addEventListener(
                    hisotryContainer,
                    'contextmenu',
                    'contextmenuListenerAdded',
                    onContextmenu,
                );
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
                    saveButton!.style.opacity = '0.4';
                } else {
                    saveButton!.style.opacity = '';
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
                addEventListener(thumbnail, 'click', 'clickEventListenerAdded', () =>
                    onThumbnailClick(thumbnail, index),
                );

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
                saveButton!.style.opacity = '';
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
            const spanText = span.textContent?.trim();
            if (spanText === BUTTON_TEXT_SEED_EN || spanText === BUTTON_TEXT_SEED_JA) {
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
