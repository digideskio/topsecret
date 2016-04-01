module Component {
        type AbsoluteProps = Redux.Props<MathUtils.Coord>;

        function render (props: AbsoluteProps)
        {
                const data = props.data;
                const children = props.children;
                const style = {
                        position: 'absolute',
                        left: data.x,
                        top: data.y,
                };
                return Div({ style: style }, children);
        }

        export const Absolute = Redux.createFactory(render, 'Absolute');
}
