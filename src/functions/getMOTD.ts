import { ArgType, NativeFunction } from "@tryforge/forgescript";
const mcs = require('node-mcstatus');

interface MotdResult {
    motd: {
        clean: string;
        raw: string;
    };
}

export default new NativeFunction({
    name: '$getMotd',
    description: 'Get the Message of the Day (MOTD) from a Minecraft server in clean or raw format',
    version: '1.1.0',
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
            description: 'Display Java Options',
            type: ArgType.Boolean,
            required: true,
            rest: false
        },
        {
            name: 'format',
            description: 'Choose between "clean" or "raw" MOTD format',
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [host, port, options, format]) {
        try {
            const result: MotdResult = await mcs.statusJava(host, port, options);

            // Validate and extract the MOTD based on the format argument
            if (typeof result.motd === 'object') {
                let motdOutput: string;

                if (format === 'clean' && typeof result.motd.clean === 'string' && result.motd.clean.length > 0) {
                    motdOutput = result.motd.clean;
                    console.log(`Message of the Day (clean): ${motdOutput}`);
                } else if (format === 'raw' && typeof result.motd.raw === 'string' && result.motd.raw.length > 0) {
                    motdOutput = result.motd.raw;
                    console.log(`Message of the Day (raw): ${motdOutput}`);
                } else {
                    console.log("Invalid MOTD format or not available.");
                    return this.customError("Invalid or unavailable MOTD format");
                }

                // Return the MOTD in the requested format as JSON
                return this.success(JSON.stringify({ motd: motdOutput }, null, 2));
            } else {
                console.log("MOTD object is invalid or missing.");
                return this.customError("MOTD not found");
            }
        } catch (error) {
            console.error("Error fetching MOTD:", error);
            return this.customError("Failed to fetch MOTD");
        }
    }
});
