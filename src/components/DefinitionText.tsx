import { Fragment, type ReactNode } from 'react';
// Deliberately limited Markdown: emphasis only. HTML stays escaped by React.
function emphasis(text: string): ReactNode[] {
 const pattern = /\*\*([^*]+(?:\*(?!\*)[^*]+\*)?[^*]*)\*\*|\*((?:\\\*|[^*\n])+)\*/g;
 const nodes: ReactNode[] = [];let start=0;let match:RegExpExecArray|null;
 while((match=pattern.exec(text))){nodes.push(text.slice(start,match.index));nodes.push(match[1]!==undefined?<strong key={match.index}>{emphasis(match[1])}</strong>:<em key={match.index}>{match[2].replace(/\\\*/g, '*')}</em>);start=pattern.lastIndex;}
 nodes.push(text.slice(start));return nodes;
}
export function DefinitionText({text}:{text:string}) {return <div className="definition-text">{text.split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{emphasis(paragraph).map((n,j)=><Fragment key={j}>{n}</Fragment>)}</p>)}</div>;}
