import { describe, expect, it } from 'vitest';
import {
  optimisticVoteReducer,
  type OptimisticVoteAction,
  type OptimisticVoteState,
  type VoteType,
} from './optimisticVote';

describe('optimisticVoteReducer', () => {
  const initialState: OptimisticVoteState = {
    upVotes: [],
    downVotes: [],
  };

  it('should return the initial state for unknown action type', () => {
    const action: OptimisticVoteAction = {
      type: 'UNKNOWN_ACTION' as VoteType,
      userId: 'user-1',
    };
    const state = optimisticVoteReducer(initialState, action);

    expect(state).toEqual(initialState);
  });

  describe('UP_VOTE action', () => {
    it('should add userId to upVotes and remove from downVotes', () => {
      const state: OptimisticVoteState = {
        upVotes: ['user-2'],
        downVotes: ['user-1', 'user-3'],
      };

      const action: OptimisticVoteAction = {
        type: 'UP_VOTE',
        userId: 'user-1',
      };

      const newState = optimisticVoteReducer(state, action);

      expect(newState.upVotes).toContain('user-1');
      expect(newState.upVotes).toContain('user-2');
      expect(newState.downVotes).not.toContain('user-1');
      expect(newState.downVotes).toContain('user-3');
    });

    it('should not duplicate userId in upVotes if already present', () => {
      const state: OptimisticVoteState = {
        upVotes: ['user-1'],
        downVotes: [],
      };

      const action: OptimisticVoteAction = {
        type: 'UP_VOTE',
        userId: 'user-1',
      };

      const newState = optimisticVoteReducer(state, action);

      expect(newState.upVotes).toEqual(['user-1']);
      expect(newState.upVotes.length).toBe(1);
    });
  });

  describe('DOWN_VOTE action', () => {
    it('should add userId to downVotes and remove from upVotes', () => {
      const state: OptimisticVoteState = {
        upVotes: ['user-1', 'user-2'],
        downVotes: ['user-3'],
      };

      const action: OptimisticVoteAction = {
        type: 'DOWN_VOTE',
        userId: 'user-1',
      };

      const newState = optimisticVoteReducer(state, action);

      expect(newState.downVotes).toContain('user-1');
      expect(newState.downVotes).toContain('user-3');
      expect(newState.upVotes).not.toContain('user-1');
      expect(newState.upVotes).toContain('user-2');
    });

    it('should not duplicate userId in downVotes if already present', () => {
      const state: OptimisticVoteState = {
        upVotes: [],
        downVotes: ['user-1'],
      };

      const action: OptimisticVoteAction = {
        type: 'DOWN_VOTE',
        userId: 'user-1',
      };

      const newState = optimisticVoteReducer(state, action);

      expect(newState.downVotes).toEqual(['user-1']);
      expect(newState.downVotes.length).toBe(1);
    });
  });

  describe('NEUTRAL_VOTE action', () => {
    it('should remove userId from both upVotes and downVotes', () => {
      const state: OptimisticVoteState = {
        upVotes: ['user-1', 'user-2'],
        downVotes: ['user-3', 'user-4'],
      };

      const action1: OptimisticVoteAction = {
        type: 'NEUTRAL_VOTE',
        userId: 'user-1',
      };

      const action2: OptimisticVoteAction = {
        type: 'NEUTRAL_VOTE',
        userId: 'user-3',
      };

      const stateAfterFirstAction = optimisticVoteReducer(state, action1);
      const finalState = optimisticVoteReducer(stateAfterFirstAction, action2);

      expect(finalState.upVotes).not.toContain('user-1');
      expect(finalState.upVotes).toContain('user-2');
      expect(finalState.downVotes).not.toContain('user-3');
      expect(finalState.downVotes).toContain('user-4');
    });
  });
});
