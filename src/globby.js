function newGame(properties) {

    this.state = JSONfn.parse(JSONfn.stringify(properties.baseState));
    this.state.playersConfigArray = this.players;
    this.players = [];
    this.disconnected = [];
    this.roomData  = {};

    this.move = (socketId, move) => {
        let player = this.state.playersConfigArray.find((pl) => {
            return pl.socketId == socketId
        })

        properties.moveFunction(player, move, this.state)
    }

    this.timeFunction = () => {

        if (timeFunction != undefined) {
            properties.timeFunction(this.state)
        }
    }

    this.returnState = (socketId) => {

        let copyState = JSONfn.parse(JSONfn.stringify(this.state));
        const player = this.state.playersConfigArray.find((pl) => {
            return pl.socketId == socketId
        })
        if (player) {
            copyState = properties.this.statePresenter(copyState, player.ref)
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
        this.state.playersConfigArray = this.players;

        properties.connectFunction(this.state, player.ref,this.roomData)

    }

    this.exit = (socketId) => {
        let pl = this.players.find((pl) => {
            return pl.socketId == socketId;
        })
        if (!pl) {
            return;
        }
        this.players.splice(this.players.indexOf(pl), 1);
        properties.exitFunction(this.state,pl.ref)
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
            properties.exitFunction(this.state,pl.ref)
        }   
        else{
            properties.disconnectFunction(this.state, pl.ref)
        }
    }
}