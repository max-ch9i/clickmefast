import {Dispatcher} from 'flux';
import type {Action} from './Actions';
import Queue from 'queue';
import invariant from 'invariant';

class QDispatcher<TPayload> extends Dispatcher<TPayload> {
    _actionQueue: Queue
    _actionQueueActive: boolean
    constructor() {
        super();
        this._actionQueue = new Queue();
        this._actionQueue.concurrency = 1; // make it synchronous
        this._actionQueueActive = false;
        this._actionQueue.on('end', function() {
            this._actionQueueActive = false;
        }.bind(this));
    }
    dispatch(payload: TPayload, cb: Function): void {
        invariant(
            !this._isDispatching,
            'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
        );
        this._startDispatching(payload);
        try {
          for (var id in this._callbacks) {
                if (this._isPending[id]) {
                    continue;
                }
                this._invokeCallback(id);
            }
        } finally {
            this._stopDispatching();
            cb();
        }
    }
    queueDispatch(payload: TPayload): void {
        this._actionQueue.push(function(cb) {
            this.dispatch(payload, cb);
        }.bind(this));

        if (!this._actionQueueActive) {
            this._actionQueueActive = true;
            this._actionQueue.start();
        }
    }
}


const disp: QDispatcher<Action> = new QDispatcher();
export default disp;
export const dispatch = disp.queueDispatch.bind(disp);