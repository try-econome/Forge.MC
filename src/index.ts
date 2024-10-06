import { ForgeExtension } from '@tryforge/forgescript';


export class ForgeMC extends ForgeExtension {
    name = 'Forge.MC';
    description = 'A forgescript extension that allows you to view Minecraft Server Statistics';
    version = '1.0.0';

    public init () {
        this.load(__dirname + '/functions');
    };
};