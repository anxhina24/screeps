const roleUpgrades = {
    run: function (creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.working) {
            // Use the tower to transfer energy to the controller
            const tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (tower) {
                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            } else {
                // Use the extensions to transfer energy to the controller
                const extensions = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                });
                if (extensions.length > 0) {
                    const target = creep.pos.findClosestByPath(extensions);
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    // No available tower or extensions, fallback to upgrading the controller
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        } else {
            if (creep.harvest(Game.getObjectById(creep.memory.sourceIndex)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.sourceIndex), { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },
};

export default roleUpgrades
