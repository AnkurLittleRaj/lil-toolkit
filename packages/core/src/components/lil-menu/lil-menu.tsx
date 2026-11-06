import { Component, Prop, State, Element, Listen, Event, EventEmitter, h } from '@stencil/core';
import type { LilMenuItem } from '../../types';
let nextId=0;
/** A compact choice menu with Escape and arrow-key navigation. */
@Component({tag:'lil-menu',styleUrl:'lil-menu.css',shadow:true})
export class LilMenu {
 @Element() el!:HTMLElement;
 @Prop() label='Last 30 days'; @Prop() items:LilMenuItem[]=[];
 @Prop() value=''; @State() open=false;
 @Event() lilSelect!:EventEmitter<{value:string}>;
 private uid=`lil-menu-${++nextId}`;
 private trigger?:HTMLButtonElement;
 private focusFirst=false;
 @Listen('pointerdown',{target:'document'}) outside(e:PointerEvent){if(this.open&&!e.composedPath().includes(this.el))this.open=false;}
 private close(){this.open=false;this.trigger?.focus();}
 componentDidRender(){if(this.open&&this.focusFirst){this.el.shadowRoot?.querySelector<HTMLButtonElement>('[role=menuitem]:not(:disabled)')?.focus();this.focusFirst=false;}}
 private onKey(e:KeyboardEvent){const els=Array.from(this.el.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role=menuitem]:not(:disabled)')||[]);if(e.key==='Escape'){e.preventDefault();this.close();}else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const index=els.indexOf(this.el.shadowRoot?.activeElement as HTMLButtonElement);const next=e.key==='Home'?0:e.key==='End'?els.length-1:(index+(e.key==='ArrowDown'?1:-1)+els.length)%els.length;els[next]?.focus();}else if(e.key==='Tab')this.open=false;}
 render(){return <div class="root" onKeyDown={e=>this.onKey(e)}><button class="trigger" ref={el=>this.trigger=el} type="button" aria-haspopup="menu" aria-expanded={this.open?'true':'false'} aria-controls={this.uid} onClick={()=>{this.open=!this.open;this.focusFirst=this.open;}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();e.stopPropagation();this.open=true;this.focusFirst=true;}}}>{this.label}<lil-icon name="chevron"/></button>{this.open?<div class="menu" id={this.uid} role="menu" aria-label={this.label}>{this.items.map(i=><button type="button" role="menuitem" disabled={i.disabled} class={{selected:i.value===this.value}} onClick={()=>{this.lilSelect.emit({value:i.value});this.close();}}>{i.label}{i.value===this.value?<lil-icon name="check"/>:null}</button>)}</div>:null}</div>;}
}
