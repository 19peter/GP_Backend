module.exports = () => {
    const io = require('../../socketServer');

    io.on('connection', (socket) => {
        const IdMap = require('../ConnectedUsers/connectedUsers');

        // console.log(IdMap);

        socket.on('connected', ({ id }) => {
            let socketId = socket.id;
            IdMap.setCurrentAndSocket(id, { socketId, socket })
            console.log("connected to socket ");
            console.log(IdMap);
        })

        socket.on("request", ({ userId, targetId }) => {
            const socketInfo = IdMap.getSocketInfo(targetId);
            if (socketInfo) {
                const targetSocket = socketInfo.socket;
                targetSocket.emit("request", { requestMessage: "Allow Request ?" })

                console.log(userId + " requested " + targetId);
            }
        })

        socket.on("tracking", ({ userId : providerId , targetId : consumerId, location, targetLocation }) => {
            console.log("current location " + location + " target location " + targetLocation);

            if (+location === +targetLocation) {
                const providerSocketInfo = IdMap.getSocketInfo(providerId);

                if (providerSocketInfo) {
                    const providerSocket = providerSocketInfo.socket;
                    providerSocket.emit("arrived");
                    console.log(providerId + " has arrived to " + consumerId);
                }

            } else {
                const consumerSocketInfo = IdMap.getSocketInfo(consumerId);

                if (consumerSocketInfo) {
                    const consumerSocket = consumerSocketInfo.socket;
                    consumerSocket.emit("tracking", { trackingMessage: location })
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