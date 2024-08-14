import {ActionType} from "../enums.tsx";
import {Context} from "../types.ts";


/**
 * Placeholder Action class. Expand once we have the Schema
 */
export default class Action {
    private _name: string;
    private _type: ActionType
    private _delay: number
    private _properties: {}
    private _context: Context | undefined

    constructor(name: string, type: ActionType, delay = 0) {
        this._name = name;
        this._type = type;
        this._properties = this.createActionProperties(type)
        this._delay = delay
        this._context = undefined

    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get type(){
        return this._type;
    }
    set type(value) {
        this._type = value;
    }

    get properties() {
        return this._properties;
    }

    set properties(props) {
        this._properties = props;
    }

    get delay() {
        return this._delay;
    }

    set delay(value) {
        this._delay = value;
    }


    get context(): Context | undefined {
        return this._context;
    }

    set context(value: Context | undefined) {
        this._context = value;
    }

    private createActionProperties(type: ActionType) {
        switch (type) {
            case ActionType.RAISE_EVENT: {
                return {
                    event: ""
                }
            }
            //TODO: OTHER TYPES
            default: {
                return {}
            }
        }
    }

    public toDICT() {
        this._properties = {...this.properties, type: this.type};
        let dict = {}
        if(this.delay > 0){
            dict = {...dict, delay: this.delay};
        }
        dict = {...dict, [this.name]: this.properties};

        return dict;
    }



}