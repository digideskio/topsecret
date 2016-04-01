/// <reference path="buttoninput.ts" />

module Component {
        interface OptionalInt {
                child: React.ReactElement<any>;
                onAdd: () => void;
                onRemove: () => void;
        };
        export type OptionalData = Immutable.Record.IRecord<OptionalInt>;
        export const OptionalData = Immutable.Record<OptionalInt>({
                child: null,
                onAdd: () => {},
                onRemove: () => {},
        }, 'Optional');

        type OptionalProps = Redux.Props<OptionalData>;

        function render (props: OptionalProps)
        {
                const data = props.data;
                const child = data.child;

                if (child) {
                        const removeFn = data.onRemove;
                        const onRemoveLocal = (event: Event) =>
                                onRemove(removeFn, event);
                        const enabled = true;
                        const removeProps = ButtonData({
                                text: 'x',
                                disabled: !enabled,
                                onClick: onRemoveLocal,
                                className: 'button-remove',
                        });
                        const remove = ButtonInput(removeProps);

                        return Div({}, child, remove);
                } else {
                        const addFn = data.onAdd;
                        const onAddLocal = (event: Event) =>
                                onAdd(addFn, event);
                        const enabled = true;
                        const addProps = ButtonData({
                                text: '+',
                                disabled: !enabled,
                                onClick: onAddLocal,
                                className: 'button-add',
                        });
                        const add = ButtonInput(addProps);

                        return Div({}, add);
                }
        }

        export const Optional = Redux.createFactory(render, 'Optional');

        function onAdd (addFn: () => void, event: Event)
        {
                event.stopPropagation();
                event.preventDefault();
                addFn();
        }

        function onRemove (removeFn: () => void, event: Event)
        {
                event.stopPropagation();
                event.preventDefault();
                removeFn();
        }
}
