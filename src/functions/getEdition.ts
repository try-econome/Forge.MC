import { ArgType, NativeFunction } from "@tryforge/forgescript";
const mcs = require('node-mcstatus');

interface VersionResult {
    version: {
        name_clean: string;
        name_raw: string;
        protocol: number;
    };
}

export default new NativeFunction({
    name: '$getVersion',
    description: 'Get the Minecraft server version in clean or raw format, along with protocol number',
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
        },
        {
            name: 'format',
            description: 'Choose between "clean" or "raw" version format',
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [host, port, options, format]) {
        try {
            const result: VersionResult = await mcs.statusJava(host, port, options);

            if (result.version !== null) {
                let versionOutput: string;

                // Validate and output the version based on the format argument
                if (format === 'clean' && typeof result.version.name_clean === 'string' && result.version.name_clean.length > 0) {
                    versionOutput = result.version.name_clean;
                    console.log(`Version (clean): ${versionOutput}`);
                } else if (format === 'raw' && typeof result.version.name_raw === 'string' && result.version.name_raw.length > 0) {
                    versionOutput = result.version.name_raw;
                    console.log(`Version (raw): ${versionOutput}`);
                } else {
                    console.log("Invalid version format or not available.");
                    return this.customError("Invalid or unavailable version format");
                }

                // Validate the protocol
                const protocol = result.version.protocol;
                if (typeof protocol === 'number' && Number.isInteger(protocol)) {
                    console.log(`Protocol: ${protocol}`);
                } else {
                    console.log("Protocol is invalid or missing.");
                    return this.customError("Invalid protocol");
                }

                // Return the version and protocol as JSON
                return this.success(JSON.stringify({ version: versionOutput, protocol: protocol }, null, 2));
            } else {
                console.log("Version object is null.");
                return this.customError("Version not found");
            }
        } catch (error) {
            console.error("Error fetching version:", error);
            return this.customError("Failed to fetch version");
        }
    }
});
