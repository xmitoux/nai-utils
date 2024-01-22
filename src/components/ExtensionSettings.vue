<script setup lang="ts">
import { ACTION_UPDATE_SETTINGS } from '@/constants/chrome-api';
import { NAI_URL } from '@/constants/nai';
import { ElForm, ElFormItem, ElSwitch } from 'element-plus';
import { ref, onMounted } from 'vue';

const currentSettings = ref<ExtensionSettings>({
    disableEnterKeyGeneration: false,
    hideModelSelector: false,
    enableDeleteHistoryWithoutConfirm: false,
    enableHistorySaveShortcut: false,
    selectHistoryWithMouseWheel: false,
    highlightViewedHistory: false,
    shrinkPromptArea: false,
});

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
    <ElForm label-position="left" label-width="250px">
        <ElFormItem label="Enterキーによる生成を無効化する">
            <ElSwitch v-model="currentSettings.disableEnterKeyGeneration" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="モデル選択ボックスを非表示にする">
            <ElSwitch v-model="currentSettings.hideModelSelector" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="生成履歴を確認なしで削除する">
            <ElSwitch
                v-model="currentSettings.enableDeleteHistoryWithoutConfirm"
                @change="saveSettings"
            />
        </ElFormItem>

        <ElFormItem label="生成履歴を右クリックで保存する">
            <ElSwitch v-model="currentSettings.enableHistorySaveShortcut" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="生成履歴をマウスホイールで選択する">
            <ElSwitch
                v-model="currentSettings.selectHistoryWithMouseWheel"
                @change="saveSettings"
            />
        </ElFormItem>

        <ElFormItem label="閲覧済みの生成履歴を強調する">
            <ElSwitch v-model="currentSettings.highlightViewedHistory" @change="saveSettings" />
        </ElFormItem>

        <ElFormItem label="プロンプト欄を縮小する">
            <ElSwitch v-model="currentSettings.shrinkPromptArea" @change="saveSettings" />
        </ElFormItem>
    </ElForm>
</template>

<style scoped></style>
