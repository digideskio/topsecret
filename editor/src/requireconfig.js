require.config({
        // app entry point
        baseURL: ["../build"],
        deps: ["../build/main"],
        paths: {
                "immutable": "../../node_modules/immutable/dist/immutable",
                "jquery": "../../node_modules/jquery/dist/jquery",
                "react": "../../node_modules/react/dist/react",
                "react-dom": "../../node_modules/react-dom/dist/react-dom"
        }
});
