import { Component, Prop, h } from '@stencil/core';
import type { LilChartDatum } from '../../types';
/** Zero-baseline chart with text values and an accessible data table. */
@Component({tag:'lil-chart',styleUrl:'lil-chart.css',shadow:true})
export class LilChart {
 @Prop() heading='Revenue over time'; @Prop() description='Monthly recurring revenue · USD';
 @Prop() data:LilChartDatum[]=[]; @Prop() summary=''; @Prop() locale='en-US'; @Prop() currency='USD';
 private format(value:number){return new Intl.NumberFormat(this.locale,{style:'currency',currency:this.currency,maximumFractionDigits:0}).format(value);}
 render(){const max=Math.max(1,...this.data.map(d=>Math.max(0,d.value)));return <lil-card heading={this.heading} description={this.description}><div class="plot" aria-hidden="true">{this.data.map((d,i)=><div class="column"><div class="well"><div class={{bar:true,accent:i===this.data.length-1}} style={{height:`${Math.max(0,d.value)/max*100}%`}} title={this.format(d.value)}/></div><span>{d.label}</span></div>)}</div>{this.summary?<p>{this.summary}</p>:null}<details><summary>View chart data</summary><table><caption>{this.heading}</caption><thead><tr><th scope="col">Period</th><th scope="col">Value</th></tr></thead><tbody>{this.data.map(d=><tr><th scope="row">{d.label}</th><td>{this.format(d.value)}</td></tr>)}</tbody></table></details></lil-card>;}
}
