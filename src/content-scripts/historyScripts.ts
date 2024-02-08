import dayjs from 'dayjs';
import { addEvent } from '@/utils';
import { saveButton, overlay, generatedImage } from '@/content-scripts/setupContents';
import { BUTTON_TEXT_SEED_EN, BUTTON_TEXT_SEED_JA } from '@/constants/nai';

export const historyScripts = ({
    wheelHistory,
    datetimeFilename,
    enableHistorySaveShortcut,
    generatedSound,
}: ExtensionSettings) => {
    let selectedIndex = 0;
    let thumbnails: NodeListOf<HTMLDivElement>;
    let historyObserver: MutationObserver | null = null;

    const audioUrl = chrome.runtime.getURL('/assets/generated-sound.mp3');
    const audio = new Audio(audioUrl);

    const hisotryObserver = () => {
        const historyContainer = document.querySelector<HTMLElement>('#historyContainer');
        if (!historyContainer) {
            historyObserver = null;
            return;
        } else if (historyObserver) {
            return;
        }

        const historyObserve: MutationCallback = () => {
            // 新規生成時処理
            const newImageGenerated = () => {
                if (overlay) {
                    // 視聴済みオーバーレイを消す
                    overlay.style.display = 'none';
                }
                if (saveButton) {
                    // 保存ボタンの色をデフォルトに戻す
                    saveButton.style.opacity = '';
                }

                generatedSound && audio.play();
            };

            // サムネが増えたら新規生成と判定
            const oldThumbnailsCount = thumbnails?.length ?? 0;
            thumbnails = historyContainer.querySelectorAll<HTMLDivElement>('div[role="button"]');
            if (thumbnails.length > oldThumbnailsCount) {
                newImageGenerated();
            }

            // サムネwheelイベント
            const addWheelEvent = () => {
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

                addEvent(historyContainer, 'wheel', 'wheelEventAdded', onWheel);
            };
            wheelHistory && addWheelEvent();

            // 日時ファイル名画像保存イベント
            const saveThumbnail = () => {
                downloadDatetimeNamedImage();
                saveButton!.style.opacity = '0.4';
                thumbnails[selectedIndex].dataset.saved = 'true';
            };

            const addSaveEvent = () => {
                const onSave = (event: Event) => {
                    saveThumbnail();
                    event.stopPropagation();
                };

                if (saveButton) {
                    addEvent(saveButton, 'click', 'saveOverrided', onSave);
                }
            };
            datetimeFilename && addSaveEvent();

            // 履歴エリア右クリック保存イベント
            const addContextmenuEvent = () => {
                const onContextmenu = (event: Event) => {
                    event.preventDefault();
                    saveButton?.click();
                };

                addEvent(historyContainer, 'contextmenu', 'contextmenuEventAdded', onContextmenu);
            };
            enableHistorySaveShortcut && addContextmenuEvent();

            // サムネclickイベント
            const addThumbnailClickEvent = () => {
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

                    if (saveButton) {
                        if (thumbnail.dataset.saved) {
                            // 保存済み画像のとき保存ボタンを灰色にする
                            saveButton.style.opacity = '0.4';
                        } else {
                            saveButton.style.opacity = '';
                        }
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
                    addEvent(thumbnail, 'click', 'clickEventListenerAdded', () =>
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
            };
            addThumbnailClickEvent();
        };

        // フラグの管理がややこしくなるので、画面全体ではなく履歴サムネが増えるのだけを監視する
        historyObserver = new MutationObserver(historyObserve);
        historyObserver.observe(historyContainer.childNodes[1], { childList: true, subtree: true });
    };

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    new MutationObserver(hisotryObserver).observe(document.body, {
        childList: true,
        subtree: true,
    });
};

const downloadDatetimeNamedImage = async () => {
    // Blob URLからBlobを取得
    const response = await fetch(generatedImage!.src);
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
