const checkSdkVersion = require("./lib/versionCheck");
const Highrise = require("./src/Client/Highrise");
const { OutfitItem } = require("./src/Models/HelperModel");
const HttpClient = require("./src/Networking/Core/HttpClient");
const EmotesManager = require("./src/Tools/EmotesManager");
const Logger = require("./src/Tools/Logger");
const Validator = require("./src/Tools/Validator");

(async() => {
    await checkSdkVersion()
})()

exports.Highrise = Highrise
exports.Validator = Validator
exports.Logger = Logger
exports.OutfitItem = OutfitItem
exports.HttpClient = HttpClient
exports.EmotesManager = EmotesManager