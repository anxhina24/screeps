const roleBuilder = {
    run: function (creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say('🚧 build');
        }

        if (creep.memory.working) {
            const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (constructionSite) {
                if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // If no construction site, repair damaged structures
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) =>
                        structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
                });

                if (targets.length > 0) {
                    targets.forEach((target) => {
                        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                        }
                    });
                } else {
                    // If no construction site or repair targets, fallback to upgrading the controller
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

export default roleBuilder;
