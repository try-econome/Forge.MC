import { ArgType, NativeFunction } from "@tryforge/forgescript";
import { AttachmentBuilder } from 'discord.js'; 
const mcs = require('node-mcstatus');

interface Result {
    icon: string | null;
}

export default new NativeFunction({
    name: '$getIcon',
    description: 'Get Java Icon URL',
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
    async execute (ctx, [host, port, options]) {
        try {
            const result: Result = await mcs.statusJava(host, port, options);
            
            // Perform manual checks instead of using expect
            if (typeof result.icon === 'string' || result.icon === null) {
                if (typeof result.icon === 'string') {
                    if (result.icon.length > 0 && result.icon.startsWith('data:image/png;base64,')) {
ctx.container.files.push(new AttachmentBuilder(Buffer.from(result.icon.slice('data:image/png;base64,'.length), 'base64'), {
            name: 'icon.png'
        }));
 } else {
console.log("Icon format is incorrect");
                    }
                } else {
                    console.log("No icon available (null)");
                }
            } else {
                console.log("Invalid icon type");
            }
            
            return this.success();
        } catch (error) {
            console.error("Error fetching status:", error);
            return this.customError("Failed to fetch status");
        }
    }
});