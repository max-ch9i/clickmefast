import CurrentPlayer from './CurrentPlayer';

export default class Opponent extends CurrentPlayer {
    constructor(ref) {
        super();
        this.setRef(ref);
    }
}