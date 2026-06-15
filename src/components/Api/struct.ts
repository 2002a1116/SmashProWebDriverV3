import type { SelectOption } from "naive-ui";

export interface HintSelectOption extends SelectOption{
    hint?:string;
}

export class Coord{
    x:number;
    y:number;
    constructor(){
        this.x=this.y=0;
    }
}


export class FormatDTO{
    firmwareVersion:number;
    format:string;
}
export class ConfigDTO{
    firmwareVersion:number;
    firmwareVersionString:string;
    config:string;
    controllerColor:string;
}