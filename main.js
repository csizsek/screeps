var roleWorker = require('role.worker');

var body_parts = {
    'worker': [WORK,CARRY,MOVE]
};

var ensure_creep_numbers = function (role, min) {
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    console.log('Number of ' + role + ' creeps: ' + creeps.length);
    if(creeps.length < min) {
        var name = role + '_' + Game.time;
        console.log('Spawning new ' + role + ': ' + name);
        Game.spawns['Spawn1'].spawnCreep(body_parts[role],
            name,
            {memory: {role: role}});
    }
}

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Deleting non-existing creep memory: ', name);
        }
    }
    ensure_creep_numbers('worker', 2)
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
    }
}
