<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElButton, ElForm, ElFormItem, ElInputNumber, ElSwitch, ElTooltip } from 'element-plus';
import { ACTION_UPDATE_SETTINGS } from '@/constants/chrome-api';
import { NAI_URL } from '@/constants/nai';
import { defaultExtensionSettings } from '@/utils';

const currentSettings = ref<ExtensionSettings>(defaultExtensionSettings);

onMounted(async () => {
    const storageSettings = await chrome.storage.local.get();
    currentSettings.value = { ...currentSettings.value, ...storageSettings };
});

const saveSettings = async () => {
    await chrome.storage.local.set(currentSettings.value);

    const [tab] = await chrome.tabs.query({ url: NAI_URL });
    if (tab && tab.id) {
        await chrome.tabs.sendMessage(tab.id, { action: ACTION_UPDATE_SETTINGS });
    }
};

const settingAll = (flag: boolean) => {
    Object.keys(currentSettings.value).forEach((key) => {
        const settingKey = key as keyof ExtensionSettings;
        if (settingKey !== 'promptWidth' && settingKey !== 'promptHeight') {
            currentSettings.value[settingKey] = flag;
        } else {
            currentSettings.value[settingKey] = flag ? 30 : 0;
        }
    });

    // リサイズ設定は高さ変更と二者択一のためONにしない
    currentSettings.value.resizePromptHeight = false;

    saveSettings();
};

const enablePromptHeight = computed(() => currentSettings.value.promptHeight > 0);
const changePromptHeight = () => {
    if (enablePromptHeight.value) {
        // プロンプトの高さ設定をする場合はリサイズは設定不可
        currentSettings.value.resizePromptHeight = false;
    }
    saveSettings();
};
</script>

<template>
    <ElButton @click="settingAll(true)">すべてON</ElButton>
    <ElButton @click="settingAll(false)">すべてOFF</ElButton>

    <h3>生成設定</h3>
    <ElForm label-position="left" label-width="300px">
        <ElFormItem label="Enterキーによる生成を無効化する">
            <ElSwitch v-model="currentSettings.disableEnterKeyGeneration" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="Ctrl + Enter キーで画面上のどこでも生成する">
            <ElSwitch v-model="currentSettings.generateEverywhere" @change="saveSettings" />
        </ElFormItem>
    </ElForm>

    <h3>生成履歴設定</h3>
    <ElForm label-position="left" label-width="300px">
        <ElFormItem label="生成履歴を右クリックで保存する">
            <ElSwitch v-model="currentSettings.enableHistorySaveShortcut" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="生成履歴をマウスホイールで選択する">
            <ElSwitch v-model="currentSettings.wheelHistory" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="閲覧済みの生成履歴を強調する">
            <ElSwitch v-model="currentSettings.highlightViewedHistory" @change="saveSettings" />
        </ElFormItem>
        <ElFormItem label="生成履歴を確認なしで削除する">
            <ElSwitch
                v-model="currentSettings.enableDeleteHistoryWithoutConfirm"
                @change="saveSettings"
            />
        </ElFormItem>
    </ElForm>

    <h3>見た目の設定</h3>
    <ElForm label-position="left" label-width="300px">
        <ElFormItem label="モデル選択ボックスを非表示にする">
            <ElSwitch v-model="currentSettings.hideModelSelector" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="画像設定欄を生成画像上部に移動する">
            <ElSwitch v-model="currentSettings.rearrangeImageSettings" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="プロンプト欄の幅を変更する(%) (0でOFF)">
            <ElInputNumber
                v-model="currentSettings.promptWidth"
                controls-position="right"
                :min="0"
                :max="80"
                size="small"
                :step="10"
                @change="saveSettings"
            />
        </ElFormItem>

        <ElFormItem label="プロンプト欄の高さを変更する(%) (0でOFF)">
            <ElInputNumber
                v-model="currentSettings.promptHeight"
                controls-position="right"
                :min="0"
                :max="80"
                size="small"
                :step="10"
                @change="changePromptHeight"
            />
        </ElFormItem>

        <ElFormItem label="プロンプト欄の高さをリサイズ可能にする">
            <ElTooltip
                :disabled="!enablePromptHeight"
                effect="dark"
                content="プロンプト欄の高さを変更する場合は設定できません。"
                placement="top"
            >
                <ElSwitch
                    v-model="currentSettings.resizePromptHeight"
                    :disabled="enablePromptHeight"
                    @change="saveSettings"
                />
            </ElTooltip>
        </ElFormItem>
    </ElForm>

    <h3>ショートカットキー設定</h3>
    <ElForm label-position="left" label-width="375px">
        <ElFormItem label='Ctrl / Alt + ↑ / ↓キー で"{}" / "[]"の数を増減する'>
            <ElSwitch v-model="currentSettings.shortcutControlBracket" @change="saveSettings" />
        </ElFormItem>
        <ElFormItem label='"{", "[" を自動で閉じる'>
            <ElSwitch v-model="currentSettings.shortcutAutoBracket" @change="saveSettings" />
        </ElFormItem>
    </ElForm>

    <h3>その他の設定</h3>
    <ElForm label-position="left" label-width="375px">
        <ElFormItem label="保存ファイル名を<日時-シード>にする">
            <ElSwitch v-model="currentSettings.datetimeFilename" @change="saveSettings" />
        </ElFormItem>
        <ElFormItem label="プロンプト貼り付け時に改行を保持する">
            <ElSwitch v-model="currentSettings.pasteNewline" @change="saveSettings" />
        </ElFormItem>
        <ElFormItem label="一部のスライダーに +/- ボタンを表示する">
            <ElSwitch v-model="currentSettings.sliderButton" @change="saveSettings" />
        </ElFormItem>
        <ElFormItem label="Anlas消費時の確認ダイアログを表示する">
            <ElSwitch v-model="currentSettings.confirmDialog" @change="saveSettings" />
        </ElFormItem>
        <ElFormItem label="画像読込時、自動で「画像のインポート」を選択する">
            <ElSwitch v-model="currentSettings.importImageWithoutConfirm" @change="saveSettings" />
        </ElFormItem>
        <ElFormItem label="生成完了時に音を鳴らす">
            <ElSwitch v-model="currentSettings.generatedSound" @change="saveSettings" />
        </ElFormItem>
    </ElForm>
</template>

<style scoped></style>
