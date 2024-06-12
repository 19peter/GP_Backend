class IdMap {

    ////MAP HAS KEY VALUE PAIR: 
    /// { 
    /// KEY: USER ID FROM DB,
    /// VALUE: [{providerId, socket}]
    /// }


    constructor() {
        if (!IdMap.instance) {
            this.idMap = new Map();
            IdMap.instance = this;
        }
        return IdMap.instance;
    }



    setCurrentAndSocket(id, socketInfo) {

        let providersArray = this.getSocketInfo(id) || [];
        let providerId = socketInfo.providerId;

        let doesIdExist = false;

        if (providersArray.length === 0) {
            providersArray.push(socketInfo);
            this.idMap.set(id, providersArray);
        } else {

            let n = 0;
            while (n < providersArray.length && !doesIdExist) {
                if (+providersArray[n].providerId === +providerId) {
                    doesIdExist = true;
                }
                n++;
            }

            if (!doesIdExist) {
                providersArray.push(socketInfo);
                this.idMap.set(id, providersArray);
            }
        }
    }

    setCurrentId(id) {
        this.idMap.set(id, null);
    }

    getSocketInfo(id) {
        return this.idMap.get(id);
    }

    getMap() {
        return this.idMap;
    }
}

const idMapInstance = new IdMap();
Object.freeze(idMapInstance);

module.exports = idMapInstance; 