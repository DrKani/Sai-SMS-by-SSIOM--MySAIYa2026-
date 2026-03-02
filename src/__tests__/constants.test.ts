/**
 * Smoke tests for the app constants.
 *
 * These tests verify that critical configuration values are defined and
 * non-empty. They don't test Firebase or any async behaviour — just the
 * plain data exported from constants.ts.
 *
 * Run with:  npm test
 */

import { describe, it, expect } from 'vitest';
import { APP_CONFIG, STATES_OF_MALAYSIA, QUOTES_LIST } from '../constants';

describe('APP_CONFIG', () => {
  it('has a non-empty app name', () => {
    expect(APP_CONFIG.NAME).toBeTruthy();
  });

  it('has a valid official URL', () => {
    expect(APP_CONFIG.OFFICIAL_URL).toMatch(/^https?:\/\//);
  });

  it('has a positive national chanting goal', () => {
    expect(APP_CONFIG.GOAL_TOTAL_CHANTS).toBeGreaterThan(0);
  });
});

describe('STATES_OF_MALAYSIA', () => {
  it('contains 9 state regions', () => {
    expect(STATES_OF_MALAYSIA).toHaveLength(9);
  });

  it('includes Selangor & Kuala Lumpur', () => {
    expect(STATES_OF_MALAYSIA).toContain('Selangor & Kuala Lumpur');
  });
});

describe('QUOTES_LIST', () => {
  it('has at least one quote', () => {
    expect(QUOTES_LIST.length).toBeGreaterThan(0);
  });

  it('every quote is a non-empty string', () => {
    for (const quote of QUOTES_LIST) {
      expect(typeof quote).toBe('string');
      expect(quote.trim().length).toBeGreaterThan(0);
    }
  });
});
