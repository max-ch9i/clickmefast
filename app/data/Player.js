export default class Player {
    constructor(payload) {
        this.uid = payload.uid;
        this.name = payload.name;
        this.state = payload.state;
    }
    changeName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getUID() {
        return this.uid;
    }
    queue() {
        this.state = 'queue';
        return this;
    }
    play() {
        this.state = 'play';
        return this;
    }
    isQueuing() {
        return this.state === 'queue';
    }
    getState() {
        return this.state;
    }
    toObj() {
        return {
            uid: this.uid,
            name: this.name,
            state: this.state
        };
    }
}