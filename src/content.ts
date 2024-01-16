import { wheelHistory } from './content-scripts/wheel-history';
import { deleteHistory } from './content-scripts/delete-history';
import { disableEnterGeneration } from './content-scripts/disable-enter-generation';

wheelHistory();
deleteHistory();
disableEnterGeneration();
