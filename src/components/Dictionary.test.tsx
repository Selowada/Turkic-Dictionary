import React from 'react';
import {afterEach,it,expect} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Dictionary} from './Dictionary';
afterEach(cleanup);
it('offers nasal n and replaces ng with 1 without submitting a search',async()=>{
 const user=userEvent.setup();render(<Dictionary entries={[]}/>);const input=screen.getByRole('combobox') as HTMLInputElement;
 await user.type(input,'bung');expect(screen.getByRole('button',{name:'1: Insert ŋ (nasal n)'})).toBeTruthy();
 await user.keyboard('1');expect(input.value).toBe('buŋ');expect(screen.queryByRole('region',{name:'Search results'})).toBeNull();
 await user.keyboard('1');expect(input.value).toBe('buŋ1');
});
it('supports clicking the suggestion and preserves uppercase',async()=>{
 const user=userEvent.setup();render(<Dictionary entries={[]}/>);const input=screen.getByRole('combobox') as HTMLInputElement;
 await user.type(input,'BUNG');await user.click(screen.getByRole('button',{name:'1: Insert ŋ (nasal n)'}));expect(input.value).toBe('BUŊ');
});
it('allows dismissal without rewriting the word',async()=>{
 const user=userEvent.setup();render(<Dictionary entries={[]}/>);const input=screen.getByRole('combobox') as HTMLInputElement;
 await user.type(input,'bung');await user.keyboard('{Escape}1');expect(input.value).toBe('bung1');
});
