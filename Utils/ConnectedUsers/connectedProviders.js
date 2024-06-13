class IdMap {

    ////MAP HAS KEY VALUE PAIR: 
    /// { 
    /// KEY: USER ID FROM DB,
    /// VALUE: {socket, isAvailable}
    /// }


    constructor() {
        if (!IdMap.instance) {
            this.idMap = new Map();
            IdMap.instance = this;
        }
        return IdMap.instance;
    }

    

    setCurrentAndSocket(id, socketInfo) {
        this.idMap.set(id, socketInfo);
    }

    setCurrentId(id) {
        this.idMap.set(id, null);
    }

    getSocketInfo(id) {
        return this.idMap.get(id);
    }

    setProviderAvailabilityState(id, availabilityState) {
        let socket = this.idMap.get(id);
        socket.isAvailable = availabilityState;
        this.idMap.set(id, socket);
    }

    
}

const idMapInstance = new IdMap();
Object.freeze(idMapInstance);

module.exports = idMapInstance; 