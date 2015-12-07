import Firebase from 'firebase';

export default PlayerList {
    constructor(refUrl) {
        this.refPlayers = new Firebase('https://volleyup.firebaseio.com/clickmefast/players');
        this.refPlayers.on('value', function(data) {
            this.snapshot = data;
        }.bind(this));
    }
    addPlayer(player, onComplete) {
        var _refPlayer = this.refPlayers.push(player.getJSEntity(), onComplete);
        player.setRef(_refPlayer);
    }
    getFirstQueuingPlayer() {
        var firstPlayerQueue = null;
        this.snapshot.forEach(function(snapshot) {
            var v = snapshot.val();
            if (v.state === 'queue') {
                firstPlayerQueue = snapshot;
                return true;
            }
        });

        return firstPlayerQueue;
    }
}