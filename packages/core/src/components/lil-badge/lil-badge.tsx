import { Component, Prop, h } from '@stencil/core';
/** Always pair status color with a meaningful text label. */
@Component({tag:'lil-badge',styleUrl:'lil-badge.css',shadow:true})
export class LilBadge {
 @Prop({reflect:true}) status:'neutral'|'success'|'warning'|'danger'='neutral';
 render(){return <span part="badge"><slot/></span>;}
}
