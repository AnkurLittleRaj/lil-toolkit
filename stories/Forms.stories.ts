import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta:Meta={title:'Components/Forms',parameters:{docs:{description:{component:'Keep labels visible, use specific errors, and provide 16px input text on mobile. These controls participate in native forms and expose typed change events for framework wrappers.'}}}};export default meta;type Story=StoryObj;
export const Input:Story={render:()=>html`<div class="control-width"><lil-input label="Email address" type="email" name="email" placeholder="you@example.com" help="We’ll only send account updates."></lil-input></div>`};
export const Error:Story={render:()=>html`<div class="control-width"><lil-input label="Work email" type="email" value="invalid" error="Enter a valid email address."></lil-input></div>`};
export const Disabled:Story={render:()=>html`<div class="control-width"><lil-input label="Email address" value="ankur@example.com" disabled></lil-input></div>`};
export const Checkbox:Story={render:()=>html`<lil-checkbox label="Remember this device"></lil-checkbox>`};
export const Switch:Story={render:()=>html`<lil-switch label="Email notifications"></lil-switch>`};
export const FormSubmission:Story={render:()=>html`<form class="stack" style="max-width:420px" @submit=${(event:SubmitEvent)=>{event.preventDefault();const form=event.target as HTMLFormElement;form.querySelector('output')!.textContent=JSON.stringify(Object.fromEntries(new FormData(form)));}}><lil-input label="Email address" name="email" type="email" required></lil-input><lil-checkbox label="Subscribe to updates" name="updates"></lil-checkbox><button type="submit" style="padding:12px">Submit native form</button><output aria-live="polite"></output></form>`};
