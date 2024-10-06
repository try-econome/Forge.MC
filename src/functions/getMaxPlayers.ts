import { ArgType, NativeFunction } from "@tryforge/forgescript";
const mcs = require('node-mcstatus');

interface PlayerResult {
    players: {
        online: number;
        max: number; // Add max property to the interface
    };
}

export default new NativeFunction({
    name: '$getMaxPlayers',
    description: 'Get the maximum number of players allowed on a Minecraft server',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'host',
            description: 'Host Domain',
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: 'port',
            description: 'The Host Port',
            type: ArgType.Number,
            required: true,
            rest: false
        },
        {
            name: 'options',
            description: 'display Java Options',
            type: ArgType.Boolean,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [host, port, options]) {
        try {
            const result: PlayerResult = await mcs.statusJava(host, port, options);

            // Extract and log the max player count
            const maxPlayers = result.players.max;

            // Validate and print the maximum number of players allowed
            if (typeof maxPlayers === 'number' && maxPlayers >= 0 && Number.isInteger(maxPlayers)) {
                console.log(`The maximum number of players allowed is ${maxPlayers}.`);
            } else {
                console.log("Maximum player count is incorrect or invalid.");
            }

            // Return the maximum player count in the success response
            return this.success(maxPlayers);
        } catch (error) {
            console.error("Error fetching maximum player count:", error);
            return this.customError("Failed to fetch maximum player count");
        }
    }
});
