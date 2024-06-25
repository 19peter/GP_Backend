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

///Server => "HasArrived" => Provider
///Server --> Change ProviderState to available
///-----------------------------------------------------------------------------------///

//----------SentPickUpRequest Functionality
///Consumer => ("SentPickUpRequest", {consumerId, providerId - targetId- , consumerLocation, targetLocation}) => Server => ("IncomingPickUpRequest" + data) => Provider
///{
///Provider => ("PickUpTracking", {providerId, consumerId, providerLiveLocation, targetLocation "consumer"}) => Server => ("Tracking", providerLiveLocation) => Consumer
///Provider => ("PickUpTracking", {providerId, consumerId, providerLiveLocation, targetLocation }) => Server => ("Tracking", providerLiveLocation) => Consumer
///Provider => ("PickUpTracking", {providerId, consumerId, providerLiveLocation, targetLocation }) => Server => ("Tracking", providerLiveLocation) => Consumer
///}
/// Server => ("StartPickup", {TargetLocation} ) => Provider
///{
///Provider => ("PickUpTracking", {providerId, consumerId, providerLiveLocation, targetLocation "destination"}) => Server
///Provider => ("PickUpTracking", {providerId, consumerId, providerLiveLocation, targetLocation}) => Server
///Provider => ("PickUpTracking", {providerId, consumerId, providerLiveLocation, targetLocation}) => Server
///}
///Server => ("PickUpFinished") => Provider
///Server --> Change ProviderState to available
///-----------------------------------------------------------------------------------///

