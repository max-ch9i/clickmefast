import QDispatcher from 'flux-queue-dispatcher';

const disp: QDispatcher = new QDispatcher();
export default disp;
export const dispatch = disp.queueDispatch.bind(disp);