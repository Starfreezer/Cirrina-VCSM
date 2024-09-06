import StateOrStateMachine from "./stateOrStateMachine.ts"
import ContextVariable from "./contextVariable.tsx";
import Action from "./action.tsx";
import State from "./state.ts";
import Guard from "./guard.tsx";
import {
    StateMachineDescription
} from "../pkl/bindings/collaborative_state_machine_description.pkl.ts";

export default class StateMachine implements StateOrStateMachine {

    private _name: string
    private _states: StateOrStateMachine[] = [];
    private _localContext: ContextVariable[] = [];
    private _persistentContext: ContextVariable[] = [];
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

    get localContext(): ContextVariable[] {
        return this._localContext;
    }

    set localContext(value: ContextVariable[]) {
        this._localContext = value;
    }

    get persistentContext(): ContextVariable[] {
        return this._persistentContext;
    }

    set persistentContext(value: ContextVariable[]) {
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

    public clearStates() {
        this._states = [];
    }

    public getAllNamedActions() {
        let actions: Action[] = [];
        this.states.forEach(stateOrStatemachine => {
            if (!(stateOrStatemachine instanceof StateMachine)) {
                actions = actions.concat(stateOrStatemachine.getAllNamedActions())
            }
        })
        return actions.filter((action, index, self) => {
            return index === self.findIndex((a) => {
                return a.equals(action);
            })
        })
    }

    public getAllNamedGuards(): Guard[] {
        let guards: Guard[] = [];
        this.states.forEach(stateOrStatemachine => {
            if (!(stateOrStatemachine instanceof StateMachine)) {
                guards = guards.concat(stateOrStatemachine.getAllNamedGuards())

            }
        })
        return guards.filter((guard, index, self) => {
            return index === self.findIndex((g) => {
                return g.equals(guard);
            })
        })
    }


    public toDescription():StateMachineDescription {
        const description: StateMachineDescription = {
            localContext: null,
            name: this.name,
            persistentContext: null,
            stateMachines: this.getAllStateMachines().map((sm) => {return sm.toDescription()}),
            states: this.getAllStates().map((s) => {return s.toDescription()}),

        }
        return description;
    }

    public getAllStateMachines(): StateMachine[] {
        return this.states.filter((stateOrStatemachine): stateOrStatemachine is StateMachine => {
            return stateOrStatemachine instanceof StateMachine;
        });
    }

    public getAllStates(): State[] {
        return this.states.filter((stateOrStatemachine): stateOrStatemachine is State => {
            return stateOrStatemachine instanceof State;
        });
    }

    public getAllContextVariables(): ContextVariable[] {
        return this.persistentContext.concat(this.localContext)
    }

    public removeContext(context: ContextVariable): void {
        // Remove the context from the localContext array by reference comparison
        this._localContext = this._localContext.filter(existingContext => existingContext !== context);

        // Remove the context from the persistentContext array by reference comparison
        this._persistentContext = this._persistentContext.filter(existingContext => existingContext !== context);
    }



}