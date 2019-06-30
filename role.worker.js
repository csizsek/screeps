function harvest(creep) {
    if((creep.carry.energy == 0) || (creep.memory.action == 'harvest' && creep.carry.energy < creep.carryCapacity)) {
        creep.memory.action = 'harvest'
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    } else {
        if (creep.memory.action == 'harvest') {
            creep.memory.action = 'store'
            creep.say('store');
        }
    }
}

function store(creep) {
    if (creep.memory.action == 'store') {
        if (creep.carry.energy == 0) {
            creep.memory.action = 'harvest';
            return;
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;}
            });
            if(targets.length) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.action = 'build'
                creep.say('build');
            }
        }
    }
}

function build(creep) {
    if (creep.memory.action == 'build') {
        if (creep.carry.energy == 0) {
            creep.memory.action = 'harvest';
            creep.say('harvest');
            return;
        } else {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.action = 'upgrade'
                creep.say('upgrade');
            }
        }
    }
}

function upgrade(creep) {
    if (creep.memory.action == 'upgrade') {
        if (creep.carry.energy == 0) {
            creep.memory.action = 'harvest'
            creep.say('harvest');
            return
        } else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}

var roleWorker = {
    run: function(creep) {
        harvest(creep)
        store(creep)
        build(creep)
        upgrade(creep)
    }
};

module.exports = roleWorker;
