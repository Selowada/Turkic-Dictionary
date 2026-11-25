import React from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {cleanup,render,screen,fireEvent} from '@testing-library/react';
import {EntryManager} from './EntryManager';
import approved from '../data/approved-entries.json';
afterEach(cleanup);
it('edits a copied entry while retaining source provenance and references',()=>{
 HTMLElement.prototype.scrollIntoView=vi.fn();
 const onChange=vi.fn();const original=approved[0];render(<EntryManager entries={[original]} onChange={onChange}/>);
 fireEvent.click(screen.getByRole('button',{name:/^Edit$/}));
 fireEvent.change(screen.getByLabelText('Definition',{exact:true}),{target:{value:'**apa** *ancestor*'}});
 fireEvent.click(screen.getByRole('button',{name:'Save changes'}));
 const updated=onChange.mock.calls[0][0][0];expect(updated.id).toBe(original.id);expect(updated.definitions.Clauson.text).toBe('**apa** *ancestor*');expect(updated.definitions.Clauson.provenance).toEqual(original.definitions.Clauson.provenance);expect(updated.definitions.Clauson.reference).toBe(original.definitions.Clauson.reference);
});
