import { ArgType, NativeFunction } from "@tryforge/forgescript";
const mcs = require('node-mcstatus');

interface PlayerResult {
    players: {
        online: number;
    };
}

export default new NativeFunction({
    name: '$getPlayerCount',
    description: 'Get the number of online players on a Minecraft server',
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

            // Extract and log the player count
            const playerCount = result.players.online;

            // Validate and print the number of players online
            if (typeof playerCount === 'number' && playerCount >= 0 && Number.isInteger(playerCount)) {
                console.log(`There are currently ${playerCount} players online.`);
            } else {
                console.log("Player count is incorrect or invalid.");
            }

            // Return the player count in the success response
            return this.success(playerCount);
        } catch (error) {
            console.error("Error fetching player count:", error);
            return this.customError("Failed to fetch player count");
        }
    }
});
