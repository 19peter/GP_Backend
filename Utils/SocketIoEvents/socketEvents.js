/////EMITTED EVENTS BY PROVIDER: "Tracked", "HasArrived"
/////EMITTED EVENTS BY CONSUMER: "SentRequest", ""
/////EMITTED EVENTS BY SERVER: "IncomingRequest" (to Provider), "Tracking" (to Consumer) 


///------------------------------Equivalent Events-------------------------------///

///Tracking (Consumer) : Tracked (Provider)
///SentRequest (Consumer) : IncomingRequest (Provider)
///ProviderArrived (Consumer) : HasArrived (Provider)

///------------------------------------------------------------------------------///

///------------------------------------EVENTS FLOW------------------------------------///
///Consumer => ("GetNearBy") => Server => ("AreYouAvailble") => Provider ? availble => Server ("", LiveLocation) => filter => Consumer 
///Consumer => ("SentRequest", {consumerId, providerId - targetId- , consumerLocation}) => Server => ("IncomingRequest", consumerLocation, consumerId) => Provider
///{
///Provider => ("Tracked", {providerId, consumerId, providerLiveLocation, consumerLocation}) => Server => ("Tracking", providerLiveLocation) => Consumer
///Provider => ("Tracked", {providerId, consumerId, providerLiveLocation, consumerLocation}) => Server => ("Tracking", providerLiveLocation) => Consumer
///Provider => ("Tracked", {providerId, consumerId, providerLiveLocation, consumerLocation}) => Server => ("Tracking", providerLiveLocation) => Consumer
///}
///Provider => "HasArrived" => Server => "ProviderArrived" => Consumer
///Provider => "HasArrived" => Server => "HasArrived" => Provider

///-----------------------------------------------------------------------------------///




/////
///// provider => ("Available", data) => Server
///// provider => ("Available", data) => Server
///// provider => ("Available", data) => Server
///// provider => ("Available", data) => Server
/////

module.exports = () => {
    const io = require('../../socketServer');

    io.on('connection', (socket) => {
        const ConsumerIdMap = require('../ConnectedUsers/connectedConsumers');
        const ProviderIdMap = require('../ConnectedUsers/connectedProviders');
        const ConsumerNearByProviderIdMap = require('../ConnectedUsers/consumerNearByMap');
        // console.log(IdMap);

        socket.on('connected', ({ id, type }) => {
            if (type === 'consumer') {
                ConsumerIdMap.setCurrentAndSocket(id, socket)
                console.log("consumer connected to socket ");
                // console.log(ConsumerIdMap);

            } else if (type === 'provider') {
                ProviderIdMap.setCurrentAndSocket(id, socket)
                console.log("provider connected to socket ");
                // console.log(ProviderIdMap);

            }
        })

        socket.on("GetNearBy", ({ userId: consumerId }) => {
            for (let map in ProviderIdMap) {
                ProviderIdMap[map].forEach(element => {
                    element.emit("AreYouAvailable", { consumerId });
                });
            }
        })

        //Provider 1
        //Provider 2
        socket.on("Available", ({ userId: providerId, location, consumerId }) => {

            let dto = { providerId, location };
            ConsumerNearByProviderIdMap.setCurrentAndSocket(consumerId, dto);

            let consumerSocket = ConsumerIdMap.getSocketInfo(consumerId);
            consumerSocket.emit("SentAvailable", ConsumerNearByProviderIdMap.getSocketInfo(consumerId));

        })

        socket.on("SentRequest", ({ userId, targetId, consumerLocation }) => {
            const targetSocket = ProviderIdMap.getSocketInfo(targetId);
            if (targetSocket) {
                targetSocket.emit("IncomingRequest", { requestMessage: "Allow Request ?", consumerLocation })
                console.log(userId + " requested " + targetId);
            }
        })

        socket.on("Tracked", ({ userId: providerId, targetId: consumerId, location, targetLocation }) => {
            console.log("current location " + location + " target location " + targetLocation);

            if (+location === +targetLocation) {
                const providerSocket = ProviderIdMap.getSocketInfo(providerId);

                if (providerSocket) {
                    providerSocket.emit("HasArrived");
                    console.log(providerId + " has arrived to " + consumerId);
                }

            } else {
                const consumerSocket = ConsumerIdMap.getSocketInfo(consumerId);

                if (consumerSocket) {

                    consumerSocket.emit("Tracking", { trackingMessage: location })
                    console.log(providerId + " is tracking " + consumerId);
                }
            }

        })

        // socket.on("arrived", ({ userId, targetId, location }) => {
        //     const socketInfo = IdMap.getSocketInfo(targetId);
        //     if (socketInfo) {
        //         const socket = socketInfo.socket;
        //         socket.emit("arrived")
        //         console.log(userId + " arrived to " + targetId);
        //     }

        // })

        socket.emit('notification', { message: "welcome" })

    })


}