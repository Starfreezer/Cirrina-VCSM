import Guard from "../src/classes/guard";
import Action from "../src/classes/action";
import PklService from "../src/services/pklService";
import {ActionType} from "../src/enums";
import {
    CollaborativeStateMachineDescription,
    CreateActionDescription, GuardDescription, InvokeActionDescription,
    OnTransitionDescription,
    StateDescription, StateMachineDescription, TransitionDescription
} from "../src/pkl/bindings/collaborative_state_machine_description.pkl";

describe('Guard.toPKL', () => {

    it('should serialize the Guard with a non-empty name and expression', () => {
        const guard = new Guard('a == 5', 'checkEquality');
        const expectedPKL = `{\n\texpression: "a == 5"\n}`;
        expect(PklService.guardToPKL(guard.toDescription())).toBe(expectedPKL);
    });

    it('should serialize the Guard with only an expression', () => {
        const guard = new Guard('a == 5');
        const expectedPKL = `{\n\texpression: "a == 5"\n}`;
        expect(PklService.guardToPKL(guard.toDescription())).toBe(expectedPKL);
    });

    it('should serialize the Guard with a complex expression', () => {
        const guard = new Guard('x > 10 && y < 20');
        const expectedPKL = `{\n\texpression: "x > 10 && y < 20"\n}`;
        expect(PklService.guardToPKL(guard.toDescription())).toBe(expectedPKL);
    });

    it('should handle empty expression gracefully', () => {
        const guard = new Guard('');
        const expectedPKL = `{\n\texpression: ""\n}`;
        expect(PklService.guardToPKL(guard.toDescription())).toBe(expectedPKL);
    });

    it("Raise event", () => {
        const action = new Action("Test",ActionType.RAISE_EVENT);
        action.properties = {event: "Event name"}
        console.log(PklService.actionToPKL(action.toDescription()));
    })

    it("Invoke Action",()=>{
        const action = new Action("Test", ActionType.INVOKE)
        action.properties = {
            description: "description",
            serviceType: "Type",
            serviceLevel: "Service Level"
        }
        console.log(PklService.actionToPKL(action.toDescription()));
    })

    it("Create Action", ()=> {
        const action = new Action("Test", ActionType.CREATE);
        action.properties = {
            description: "description",
            variable: "variable a",
            value: "1",
            isPersistent: true
        }
        console.log(PklService.actionToPKL(action.toDescription()))
    })
    it("Assign Action", ()=> {
        const action = new Action("Test", ActionType.ASSIGN);
        action.properties = {
            variable:"Variable a",
            value: "1"
        }
        console.log(PklService.actionToPKL(action.toDescription()))
    })

    it("Transition", ()=> {
        const action1 = new Action("Test", ActionType.ASSIGN);
        action1.properties = {
            variable:"Variable a",
            value: "1"
        }
        const action2 = new Action("Test", ActionType.CREATE);
        action2.properties = {
            description: "description",
            variable: "variable a",
            value: "1",
            isPersistent: true
        }
        const guard1 = new Guard('x > 10 && y < 20')
        const guard2 = new Guard('a == 5', 'checkEquality');

        const description: OnTransitionDescription = {
            actions: [action1.toDescription(),action2.toDescription()], else: "", event: "Event a", guards: [guard1.toDescription(),guard2.toDescription()], target: "Target State"

        }
        console.log(PklService.transitionToPKL(description));
    })

    it("State", () => {
        const actionDescription1: InvokeActionDescription = {
            done: [], input: [], isLocal: false, output: [], serviceType: "Service type",
            type: "invoke"

        }

        const actionDescription2: CreateActionDescription = {
            isPersistent: false, type: "create", variable: {name: "Variable name", value: "2 + 2"}


        }

        const actions = [actionDescription1,actionDescription2];

        const transitionDescription: TransitionDescription = {
            actions: [], else: "", guards: [], target: ""

        }

        const guardDescription: GuardDescription = {
            expression: "a > 5"

        }

        const onTransitionDescription: OnTransitionDescription = {
            actions: actions, else: "", event: "Transition Event", guards: [guardDescription], target: "targetState"

        }

        const stateDescription: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        console.log(PklService.stateToPKL(stateDescription))
    })

    it("StateMachine", () => {
        const actionDescription1: InvokeActionDescription = {
            done: [], input: [], isLocal: false, output: [], serviceType: "Service type",
            type: "invoke"

        }

        const actionDescription2: CreateActionDescription = {
            isPersistent: false, type: "create", variable: {name: "Variable name", value: "2 + 2"}


        }

        const actions = [actionDescription1,actionDescription2];

        const transitionDescription: TransitionDescription = {
            actions: [], else: "", guards: [], target: ""

        }

        const guardDescription: GuardDescription = {
            expression: "a > 5"

        }

        const onTransitionDescription: OnTransitionDescription = {
            actions: actions, else: "", event: "Transition Event", guards: [guardDescription], target: "targetState"

        }

        const stateDescription1: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        const stateDescription2: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        const states = [stateDescription1,stateDescription2]

        const stateMachineDescription1: StateMachineDescription = {
            localContext: {variables: []},
            name: "StateMachine",
            persistentContext: {variables: []},
            stateMachines: [],
            states: states

        }

        const stateMachineDescription2: StateMachineDescription = {
            localContext: {variables: []},
            name: "StateMachine",
            persistentContext: {variables: []},
            stateMachines: [stateMachineDescription1],
            states: states

        }

        console.log(PklService.stateMachineToPKL(stateMachineDescription2))

    })

    it("CollaborativeStateMachine", () => {
        const actionDescription1: InvokeActionDescription = {
            done: [], input: [], isLocal: false, output: [], serviceType: "Service type",
            type: "invoke"

        }

        const actionDescription2: CreateActionDescription = {
            isPersistent: false, type: "create", variable: {name: "Variable name", value: "2 + 2"}


        }

        const actions = [actionDescription1,actionDescription2];

        const transitionDescription: TransitionDescription = {
            actions: [], else: "", guards: [], target: ""

        }

        const guardDescription: GuardDescription = {
            expression: "a > 5"

        }

        const onTransitionDescription: OnTransitionDescription = {
            actions: actions, else: "", event: "Transition Event", guards: [guardDescription], target: "targetState"

        }

        const stateDescription1: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        const stateDescription2: StateDescription = {
            after: actions,
            always: [transitionDescription],
            entry: actions,
            exit: actions,
            initial: false,
            localContext: {variables: []},
            name: "StateName",
            on: [onTransitionDescription],
            persistentContext: {variables: []},
            staticContext: {variables: []},
            terminal: false,
            while: actions

        }

        const states = [stateDescription1,stateDescription2]

        const stateMachineDescription1: StateMachineDescription = {
            localContext: {variables: []},
            name: "StateMachine",
            persistentContext: {variables: []},
            stateMachines: [],
            states: states

        }

        const stateMachineDescription2: StateMachineDescription = {
            localContext: {variables: []},
            name: "StateMachine",
            persistentContext: {variables: []},
            stateMachines: [stateMachineDescription1],
            states: states

        }

        const collaborativeStateMachineDescription: CollaborativeStateMachineDescription = {
            localContext: {variables: []},
            name: "CollaborativeStatemachine",
            persistentContext: {variables: []},
            stateMachines: [stateMachineDescription1, stateMachineDescription2],
            version: "2.0"

        }

        console.log(PklService.collaborativeStateMachineToPKL(collaborativeStateMachineDescription))
    })


});
