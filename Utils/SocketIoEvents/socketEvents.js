/////EMITTED EVENTS BY PROVIDER: "Tracked", "HasArrived"
/////EMITTED EVENTS BY CONSUMER: "SentRequest", ""
/////EMITTED EVENTS BY SERVER: "IncomingRequest" (to Provider), "Tracking" (to Consumer) 


///------------------------------Equivalent Events-------------------------------///

///Tracking (Consumer) : Tracked (Provider)
///SentRequest (Consumer) : IncomingRequest (Provider)
///ProviderArrived (Consumer) : HasArrived (Provider)

///------------------------------------------------------------------------------///

///------------------------------------EVENTS FLOW------------------------------------///

//----------GetNearBy Functionality

///Consumer => ("GetNearBy") => Server => "GetLocation", { consumerId, providerId, availableProvidersLength } => Available Provider
///Available Provider => "Location" => Server => "SentAvailable" => Consumer


//----------SendRequest Functionality

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
        let consumerRequests = new Map();

        socket.on('connected', ({ id, type }) => {
            if (type === 'consumer') {
                ConsumerIdMap.setCurrentAndSocket(id, socket)
                console.log("consumer connected to socket ");
                // console.log(ConsumerIdMap);

            } else if (type === 'provider') {
                ProviderIdMap.setCurrentAndSocket(id, socket, true)
                ProviderIdMap.setProviderAvailabilityState(id, true)
                console.log("provider connected to socket ");
                // console.log(ProviderIdMap);

            }
        })

        socket.on("GetNearBy", ({ userId: consumerId }) => {

            ConsumerNearByProviderIdMap.deleteConsumer(consumerId);

            let idMap = Object.values(ProviderIdMap)[0];
            let availableProvidersArray = [];
            idMap.forEach((socket, providerId) => {
                if (socket.isAvailable) {
                    availableProvidersArray.push({ providerId, socket });
                }
            });

            let availableProvidersLength = availableProvidersArray.length;
            availableProvidersArray.forEach(provider => {
                let providerId = provider.providerId;
                provider.socket.emit("GetLocation", { consumerId, providerId, availableProvidersLength });
            })
        })

        //Provider 1
        //Provider 2
        socket.on("Location", ({ consumerId, providerId, availableProvidersLength, location }) => {
            let dto = { providerId, location };
            ConsumerNearByProviderIdMap.setProvidersArrayForConsumer(consumerId, dto);
            let providersLengthForConsumer = ConsumerNearByProviderIdMap.getProvidersLengthForConsumer(consumerId);
            console.log(providersLengthForConsumer);
            if (+availableProvidersLength === +providersLengthForConsumer) {

                let consumerSocket = ConsumerIdMap.getSocketInfo(consumerId);
                consumerSocket.emit("SentAvailable", ConsumerNearByProviderIdMap.getProvidersForConsumer(consumerId));

            }

        })

        socket.on("SentRequest", ({ userId: consumerId, targetId: providerId, consumerLocation }) => {
            const providerSocket = ProviderIdMap.getSocketInfo(targetId);
            if (providerSocket) {
                providerSocket.emit("IncomingRequest", { requestMessage: "Allow Request ?", consumerLocation, consumerId })
                console.log(consumerId + " requested " + providerId);
            }
        })

        socket.on("RequestAccepted", ({ consumerId, userId: providerId }) => {
            ConsumerNearByProviderIdMap.deleteConsumer(consumerId);
            ProviderIdMap.setProviderAvailabilityState(providerId, false);
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