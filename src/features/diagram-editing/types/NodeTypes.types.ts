import ActorNode from '../utils/shapes-react-flow/Actor';
import UseCaseNode from '../utils/shapes-react-flow/UseCase';


export const nodeTypes = {
  actor: ActorNode,
  usecase: UseCaseNode
};

export type NodeType = keyof typeof nodeTypes;