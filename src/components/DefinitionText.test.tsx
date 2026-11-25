import React from 'react';
import {afterEach,it,expect} from 'vitest';
import {render,cleanup} from '@testing-library/react';
import {DefinitionText} from './DefinitionText';
afterEach(cleanup);
it('renders bold, italic and paragraphs without losing historic letters',()=>{
 const {container}=render(<DefinitionText text={'**buŋ** *grief*\n\n**katığlan-** ŋ ı ḍ'}/>);
 expect(container.querySelectorAll('strong')).toHaveLength(2);expect(container.querySelector('em')?.textContent).toBe('grief');expect(container.querySelectorAll('p')).toHaveLength(2);expect(container.textContent).toContain('ŋ ı ḍ');
});
it('never executes HTML from definitions',()=>{const {container}=render(<DefinitionText text={'<img src=x onerror=alert(1)> **word**'}/>);expect(container.querySelector('img')).toBeNull();expect(container.textContent).toContain('<img');});
