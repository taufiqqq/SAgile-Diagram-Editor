import { NodeTypes } from '@xyflow/react';
import SequenceElementNode from '../components/SequenceElementNode';
import { SequenceFragmentNode } from '../components/SequenceFragmentNode';

// Define the node types for sequence diagrams
export const sequenceNodeTypes: NodeTypes = {
  sequenceElement: SequenceElementNode,
  sequenceFragment: SequenceFragmentNode,
};
