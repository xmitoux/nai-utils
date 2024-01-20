import { wheelHistory } from './content-scripts/wheel-history';
import { deleteHistoryWithoutConfirm } from './content-scripts/delete-history-without-confirm';
import { disableEnterGeneration } from './content-scripts/disable-enter-generation';
import { saveHistoryShortcut } from './content-scripts/save-hisotry-shortcut';

wheelHistory();
deleteHistoryWithoutConfirm();
disableEnterGeneration();
saveHistoryShortcut();
