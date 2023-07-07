import {constants} from "./helper";
import roleHarvester from "./harveter";
import roleUpgrades from "./upgrader";
import roleBuilder from "./builder";

const active_sources = []
const sources = Game.rooms['sim'].find(FIND_SOURCES)
for (const source of sources) {
    //find sources with no source keeper
    const nearbyHostileStructures = source.pos.findInRange(FIND_HOSTILE_STRUCTURES, 5);
    if (nearbyHostileStructures.length === 0) {
        active_sources.push(source.id)
    }
}

module.exports.loop = function () {
    // Clear memory for died creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // create harvester creeps
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === constants.HARVESTER_ROLE);
    const harvestersIndices = harvesters.map((harvester) => harvester.memory.sourceIndex);
    let indexHarvester
    const newListHarvesters = active_sources.filter((element) => !harvestersIndices.includes(element));
    // add source index to each creeper.
    if(harvestersIndices.length){
        if(harvestersIndices.length < active_sources.length){
            indexHarvester = newListHarvesters[0]
        }
        else{
            indexHarvester = harvestersIndices[harvestersIndices.length - active_sources.length]
        }
    }
    else{
        indexHarvester = active_sources[0]
    }
    if (harvesters.length < constants.MAX_HARVESTERS) {
        const newName = 'Harvester' + Game.time;
        Game.spawns[constants.SPAWN_NAME].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: constants.HARVESTER_ROLE, sourceIndex: indexHarvester},
        });
    }


    // create upgrader creeps
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === constants.UPGRADER_ROLE);
    const upgradersIndices = upgraders.map((upgrader) => upgrader.memory.sourceIndex);
    const newListUpgraders = active_sources.filter((element) => !upgradersIndices.includes(element));
    let indexUpgrades
    if(upgradersIndices.length){
        if(upgradersIndices.length < active_sources.length){
            indexUpgrades = newListUpgraders[0]
        }
        else{
            indexUpgrades = upgradersIndices[upgradersIndices.length - active_sources.length]
        }
    }
    else{
        indexUpgrades = active_sources[0]
    }

    if (upgraders.length < constants.MAX_UPGRADERS && harvesters.length === constants.MAX_HARVESTERS) {
        const newName = 'Upgrader' + Game.time;
        Game.spawns[constants.SPAWN_NAME].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: constants.UPGRADER_ROLE, sourceIndex: indexUpgrades},
        });
    }

    //create builder creeps
    //number of builders is 3, same with the sources number. For this reason the logic of creep index is easier
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === constants.BUILDER_ROLE);
    const buildersIndices = builders.map((builder) => builder.memory.sourceIndex);
    const newListBuilders = active_sources.filter((element) => !buildersIndices.includes(element));
    if (builders.length < constants.MAX_BUILDERS && harvesters.length === constants.MAX_HARVESTERS) {
        const newName = 'Builder' + Game.time;
        Game.spawns[constants.SPAWN_NAME].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: constants.BUILDER_ROLE,  sourceIndex: buildersIndices.length ? newListBuilders[0] : active_sources[0] },
        });
    }

    // Check role for each creep
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === constants.HARVESTER_ROLE) {
            roleHarvester.run(creep);
        } else if (creep.memory.role === constants.UPGRADER_ROLE) {
            roleUpgrades.run(creep);
        } else if (creep.memory.role === constants.BUILDER_ROLE) {
            roleBuilder.run(creep);
        }
    }
};

