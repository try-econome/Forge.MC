import { ArgType, NativeFunction } from "@tryforge/forgescript";
const mcs = require('node-mcstatus');

interface SoftwareResult {
    software: string | null;
}

export default new NativeFunction({
    name: '$getSoftware',
    description: 'Get the Minecraft server software name or check if it is null',
    version: '1.1.5',
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
        }
    ],
    async execute(ctx, [host, port, options]) {
        try {
            const result: SoftwareResult = await mcs.statusJava(host, port, options);

            if (typeof result.software === 'string' || result.software === null) {
                if (result.software !== null && result.software.length > 0) {
                    console.log(`Software: ${result.software}`);
                } else {
                    console.log("Software is null or not provided.");
                }

                // Return the software value or null
                return this.success(result.software ? result.software : 'null');
            } else {
                console.log("Invalid software format.");
                return this.customError("Invalid software format");
            }
        } catch (error) {
            console.error("Error fetching software:", error);
            return this.customError("Failed to fetch software");
        }
    }
});
