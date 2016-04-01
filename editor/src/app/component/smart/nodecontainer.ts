/// <reference path="../dumb/node.ts" />

module Component {
        type NodeContainerProps = Redux.Props<Message.Message>;

        function render (props: NodeContainerProps)
        {
                const message = props.data;
                const name = message.name;
                const selected = message.selected;

                const onClickLocal = (event: MouseEvent) =>
                        onClick(name, selected, event);
                const data = NodeData({
                        message: message,
                        onClick: onClickLocal,
                });

                return Node(data);
        }

        export const NodeContainer = Redux.createFactory(render, 'NodeContainer');

        function onClick (
                name: string, selected: boolean, event: MouseEvent)
        {
                event.stopPropagation();

                const groupSelect = event.ctrlKey;

                if (groupSelect) {
                        if (selected) {
                                onDeselect(name);
                        } else {
                                onSelect(name);
                        }
                } else {
                        if (selected) {
                                onDoubleClick(name);
                        } else {
                                onUniqueSelect(name);
                        }
                }
        }

        function onSelect (name: string)
        {
                const action = ActionCreators.selectMessage(name);
                Redux.handleAction(action);
        }

        function onDeselect (name: string)
        {
                const action = ActionCreators.deselectMessage(name);
                Redux.handleAction(action);
        }

        function onUniqueSelect (name: string)
        {
                const action = ActionCreators.uniqueSelectMessage(name);
                Redux.handleAction(action);
        }

        function onDoubleClick (name: string)
        {
                const action = ActionCreators.openMessage(name);
                Redux.handleAction(action);
        }
}
