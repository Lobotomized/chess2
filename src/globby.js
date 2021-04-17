function newGame(properties) {

    let state = JSON.parse(JSON.stringify(properties.baseState));
    state.playersConfigArray = this.players;
    this.players = [];
    this.disconnected = [];
    this.roomData  = {};

    this.move = (socketId, move) => {
        let player = state.playersConfigArray.find((pl) => {
            return pl.socketId == socketId
        })

        properties.moveFunction(player, move, state)
    }

    this.timeFunction = () => {

        if (timeFunction != undefined) {
            properties.timeFunction(state)
        }
    }

    this.returnState = (socketId) => {

        let copyState = JSON.parse(JSON.stringify(state));
        const player = state.playersConfigArray.find((pl) => {
            return pl.socketId == socketId
        })
        if (player) {
            copyState = properties.statePresenter(copyState, player.ref)
        }
        return copyState
    }

    this.joinBot = (id) => {
        this.join('thisisabot' + id)
    }
    

    this.join = (socketId, playerId) => {
        const player = { socketId: socketId, ref: 'player' + (this.players.length + 1 + this.disconnected.length) }
        if (playerId) {
            player.hello = playerId;
            const existing = this.disconnected.find((pl) => {
                return pl.hello == player.hello
            })
            if (existing) {
                existing.socketId = socketId
                this.players.push(existing);
                this.disconnected.splice(this.disconnected.indexOf(existing), 1);
            }
            else {
                this.players.push(player)
            }
        }
        else {
            this.players.push(player);
        }
        state.playersConfigArray = this.players;

        properties.connectFunction(state, player.ref,this.roomData)

    }

    this.exit = (socketId) => {
        let pl = this.players.find((pl) => {
            return pl.socketId == socketId;
        })
        if (!pl) {
            return;
        }
        this.players.splice(this.players.indexOf(pl), 1);
        properties.exitFunction(state,pl.ref)
    }

    this.disconnect = (socketId,dontWrite) => {

        let pl = this.players.find((pl) => {
            return pl.socketId == socketId || (pl.hello != undefined && pl.hello == socketId);
        })
        if (!pl) {
            return;
        }
        if (!pl.hello) {
            if(!dontWrite){
                this.disconnected.push(this.players[this.players.indexOf(pl)])
            }
            this.players.splice(this.players.indexOf(pl), 1);
        }
        else {
            if(!dontWrite){
                this.disconnected.push(this.players[this.players.indexOf(pl)])
            }
            this.players.splice(this.players.indexOf(pl), 1);
        }
        if(dontWrite){
            properties.exitFunction(state,pl.ref)
        }   
        else{
            properties.disconnectFunction(state, pl.ref)
        }
    }
}