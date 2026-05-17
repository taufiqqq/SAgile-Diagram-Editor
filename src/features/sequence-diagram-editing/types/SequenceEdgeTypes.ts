import { EdgeTypes } from '@xyflow/react';
import {
  SynchronousMessageEdge,
  AsynchronousMessageEdge,
  ReturnMessageEdge,
  CreateMessageEdge,
  DestroyMessageEdge,
} from '../utils/edges';
import { SequenceMessageEdge } from '../components/SequenceMessageEdge';

// Define the edge types for sequence diagrams
export const sequenceEdgeTypes: EdgeTypes = {
  sequenceMessage: SequenceMessageEdge, // New unified edge component for proper sequence diagrams
  synchronous: SynchronousMessageEdge,
  asynchronous: AsynchronousMessageEdge,
  return: ReturnMessageEdge,
  create: CreateMessageEdge,
  destroy: DestroyMessageEdge,
};
