import StateOrStateMachine from "./stateOrStateMachine.ts"
import {Context} from "../types.ts";
import Action from "./action.tsx";
import State from "./state.ts";

export default class StateMachine implements StateOrStateMachine {

    private _name: string
    private _states: StateOrStateMachine[] = [];
    private _localContext: Context[] = [];
    private _persistentContext: Context[] = [];
    private _guards: string[] = [];
    private _actions: Action[] = [];
    private _abstract = false

    public constructor(name: string) {
        this._name = name
    }

    public get name(): string {
        return this._name
    }

    public set name(name: string) {
        this._name = name
    }

    get states(): StateOrStateMachine[] {
        return this._states;
    }

    set states(value: StateOrStateMachine[]) {
        this._states = value;
    }

    get localContext(): Context[] {
        return this._localContext;
    }

    set localContext(value: Context[]) {
        this._localContext = value;
    }

    get persistentContext(): Context[] {
        return this._persistentContext;
    }

    set persistentContext(value: Context[]) {
        this._persistentContext = value;
    }

    get guards(): string[] {
        return this._guards;
    }

    set guards(value: string[]) {
        this._guards = value;
    }

    get actions(): Action[] {
        return this._actions;
    }

    set actions(value: Action[]) {
        this._actions = value;
    }

    get abstract(): boolean {
        return this._abstract;
    }

    set abstract(value: boolean) {
        this._abstract = value;
    }

    public addState(stateOrStatemachine: StateOrStateMachine): void {
        this._states.push(stateOrStatemachine);
    }

    public toDICT(): object {
        let dict = {
            states: {} as { [key: string]: object },
            stateMachines: {} as { [key: string]: object }
        };

        dict = {states: {}, stateMachines: {}}
        this.states.forEach((stateOrStateMachine) => {
            if(stateOrStateMachine instanceof State) {
                dict = {
                    ...dict,
                    states: {
                        ...dict.states,
                        [stateOrStateMachine.name]: stateOrStateMachine.toDICT()

                    }
                }
            }
            if(stateOrStateMachine instanceof StateMachine) {
                dict = {
                    ...dict,
                    stateMachines: {
                        ...dict.stateMachines,
                        [stateOrStateMachine.name]: stateOrStateMachine.toDICT()

                    }
                }
            }

        })
        return dict;
    }


}