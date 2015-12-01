import QDispatcher from 'flux-queue-dispatcher';
import type {Action} from './Actions';

const disp: QDispatcher<Action> = new QDispatcher();
export default disp;
export const dispatch = disp.queueDispatch.bind(disp);