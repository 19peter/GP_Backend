
let testingResponse = (req, res, next) => {
    // const io = require('../socketServer');

    // io.emit("notification", { message: "test notification" })
    // console.log(io);
    return res.json({ response: "test response" });
}

let testingPost = (req, res, next) => {
    const io = require('../socketServer');
    const IdMap = require('../Utils/ConnectedUsers/connectedConsumers');

    let data = req.body;
    let { targetId } = data;

    let targetSocket = IdMap.getSocketInfo(targetId).socket;
    targetSocket.emit("notification", { message: "data posted notification" })

    // console.log(socketId);



    return res.json({ response: "test post data" });

}



module.exports = {
    testingResponse,
    testingPost
}