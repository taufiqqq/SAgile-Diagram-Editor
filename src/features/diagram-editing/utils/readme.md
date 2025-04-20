The reason for separating `shapes-html` and `shapes-react-flow` into different files is to decouple the visual representation from the logic. This allows the HTML to be used as an image for drag-and-drop functionality and more.

To create a new custom node:

1. Create the HTML representation in `src/features/diagram-editing/utils/shapes-html`.
2. Implement the logic for the node in `src/features/diagram-editing/utils/shapes-react-flow`.
3. Add the new node to the node factory.
4. If you want to include the node in the left sidebar, use `nodeFactory.createDraggableNode()`.

While this involves multiple steps, it ensures better maintainability and flexibility for future enhancements.
