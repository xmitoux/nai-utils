import { watchHistoryScripts } from './content-scripts/watch-history-scripts';
import { deleteHistoryWithoutConfirm } from './content-scripts/delete-history-without-confirm';
import { disableEnterGeneration } from './content-scripts/disable-enter-generation';
import { saveHistoryShortcut } from './content-scripts/save-hisotry-shortcut';
import { noModelSelector } from './content-scripts/no-model-selector';

watchHistoryScripts();
deleteHistoryWithoutConfirm();
disableEnterGeneration();
saveHistoryShortcut();
noModelSelector();
