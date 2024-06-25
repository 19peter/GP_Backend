const moment = require("moment");
const AnalysisModel = require("../Models/AnalysisModel")

let insertData = async (req, res)=>{
    try {
        console.log(req.body);
        const { providerId, providerName, serviceName } = req.body;

        // Find and update the provider with the given providerId
        let updatedAnalysis = await AnalysisModel.findOneAndUpdate(
            { 'providers.providerId': providerId },
            { $inc: { 'providers.$.numberOfRequests': 1 } }, // Increment numberOfRequests by 1 if found
            { new: true } // Return the updated document
        );

        if (!updatedAnalysis) {
            // If providerId not found, add a new provider
            const newProvider = {
                name: providerName,
                providerId: providerId,
                numberOfRequests: 1 // Initial numberOfRequests set to 1
            };

            // Add the new provider to the providers array
            updatedAnalysis = await AnalysisModel.findOneAndUpdate(
                {},
                { $push: { providers: newProvider } },
                { new: true, upsert: true } // Create if not exists
            );
        }

        // Find and update the service with the given serviceName
        const foundService = updatedAnalysis.services.find(service => service.name === serviceName);

        if (foundService) {
            // If service found, increment numberOfRequests by 1
            updatedAnalysis = await AnalysisModel.findOneAndUpdate(
                { 'services.name': serviceName },
                { 
                    $inc: { 'services.$.numberOfRequests': 1 },
                    $push: { 'servicesWithDates': { requestDate: new Date() } } // Add current date
                },
                { new: true }
            );
        } else {
            // If service not found, add a new service
            const newService = {
                name: serviceName,
                numberOfRequests: 1 // Initial numberOfRequests set to 1
            };

            // Add the new service to the services array
            updatedAnalysis = await AnalysisModel.findOneAndUpdate(
                {},
                { 
                    $push: { 
                        services: newService,
                        servicesWithDates: { requestDate:new Date() } // Add current date
                    } 
                },
                { new: true, upsert: true } // Create if not exists
            );
        }

        return res.status(200).json(updatedAnalysis); // Return updated or newly added document
    } catch (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ error: 'Internal server error' }); // Handle server errors
    }
}

let getAnalysisData = async(req,res)=>{
    let data  = await AnalysisModel.find();
    return res.json(data[0]).status(200)
}

module.exports = {
    insertData,
    getAnalysisData
}