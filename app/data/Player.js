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
    toObj() {
        return {
            name: this.name,
            state: this.state
        };
    }
}