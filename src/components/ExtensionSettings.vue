<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElForm, ElFormItem, ElSwitch } from 'element-plus';
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
</script>

<template>
    <h2>生成設定</h2>
    <ElForm label-position="left" label-width="300px">
        <ElFormItem label="Enterキーによる生成を無効化する">
            <ElSwitch v-model="currentSettings.disableEnterKeyGeneration" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="Ctrl + Enter キーで画面上のどこでも生成する">
            <ElSwitch v-model="currentSettings.generateEverywhere" @change="saveSettings" />
        </ElFormItem>
    </ElForm>

    <h2>生成履歴設定</h2>
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

    <h2>見た目の設定</h2>
    <ElForm label-position="left" label-width="300px">
        <ElFormItem label="モデル選択ボックスを非表示にする">
            <ElSwitch v-model="currentSettings.hideModelSelector" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="プロンプト欄の高さを固定する">
            <ElSwitch v-model="currentSettings.shrinkPromptArea" @change="saveSettings" />
        </ElFormItem>
    </ElForm>

    <h2>その他の設定</h2>
    <ElForm label-position="left" label-width="300px">
        <ElFormItem label="保存ファイル名を<日時-シード>にする">
            <ElSwitch v-model="currentSettings.datetimeFilename" @change="saveSettings" />
        </ElFormItem>
        <ElFormItem label="一部のスライダーに +/- ボタンを表示する">
            <ElSwitch v-model="currentSettings.sliderButton" @change="saveSettings" />
        </ElFormItem>
        <ElFormItem label="Anlas消費時の確認ダイアログを表示する">
            <ElSwitch v-model="currentSettings.confirmDialog" @change="saveSettings" />
        </ElFormItem>
    </ElForm>
</template>

<style scoped></style>
