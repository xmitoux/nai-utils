<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElButton, ElCol, ElForm, ElFormItem, ElRow, ElSwitch } from 'element-plus';
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
        currentSettings.value[settingKey] = flag;
    });

    saveSettings();
};
</script>

<template>
    <div style="margin-bottom: 20px">
        <h1>🎛️NAI utils</h1>
        <div style="margin-top: 10px">
            <ElButton @click="settingAll(true)" style="margin-right: 10px">すべてON</ElButton>
            <ElButton @click="settingAll(false)">すべてOFF</ElButton>
        </div>
    </div>

    <ElRow>
        <ElCol :sm="24" :md="8" :lg="8" :xl="8">
            <h2>🕘生成履歴設定</h2>
            <ElForm label-position="left" label-width="280px">
                <ElFormItem label="生成履歴を右クリックで保存する">
                    <ElSwitch
                        v-model="currentSettings.enableHistorySaveShortcut"
                        @change="saveSettings"
                    />
                </ElFormItem>

                <ElFormItem label="生成履歴をマウスホイールで選択する">
                    <ElSwitch v-model="currentSettings.wheelHistory" @change="saveSettings" />
                </ElFormItem>

                <ElFormItem label="閲覧済みの生成履歴を強調する">
                    <ElSwitch
                        v-model="currentSettings.highlightViewedHistory"
                        @change="saveSettings"
                    />
                </ElFormItem>
                <ElFormItem label="生成履歴を確認なしで削除する">
                    <ElSwitch
                        v-model="currentSettings.enableDeleteHistoryWithoutConfirm"
                        @change="saveSettings"
                    />
                </ElFormItem>
            </ElForm>
        </ElCol>
        <ElCol :sm="24" :md="8" :lg="8" :xl="8">
            <h2>👀見た目の設定</h2>

            <ElForm label-position="left" label-width="280px">
                <ElFormItem label="画像設定欄を生成画像上部に移動する">
                    <ElSwitch
                        v-model="currentSettings.rearrangeImageSettings"
                        @change="saveSettings"
                    />
                </ElFormItem>

                <ElFormItem label="モデル選択ボックスを非表示にする">
                    <ElSwitch v-model="currentSettings.hideModelSelector" @change="saveSettings" />
                </ElFormItem>

                <ElFormItem label="Director Toolsを非表示にする">
                    <ElSwitch v-model="currentSettings.hideDirectorTools" @change="saveSettings" />
                </ElFormItem>

                <ElFormItem label="スタート画面を非表示にする">
                    <ElSwitch v-model="currentSettings.hideGetStarted" @change="saveSettings" />
                </ElFormItem>
            </ElForm>
        </ElCol>

        <ElCol :sm="24" :md="8" :lg="8" :xl="8">
            <h2>🛠️その他の設定</h2>

            <ElForm label-position="left" label-width="280px">
                <ElFormItem label="画面上のどこでも Ctrl + Enter で生成する">
                    <ElSwitch v-model="currentSettings.generateEverywhere" @change="saveSettings" />
                </ElFormItem>

                <ElFormItem label="保存ファイル名を<日時-シード>にする">
                    <ElSwitch v-model="currentSettings.datetimeFilename" @change="saveSettings" />
                </ElFormItem>

                <ElFormItem label="一部のスライダーに +/- ボタンを表示する">
                    <ElSwitch v-model="currentSettings.sliderButton" @change="saveSettings" />
                </ElFormItem>

                <ElFormItem label="Anlas消費時の確認ダイアログを表示する">
                    <ElSwitch v-model="currentSettings.confirmDialog" @change="saveSettings" />
                </ElFormItem>

                <ElFormItem label="生成完了時に音を鳴らす">
                    <ElSwitch v-model="currentSettings.generatedSound" @change="saveSettings" />
                </ElFormItem>
            </ElForm>
        </ElCol>
    </ElRow>
</template>

<style scoped></style>
