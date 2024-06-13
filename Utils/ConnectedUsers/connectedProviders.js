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



    setCurrentAndSocket(id, socketInfo, availabilityState) {
        let obj = {...socketInfo, isAvailable : availabilityState};
        Object.assign(socketInfo, obj);
        // socketInfo.isAvailable = availabilityState;
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
        this.setCurrentAndSocket(id, socket, availabilityState);
    }

    deleteProvider(id) {
        this.idMap.delete(id);
    }


}

const idMapInstance = new IdMap();
Object.freeze(idMapInstance);

module.exports = idMapInstance; 