"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
class ReLooted {
    logger;
    db;
    cfgServer;
    locConfig;
    lootConfig;
    //Config
    config = require("../config/config.json");
    postDBLoad(container) {
        // Get stuff from the server container.
        this.logger = container.resolve("WinstonLogger");
        // Get database from server.
        this.db = container.resolve("DatabaseServer");
        this.cfgServer = container.resolve("ConfigServer");
        this.locConfig = this.cfgServer.getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
        this.lootConfig = this.cfgServer.getConfig(ConfigTypes_1.ConfigTypes.LOOT);
        const mapNames = [
            "bigmap",
            "factory4_day",
            "factory4_night",
            "interchange",
            "laboratory",
            "lighthouse",
            "rezervbase",
            "woods"
        ];
        let locations = this.db.getTables().locations;
        this.logger.info("[ReLooted] Starting! Greetings from Leaves!");
        this.logger.info("[ReLooted] FYI: This mod should be loaded as early as possible to maximize compatibility.");
        if (this.config.unfuckGivingTreeKeycardSpawns) {
            this.logger.info("[ReLooted] Fixing Giving Tree Keyspawn chances");
            for (let point of this.lootConfig.looseLoot["bigmap"]) {
                if (point.template.Id == "Loot 19 (9)3856272" || point.template.Id == "Loot 19 (8)3860542") {
                    point.probability = this.config.givingTreeKeySpawnChance;
                }
            }
        }
        for (let map of mapNames) {
            this.logger.info("[ReLooted] loading data for: " + map);
            const newData = require("../assets/" + map);
            this.logger.info("[ReLooted] Injecting new data for " + map);
            locations[map].looseLoot.spawnpoints = newData.spawnpoints;
            if (this.config.changeSpawnPointCount) {
                locations[map].looseLoot.spawnpointCount = newData.spawnpointCount;
            }
        }
        if (this.config.setLootMultipliersToZero) {
            this.logger.info("[ReLooted] Setting looseLootMultiplier for all locations to 1.");
            this.logger.info("[ReLooted] Keep in mind that mods like SVM might override this. ");
            for (let multi in this.locConfig.looseLootMultiplier) {
                this.locConfig.looseLootMultiplier[multi] = 1;
            }
        }
    }
}
module.exports = { mod: new ReLooted() };
//# sourceMappingURL=mod.js.map