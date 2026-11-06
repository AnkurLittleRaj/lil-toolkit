import { Component, Prop, h } from '@stencil/core';
/** One metric with its timeframe and a textual trend cue. */
@Component({tag:'lil-metric-card',styleUrl:'lil-metric-card.css',shadow:true})
export class LilMetricCard {
 @Prop() label=''; @Prop() value=''; @Prop() trend='';
 @Prop({reflect:true}) sentiment:'positive'|'negative'|'neutral'='neutral';
 render(){return <div class="metric"><div class="label">{this.label}</div><div class="value">{this.value}</div>{this.trend?<div class="trend">{this.trend}</div>:null}</div>;}
}
