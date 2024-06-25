class IdMap {

    ////MAP HAS KEY VALUE PAIR: 
    /// { 
    /// KEY: USER ID FROM DB,
    /// VALUE: [{providerId, location}]
    /// }


    constructor() {
        if (!IdMap.instance) {
            this.idMap = new Map();
            IdMap.instance = this;
        }
        return IdMap.instance;
    }


    ///socketInf = {providerId, location}
    setProvidersArrayForConsumer(id, socketInfo) {

        let providersArray = this.getProvidersForConsumer(id) || [];
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

    setConsumer(id) {
        this.idMap.set(id, null);
    }

    getProvidersForConsumer(id) {
        return this.idMap.get(id);
    }

    getMapLength() {
        return this.idMap.size;
    }

    getProvidersLengthForConsumer(id) {
        return this.getProvidersForConsumer(id).length;
    }

    removeProviderFromConsumers(id) {
        for (let consumerId in this.idMap) {
            this.idMap[consumerId] = this.idMap.filter(obj => obj.providerId !== id) 
        }
    }

    deleteConsumer(id) {
        this.idMap.delete(id);
    }
}

const idMapInstance = new IdMap();
Object.freeze(idMapInstance);

module.exports = idMapInstance; 