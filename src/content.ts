import { wheelHistory } from './content-scripts/wheel-history';
import { deleteHistory } from './content-scripts/delete-history';
import { disableEnterGeneration } from './content-scripts/disable-enter-generation';
import { saveHistoryShortcut } from './content-scripts/save-hisotry-shortcut';

wheelHistory();
deleteHistory();
disableEnterGeneration();
saveHistoryShortcut();
