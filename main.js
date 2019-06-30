var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

var role_body_parts = {
    'harvester': [WORK,CARRY,MOVE],
    'upgrader': [WORK,CARRY,MOVE]
}

var ensure_creep_numbers = function (role, min) {
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    console.log('Number of ' + role + ' creeps: ' + creeps.length);
    if(creeps.length < min) {
        var name = role + '_' + Game.time;
        console.log('Spawning new ' + role + ': ' + name);
        Game.spawns['Spawn1'].spawnCreep(role_body_parts[role],
            name,
            {memory: {role: 'upgrader'}});
    }
}

module.exports.loop = function () {

    for(var creepName in Memory.creeps) {
        if(!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
            console.log('Deleting non-existing creep memory: ', creepName);
        }
    }

    ensure_creep_numbers('harvester', 2)
    ensure_creep_numbers('upgrader', 1)

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            'Spawning: ' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
