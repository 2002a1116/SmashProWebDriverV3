import type { Coord } from "../../../Api/struct";

export const h:number=Math.sqrt(0.5)
export const std_coord:Map<string,Coord> = new Map<string,Coord>([
    ['up',{x:0,y:1}],
    ['up_right',{x:h,y:h}],
    ['right',{x:1,y:0}],
    ['down_right',{x:h,y:-h}],
    ['down',{x:0,y:-1}],
    ['down_left',{x:-h,y:-h}],
    ['left',{x:-1,y:0}],
    ['up_left',{x:-h,y:h}]
])