module.exports = () => {
  const io = require("../../socketServer");

  io.on("connection", (socket) => {
    const ConsumerIdMap = require("../ConnectedUsers/connectedConsumers");
    const ProviderIdMap = require("../ConnectedUsers/connectedProviders");
    const ConsumerNearByProviderIdMap = require("../ConnectedUsers/consumerNearByMap");
    // let consumerRequests = new Map();
    console.log("a7 7aga");
    socket.on("connected", ({ id, type }) => {
      if (!id || !type) {
        console.error("Connected: Missing id or type");
        socket.emit("error", {
          message: "Connection failed: Missing id or type",
        });
        return;
      }

      if (type === "consumer") {
        ConsumerIdMap.setCurrentAndSocket(id, socket);
        console.log("consumer " + id + " connected to socket");
      } else if (type === "provider") {
        ProviderIdMap.setCurrentAndSocket(id, socket, true);
        console.log("provider " + id + " connected to socket");
      } else {
        console.error("Invalid type");
        socket.emit("error", { message: "Connection failed: Invalid type" });
      }

      socket.emit("notification", { message: "welcome" });
    });

    socket.on("GetNearBy", ({ userId: consumerId }) => {
      if (!consumerId) {
        console.error("GetNearBy: Missing consumerId");
        socket.emit("error", {
          message: "GetNearBy failed: Missing consumerId",
        });
        return;
      }
      try {
        ConsumerNearByProviderIdMap.deleteConsumer(consumerId);

        let idMap = Object.values(ProviderIdMap)[0];
        let availableProvidersArray = [];
        idMap.forEach((socket, providerId) => {
          if (socket.isAvailable) {
            availableProvidersArray.push({ providerId, socket });
          }
        });

        let availableProvidersLength = availableProvidersArray.length;
        availableProvidersArray.forEach((provider) => {
          let providerId = provider.providerId;
          provider.socket.emit("GetLocation", {
            consumerId,
            providerId,
            availableProvidersLength,
          });
        });
      } catch (error) {
        console.error("Error in GetNearBy:", error);
        socket.emit("error", { message: "GetNearBy failed: " + error.message });
      }
    });

    socket.on(
      "Location",
      ({ consumerId, providerId, availableProvidersLength, location }) => {
        if (!consumerId || !providerId || !location) {
          console.error("Location: Missing required fields");
          socket.emit("error", {
            message: "Location failed: Missing required fields",
          });
          return;
        }

        try {
          let dto = { providerId, location };
          ConsumerNearByProviderIdMap.setProvidersArrayForConsumer(
            consumerId,
            dto
          );
          let providersLengthForConsumer =
            ConsumerNearByProviderIdMap.getProvidersLengthForConsumer(
              consumerId
            );
          if (+availableProvidersLength === +providersLengthForConsumer) {
            let consumerSocket = ConsumerIdMap.getSocketInfo(consumerId);
            if (consumerSocket) {
              consumerSocket.emit(
                "SentAvailable",
                ConsumerNearByProviderIdMap.getProvidersForConsumer(consumerId)
              );
            }
          }
        } catch (error) {
          console.error("Error in Location:", error);
          socket.emit("error", {
            message: "Location processing failed: " + error.message,
          });
        }
      }
    );

    socket.on(
      "SentRequest",
      ({
        userId: consumerId,
        targetId: providerId,
        location: consumerLocation,
        distance,
      }) => {
        if (!consumerId || !providerId || !consumerLocation || !distance) {
          console.error("SentRequest: Missing required fields");
          socket.emit("error", {
            message: "SentRequest failed: Missing required fields",
          });
          return;
        }

        try {
          const providerSocket = ProviderIdMap.getSocketInfo(providerId);
          if (providerSocket) {
            providerSocket.emit("IncomingRequest", {
              requestMessage: "Allow Request ?",
              consumerLocation,
              consumerId,
              distance,
            });
            console.log(consumerId + " requested " + providerId);
          } else {
            console.error("Provider not found");
            socket.emit("error", {
              message: "SentRequest failed: Provider not found",
            });
          }
        } catch (error) {
          console.error("Error in SentRequest:", error);
          socket.emit("error", {
            message: "SentRequest failed: " + error.message,
          });
        }
      }
    );

    socket.on(
      "SentPickUpRequest",
      ({
        userId: consumerId,
        targetId: providerId,
        location: consumerLocation,
        distance,
        targetLocation,
      }) => {
        if (
          !consumerId ||
          !providerId ||
          !consumerLocation ||
          !distance ||
          targetLocation
        ) {
          console.error("SentRequest: Missing required fields");
          socket.emit("error", {
            message: "SentRequest failed: Missing required fields",
          });
          return;
        }

        try {
          const providerSocket = ProviderIdMap.getSocketInfo(providerId);
          if (providerSocket) {
            providerSocket.emit("IncomingPickUpRequest", {
              requestMessage: "Allow Request ?",
              consumerLocation,
              consumerId,
              distance,
              targetLocation,
            });
            console.log(consumerId + " pickup requested " + providerId);
          } else {
            console.error("Provider not found");
            socket.emit("error", {
              message: "SentPickUpRequest failed: Provider not found",
            });
          }
        } catch (error) {
          console.error("Error in SentPickUpRequest:", error);
          socket.emit("error", {
            message: "SentPickUpRequest failed: " + error.message,
          });
        }
      }
    );

    socket.on("RequestAccepted", ({ consumerId, userId: providerId }) => {
      if (!consumerId || !providerId) {
        console.error("RequestAccepted: Missing required fields");
        socket.emit("error", {
          message: "RequestAccepted failed: Missing required fields",
        });
        return;
      }

      try {
        ConsumerNearByProviderIdMap.deleteConsumer(consumerId);
        ProviderIdMap.setProviderAvailabilityState(providerId, false);
      } catch (error) {
        console.error("Error in RequestAccepted:", error);
        socket.emit("error", {
          message: "Request acceptance failed: " + error.message,
        });
      }
    });

    socket.on(
      "PickUpTracking",
      ({
        userId: providerId,
        targetId: consumerId,
        providerLiveLocation,
        targetLocation,
        startPickUp,
      }) => {
        if (
          !providerId ||
          !consumerId ||
          !providerLiveLocation ||
          !targetLocation
        ) {
          console.error("PickUpTracking: Missing required fields");
          socket.emit("error", {
            message: "PickUpTracking failed: Missing required fields",
          });
          return;
        }

        try {
          if (
            providerLiveLocation.latitude === targetLocation.latitude &&
            providerLiveLocation.longitude === targetLocation.longitude
          ) {
            const providerSocket = ProviderIdMap.getSocketInfo(providerId);
            if (providerSocket) {
              if (!startPickUp) {
                providerSocket.emit("StartPickUp");
              } else {
                providerSocket.emit("PickUpFinished");
                ProviderIdMap.setProviderAvailabilityState(providerId, true);
              }
            }
          }
        } catch (e) {
          console.error("Error in PickUpTracking:", error);
          socket.emit("error", {
            message: "PickUpTracking failed: " + error.message,
          });
        }
      }
    );

    socket.on(
      "Tracked",
      ({
        userId: providerId,
        targetId: consumerId,
        location,
        targetLocation,
      }) => {
        if (!providerId || !consumerId || !location || !targetLocation) {
          console.error("Tracked: Missing required fields");
          socket.emit("error", {
            message: "Tracking failed: Missing required fields",
          });
          return;
        }

        try {
          console.log(
            "current location " +
              location +
              " target location " +
              targetLocation
          );
          const providerSocket = ProviderIdMap.getSocketInfo(providerId);
          const consumerSocket = ConsumerIdMap.getSocketInfo(consumerId);

          if (
            +location.latitude === +targetLocation.latitude &&
            +location.longitude === +targetLocation.longitude
          ) {
            if (providerSocket) {
              providerSocket.emit("HasArrived");
              ProviderIdMap.setProviderAvailabilityState(providerId, true);
              console.log(providerId + " has arrived to " + consumerId);
            } else {
              console.log("Provider Socket Not Present");
            }

            if (consumerSocket) {
              consumerSocket.emit("notification", {
                message: `${providerId} has arrived`,
              });
            } else {
              console.log("Consumer Socket Not Present");
            }
          } else {
            if (consumerSocket) {
              consumerSocket.emit("Tracking", { trackingMessage: location });
              console.log(consumerId + " is tracking " + providerId);
            } else {
              console.log("Consumer Socket Not Present");
            }
          }
        } catch (error) {
          console.error("Error in Tracked:", error);
          socket.emit("error", {
            message: "Tracking failed: " + error.message,
          });
        }
      }
    );

    socket.on(
      "PickUpProviderArrived",
      ({ userId: consumerId, targetId: providerId, targetLocation }) => {
        if (!providerId) {
          console.error("PickUpProviderArrived: Missing required fields");
          socket.emit("error", {
            message: "SentRequest failed: Missing required fields",
          });
          return;
        }
        try {
          const providerSocket = ProviderIdMap.getSocketInfo(providerId);
          if (providerSocket) {
            providerSocket.emit("StartPickUp", { consumerId, targetLocation });
            console.log(consumerId + " StartPickUp " + providerId);
          } else {
            console.error("Provider not found");
            socket.emit("error", {
              message: "PickUpProviderArrived failed: Provider not found",
            });
          }
        } catch (error) {
          console.error("Error in PickUpProviderArrived:", error);
          socket.emit("error", {
            message: "PickUpProviderArrived failed: " + error.message,
          });
        }
      }
    );

    socket.on("error", ({ message }) => {
      console.log("An Error Occured");
    });

    socket.on("disconnected", ({ id, type }) => {
      // if (!id || !type) {
      //     console.error('Connected: Missing id or type');
      //     socket.emit('error', { message: 'Connection failed: Missing id or type' });
      //     return;
      // }
      try {
        if (type === "consumer") {
          ConsumerIdMap.deleteConsumer(id);
          ConsumerNearByProviderIdMap.deleteConsumer(id);
          console.log("consumer " + id + " disconnected");
        } else if (type === "provider") {
          ProviderIdMap.deleteProvider(id);
          console.log("provider " + id + " disconnected");
        } else {
          console.error("Invalid type");
          socket.emit("error", { message: "Connection failed: Invalid type" });
        }
        console.log("Socket disconnected");
      } catch (error) {
        console.error("Error on disconnect:", error);
      }
    });
  });
};

// socket.on("arrived", ({ userId, targetId, location }) => {
//     const socketInfo = IdMap.getSocketInfo(targetId);
//     if (socketInfo) {
//         const socket = socketInfo.socket;
//         socket.emit("arrived")
//         console.log(userId + " arrived to " + targetId);
//     }

// })
