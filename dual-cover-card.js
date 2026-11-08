/*!
Dual Cover Card
MIT License

Copyright (c) 2026 kevinconsen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/* Version 0.2.7. Home Assistant custom card. Positions are physical heights: 0 bottom, 100 top. */
// Shared by dashboard instances and their modal, scoped to this HA page.
const plisseText = {
  "nl": {
    "error_status": "Error",
    "tap_warning": "Deze tikactie gaat voor op het openen van de uitgebreide bediening. Bij een fout opent tikken altijd de foutdetails.",
    "name": "Plisségordijn",
    "description": "Top-down/bottom-up-bediening voor gordijnen met twee covers.",
    "title": "Naam",
    "top_entity": "Bovenste cover",
    "bottom_entity": "Onderste cover",
    "icon": "Icoon",
    "color": "Eigen kleur (optioneel)",
    "show_status": "Status tonen",
    "show_position": "Coverposities tonen",
    "show_buttons": "Bedieningsknoppen tonen",
    "open_popup": "Open uitgebreide bediening bij tikken",
    "size": "Indeling",
    "tap_action": "Tikken",
    "hold_action": "Ingedrukt houden",
    "double_tap_action": "Dubbeltikken",
    "appearance": "Weergave",
    "arrangement": "Indeling",
    "controls": "Bediening",
    "interactions": "Interacties",
    "color_help": "Leeg = themakleur. Eigen kleur: bijvoorbeeld #926bc7.",
    "icon_help": "Leeg = icoon van de bovenste cover.",
    "size_help": "Compact toont alleen Open, Stop en Dicht. Auto kiest small, medium of large op basis van de kaartbreedte.",
    "open_popup_help": "De popup toont altijd status, posities en knoppen. Een expliciete tikactie, ook Geen, krijgt voorrang, behalve bij een fout.",
    "covered": "bedekt",
    "top": "Boven",
    "bottom": "Onder",
    "unavailable": "Positie niet beschikbaar",
    "open": "Open",
    "closed": "Gesloten",
    "close": "Dicht",
    "dismiss": "Sluiten",
    "stop": "Beide covers stoppen",
    "top_edge": "Bovenrand",
    "bottom_edge": "Onderrand",
    "move": "Hele gordijn verplaatsen",
    "height": "hoogte",
    "unknown": "Onbekend",
    "entities_required": "Vul top_entity en bottom_entity in.",
    "invalid_size": "size: compact, small, medium, large of auto",
    "confirm": "Deze actie uitvoeren?",
    "invalid_action": "Ongeldige actie",
    "navigation_required": "Vul een navigatiepad in",
    "external_url": "Gebruik URL openen voor een externe pagina",
    "url_required": "Vul een URL in",
    "http_required": "Gebruik een HTTP- of HTTPS-adres",
    "unsupported_action": "Dit actietype wordt niet ondersteund",
    "action_failed": "Actie mislukt.",
    "stop_failed": "Stoppen van een of beide covers is mislukt.",
    "pair_failed": "Instellen van een of beide covers is mislukt.",
    "command_failed": "Bediening mislukt.",
    "missing_position": "Een cover is niet beschikbaar of heeft geen positie.",
    "overlap": "De gemelde coverposities overlappen. Je kunt de randen uit elkaar bewegen; de kaart houdt rekening met bekende doelposities.",
    "invert_top": "Invert bovenste cover",
    "invert_bottom": "Invert onderste cover",
    "invert_top_help": "Keert de percentages van de bovenste cover om (0 ↔ 100), voor weergave én opdrachten.",
    "invert_bottom_help": "Keert de percentages van de onderste cover om (0 ↔ 100), voor weergave én opdrachten.",
    "different_entities": "Kies twee verschillende covers.",
    "invalid_invert": "Invert moet true of false zijn.",
    "entity_missing": "De entity bestaat niet. Controleer de gekozen cover.",
    "entity_unavailable": "De cover is niet beschikbaar. Controleer de verbinding.",
    "position_unknown": "De cover meldt geen geldige positie tussen 0 en 100%.",
    "set_failed": "De positieopdracht is mislukt.",
    "stop_one_failed": "De stopopdracht is mislukt.",
    "ack_timeout": "Na 15 seconden is geen bevestiging ontvangen. De opdracht kan nog worden uitgevoerd; controleer de cover voordat je opnieuw probeert.",
    "motion_timeout": "De doelpositie is na twee minuten niet bevestigd. Controleer de cover.",
    "target_pending": "Doel",
    "not_reached": "De doelpositie is niet bereikt en er zijn 30 seconden geen positie- of bewegingswijzigingen ontvangen.",
    "request_accepted": "De opdracht voor de andere cover is wel bevestigd; dit betekent niet dat die al op de doelpositie staat.",
    "command_issues": "Niet alle opdrachten konden worden bevestigd.",
    "compact_orientation": "Compacte indeling",
    "vertical": "Verticaal",
    "horizontal": "Horizontaal",
    "select_covers": "Kies beide covers",
    "invalid_orientation": "Kies vertical of horizontal."
  },
  "en": {
    "error_status": "Error",
    "tap_warning": "This tap action takes priority over opening detailed controls. When an error occurs, tapping always opens the error details.",
    "name": "Honeycomb shades",
    "description": "Top-down/bottom-up controls for blinds and shades with two covers.",
    "title": "Name",
    "top_entity": "Top cover",
    "bottom_entity": "Bottom cover",
    "icon": "Icon",
    "color": "Custom color (optional)",
    "show_status": "Show status",
    "show_position": "Show cover positions",
    "show_buttons": "Show control buttons",
    "open_popup": "Open detailed controls on tap",
    "size": "Layout",
    "tap_action": "Tap",
    "hold_action": "Hold",
    "double_tap_action": "Double tap",
    "appearance": "Appearance",
    "arrangement": "Layout",
    "controls": "Controls",
    "interactions": "Interactions",
    "color_help": "Leave empty for the theme color. Custom color: for example #926bc7.",
    "icon_help": "Leave empty to use the top cover icon.",
    "size_help": "Compact shows only Open, Stop and Close. Auto selects small, medium or large based on card width.",
    "open_popup_help": "The popup always shows status, positions and buttons. An explicit tap action, including None, takes priority, except when there is an error.",
    "covered": "covered",
    "top": "Top",
    "bottom": "Bottom",
    "unavailable": "Position unavailable",
    "open": "Open",
    "closed": "Closed",
    "close": "Close",
    "dismiss": "Close dialog",
    "stop": "Stop both covers",
    "top_edge": "Top edge",
    "bottom_edge": "Bottom edge",
    "move": "Move the whole shade",
    "height": "height",
    "unknown": "Unknown",
    "entities_required": "Enter top_entity and bottom_entity.",
    "invalid_size": "size: compact, small, medium, large or auto",
    "confirm": "Perform this action?",
    "invalid_action": "Invalid action",
    "navigation_required": "Enter a navigation path",
    "external_url": "Use Open URL for an external page",
    "url_required": "Enter a URL",
    "http_required": "Use an HTTP or HTTPS address",
    "unsupported_action": "This action type is not supported",
    "action_failed": "Action failed.",
    "stop_failed": "Could not stop one or both covers.",
    "pair_failed": "Could not set one or both cover positions.",
    "command_failed": "Cover command failed.",
    "missing_position": "A cover is unavailable or has no position.",
    "overlap": "Reported cover positions overlap. You can move the edges apart; the card uses known target positions.",
    "invert_top": "Invert top cover",
    "invert_bottom": "Invert bottom cover",
    "invert_top_help": "Reverses the top cover percentages (0 ↔ 100), for display and commands.",
    "invert_bottom_help": "Reverses the bottom cover percentages (0 ↔ 100), for display and commands.",
    "different_entities": "Select two different covers.",
    "invalid_invert": "Invert must be true or false.",
    "entity_missing": "The entity does not exist. Check the selected cover.",
    "entity_unavailable": "The cover is unavailable. Check its connection.",
    "position_unknown": "The cover is not reporting a valid position between 0 and 100%.",
    "set_failed": "The position command failed.",
    "stop_one_failed": "The stop command failed.",
    "ack_timeout": "No acknowledgement was received within 15 seconds. The command may still execute; check the cover before trying again.",
    "motion_timeout": "The target position was not confirmed within two minutes. Check the cover.",
    "target_pending": "Target",
    "not_reached": "The target was not reached and no position or movement changes were received for 30 seconds.",
    "request_accepted": "The command for the other cover was acknowledged; this does not mean it has reached its target yet.",
    "command_issues": "Not all commands could be confirmed.",
    "compact_orientation": "Compact orientation",
    "vertical": "Vertical",
    "horizontal": "Horizontal",
    "select_covers": "Choose both covers",
    "invalid_orientation": "Choose vertical or horizontal."
  }
};
function plisseLanguage(hass) { return (hass?.locale?.language || hass?.language || "en").toLowerCase().split(/[-_]/)[0] === "nl" ? "nl" : "en"; }
function plisseTranslate(hass,key) { return plisseText[plisseLanguage(hass)][key] || key; }
const plisseSessions = new Map();
// Whole-percentage motor reports can differ by one point at a meeting edge
// or after arriving. This tolerates reports only; command limits stay strict.
const PLISSE_POSITION_TOLERANCE = 1;
const PLISSE_INACTIVITY_TIMEOUT = 30000;
const PLISSE_MOTION_TIMEOUT = 120000;
function plisseNotify(session) {
  for (const card of session.cards) card.render();
}
class PlisseCard extends HTMLElement {
  static async getConfigElement() {
    if (!customElements.get('ha-form') && window.loadCardHelpers) {
      const helpers=await window.loadCardHelpers();
      const native=helpers.createCardElement({type:'entities',entities:[]});
      await native.constructor.getConfigElement();
    }
    return document.createElement('plisse-card-editor');
  }
  static configForm(hass) {
    const t=key=>plisseTranslate(hass,key);
    const defaults={size:'medium',open_popup:true,show_status:true,show_position:false,show_buttons:false,invert_top:false,invert_bottom:false};
    const field = (name, selector, extra = {}) => ({name, selector, ...(name in defaults ? {default:defaults[name],description:{suggested_value:defaults[name]}} : {}), ...extra});
    const panel = (name,title,schema) => ({name,title:t(name),icon:{appearance:'mdi:palette',arrangement:'mdi:view-dashboard',controls:'mdi:tune',interactions:'mdi:gesture-tap'}[name],type:'expandable',flatten:true,schema});
    const preview = size => {
      const drawing = size === 'auto' ? '<g fill="none" stroke="#926bc7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M43 43 24 24m0 16V24h16M67 43l19-19m-16 0h16v16M43 67 24 86m0-16v16h16M67 67l19 19m-16 0h16V70"/></g>' : size === 'compact' ? '<circle cx="22" cy="24" r="8" fill="#926bc7"/><path d="M38 20h48m-48 10h32" stroke="#555" stroke-width="4"/><path d="M20 62h16m-8-8v16M49 56h12v12h-12zM76 62h16" fill="none" stroke="#926bc7" stroke-width="4"/>' : size === 'small'
        ? '<path d="M24 24v58" stroke="#555" stroke-width="5"/><rect x="44" y="20" width="30" height="72" rx="8" fill="#926bc7"/>'
        : size === 'medium'
        ? '<circle cx="22" cy="20" r="8" fill="#926bc7"/><path d="M38 17h42m-42 9h28" stroke="#555" stroke-width="4"/><rect x="38" y="40" width="30" height="52" rx="8" fill="#926bc7"/>'
        : '<circle cx="27" cy="17" r="7" fill="#926bc7"/><path d="M40 17h36m-42 12h36" stroke="#555" stroke-width="4"/><rect x="30" y="42" width="46" height="50" rx="10" fill="#926bc7"/>';
      return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110"><rect x="1" y="1" width="108" height="108" rx="10" fill="#eee"/>'+drawing+'</svg>');
    };
    return {
      schema:[
        field('title',{text:{}}),
        field('top_entity',{entity:{filter:{domain:'cover'}}},{required:true}),
        field('bottom_entity',{entity:{filter:{domain:'cover'}}},{required:true}),
        panel('appearance','Weergave',[
          field('icon',{icon:{}},{context:{icon_entity:'top_entity'}}),
          field('color',{text:{}}),
          field('show_status',{boolean:{}}),
          field('show_position',{boolean:{}})
        ]),
        panel('arrangement','Indeling',[
          field('size',{select:{mode:'box',options:[
            ...['compact','small','medium','large'].map(value=>({value,label:value[0].toUpperCase()+value.slice(1),image:{src:preview(value)}})),
            {value:'auto',label:'Auto',image:{src:preview('auto')}}
          ]}})
        ]),
        panel('controls','Bediening',[
          field('show_buttons',{boolean:{}}),field('open_popup',{boolean:{}}),
          field('invert_top',{boolean:{}}),field('invert_bottom',{boolean:{}})
        ]),
        panel('interactions','Interacties',[
          ...['tap_action','hold_action','double_tap_action'].map(name=>field(name,{ui_action:{
            default_action:'none',actions:['none','more-info','toggle','navigate','url','perform-action']
          }},{context:{entity_id:'top_entity'}}))
        ])
      ],
      computeLabel: f=>t(f.name),
      computeHelper: f=>['color','icon','size','open_popup','invert_top','invert_bottom'].includes(f.name) ? t(f.name+'_help') : undefined
    };
  }
  static getStubConfig() {
    return { top_entity: '', bottom_entity: '', title: '', size: 'medium', compact_orientation:'vertical', show_status: true, show_position: false, show_buttons: false, open_popup: true, invert_top: false, invert_bottom: false };
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  setConfig(config) {
    this.setup=!config.top_entity || !config.bottom_entity;
    if(config.top_entity && config.top_entity===config.bottom_entity)throw new Error(this.t('different_entities'));
    for(const key of ['invert_top','invert_bottom'])if(config[key]!==undefined && typeof config[key]!=='boolean')throw new Error(this.t('invalid_invert'));
    if (!['auto','compact','small','medium','large'].includes(config.size || 'medium')) throw new Error(this.t('invalid_size'));
    if(config.compact_orientation && !['vertical','horizontal'].includes(config.compact_orientation))throw new Error(this.t('invalid_orientation'));
    this.closePopup();
    this.operation=(this.operation || 0)+1;this.busy=false;
    this.session?.cards.delete(this);
    this.clearGestures();
    this.drag = null;
    this.config = {compact_orientation:'vertical', ...config, size: config.size || 'medium', open_popup: config.open_popup ?? true, invert_top:config.invert_top ?? false,invert_bottom:config.invert_bottom ?? false };
    this.key = JSON.stringify([config.top_entity,config.bottom_entity]);
    if (!plisseSessions.has(this.key)) plisseSessions.set(this.key,{targets:{},commands:{},cards:new Set(),error:''});
    this.session = plisseSessions.get(this.key);
    this.session.cards.add(this);
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;min-width:0;height:100%;--plisse-color:var(--state-cover-active-color,#926bc7);--track-height:256px;--track-width:56px;--track-min-width:44px}
        *{box-sizing:border-box}
        ha-card{display:grid;position:relative;width:100%;height:100%;min-height:0;padding:12px;gap:12px;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(120px,1fr);color:var(--primary-text-color,#222);background:var(--ha-card-background,var(--card-background-color,#fff))}
        .identity{display:grid;grid-template-columns:36px minmax(0,1fr);column-gap:8px;align-items:center;min-width:0;min-height:44px}
        .identity-text{display:contents}.icon{grid-column:1;grid-row:1 / span 2;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;color:var(--plisse-color);background:color-mix(in srgb,var(--plisse-color) 18%,transparent)}
        h2{grid-column:2;grid-row:1;min-width:0;margin:0;font:500 14px/20px var(--paper-font-body1_-_font-family,Roboto,sans-serif);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-self:end}
        .summary{grid-column:2;grid-row:2;font-size:12px;line-height:18px;color:var(--secondary-text-color,#666);align-self:start}
        .control{position:relative;grid-row:2;min-width:0;width:min(100%,clamp(var(--track-min-width),80%,var(--track-width)));height:100%;min-height:var(--track-height);margin:0;justify-self:center}
        .window{position:relative;width:100%;height:100%;border-radius:var(--track-radius,18px);touch-action:none;overflow:hidden;background:color-mix(in srgb,var(--plisse-color) 22%,var(--card-background-color,#fff))}
        .fabric{position:absolute;left:0;right:0;background:var(--plisse-color);border-radius:6px;pointer-events:none}
        .fabric-move{position:absolute;left:0;right:0;top:15px;bottom:15px;min-height:6px;border:0;padding:0;background:transparent;cursor:grab;touch-action:none;pointer-events:auto;z-index:3}
        .fabric-move:active{cursor:grabbing}.fabric-move:focus-visible{outline:2px solid white;outline-offset:-3px}
        .handle{position:absolute;left:0;width:100%;height:18px;transform:translateY(-50%);border:0;background:transparent;cursor:ns-resize;touch-action:none;padding:0;z-index:2}
        .handle,.handle:after{cursor:ns-resize!important}
        .handle:after{content:'';display:block;width:50%;height:4px;margin:auto;background:#fff;border-radius:4px}
        .handle:focus-visible{outline:2px solid var(--plisse-color);outline-offset:-2px}
        .handle:disabled,.preset:disabled{opacity:.4;cursor:default}
        .window.follow .handle{transition:top 200ms ease-out}.window.follow .fabric{transition:top 200ms ease-out,height 200ms ease-out}
        .tooltip{position:fixed;transform:translateY(-50%);background:#000;color:#fff;padding:8px 10px;border-radius:8px;font-size:14px;white-space:nowrap;pointer-events:none;z-index:4}
        .values{grid-column:1 / -1;display:flex;justify-content:center;flex-wrap:wrap;gap:8px 20px;font-size:12px}.values span{color:var(--secondary-text-color,#666)}
        .presets{display:flex;justify-content:center;gap:8px;margin:0;grid-column:1 / -1}
        .preset{display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:56px;height:36px;border:0;border-radius:18px;padding:0;background:var(--secondary-background-color,#eee);color:var(--primary-text-color,#222);font:12px Roboto,sans-serif;cursor:pointer;touch-action:manipulation}
        .preset:hover{filter:brightness(.95)}.preset:focus-visible{outline:2px solid var(--plisse-color)}
        .stop-icon{width:10px;height:10px;background:currentColor;border-radius:1px}
        .error{grid-column:1 / -1;color:var(--error-color,#db4437);background:color-mix(in srgb,var(--error-color,#db4437) 15%,transparent);border-radius:12px;padding:12px 16px;font-size:14px;line-height:1.5;overflow-wrap:anywhere;white-space:pre-line}
        [hidden],.error:empty{display:none!important}
        ha-card[role="button"]{cursor:pointer}ha-card:focus-visible{outline:2px solid var(--plisse-color)}
        :host([data-size="medium"]){min-width:66px;--track-min-width:38px}
        :host([data-size="medium"]) .control{min-width:38px}
        :host([data-size="medium"]) ha-card.buttons{grid-template-columns:minmax(0,1fr) minmax(38px,56px) 54px minmax(0,1fr);column-gap:0;min-width:112px}
        :host([data-size="medium"][data-tight="true"]) ha-card{padding:8px;gap:8px}
        :host([data-size="medium"][data-tight="true"]) ha-card.buttons{grid-template-columns:minmax(0,1fr) minmax(38px,56px) 36px minmax(0,1fr);column-gap:0;min-width:98px}
        :host([data-size="medium"][data-tight="true"]) .presets{gap:6px;width:30px}
        :host([data-size="medium"][data-tight="true"]) .presets .preset{width:30px;height:32px;font-size:11px}
        .identity.hide-icon{grid-template-columns:minmax(0,1fr)}.identity.hide-icon .icon{display:none}.identity.hide-icon h2,.identity.hide-icon .summary{grid-column:1}
        :host([data-size="compact"][data-inline="true"]) ha-card{grid-template-columns:minmax(0,1fr) clamp(132px,50%,256px);grid-template-rows:auto;align-items:center}
        :host([data-size="compact"][data-inline="true"]) .compact-actions{grid-column:2;grid-row:1}
        :host([data-size="compact"][data-inline="true"]) .compact-actions .preset{min-width:36px}
        :host([data-size="medium"]) .identity{grid-column:1 / -1}
        :host([data-size="medium"]) ha-card.buttons .control{grid-column:2;width:100%}
        :host([data-size="medium"]) .presets{grid-column:3;grid-row:2;width:42px;justify-self:end;flex-direction:column-reverse;align-items:center;justify-content:flex-end}
        :host([data-size="medium"]) .preset{width:42px}
        :host([data-size="small"]){--track-width:38px;--track-min-width:24px;min-width:78px}
        :host([data-size="small"]) .control{min-width:24px}
        :host([data-size="small"]) ha-card{padding:10px;grid-template-columns:24px minmax(24px,1fr);grid-template-rows:20px minmax(120px,1fr);gap:8px}
        :host([data-size="small"]) .identity,:host([data-size="small"]) .identity-text{display:contents}
        :host([data-size="small"]) .icon{display:none}
        :host([data-size="small"]) h2{grid-column:1;grid-row:2;writing-mode:vertical-rl;transform:rotate(180deg);align-self:center;justify-self:center;max-height:var(--track-height)}
        :host([data-size="small"]) ha-card.buttons h2{max-height:calc(var(--track-height) - 148px);align-self:end}
        :host([data-size="small"]) .summary{grid-column:2;grid-row:1;justify-self:center;white-space:nowrap}
        :host([data-size="small"]) .control{grid-column:2}
        :host([data-size="small"]) .presets{grid-column:1;grid-row:2;flex-direction:column-reverse;gap:6px;align-self:start}
        :host([data-size="small"]) .preset{width:24px;height:30px;font-size:10px}
        :host([data-size="small"]) .preset-label{transform:rotate(-90deg)}
        :host([data-size="small"]) .values{font-size:11px;gap:4px}
        :host([data-size="large"]){--track-width:130px;--track-min-width:104px}
        :host([data-size="large"]) ha-card{padding:24px;gap:20px}
        :host([data-size="large"]) .identity{grid-template-columns:36px auto;justify-content:center;text-align:center;row-gap:8px}
        :host([data-size="large"]) .icon{grid-row:1}
        :host([data-size="large"]) h2{font-size:20px;line-height:36px}
        :host([data-size="large"]) .summary{grid-column:1 / -1;font-size:22px;line-height:28px;text-align:center}
        :host([data-size="large"]) .presets{flex-wrap:wrap}
        .compact-actions{display:flex;gap:8px;justify-content:center;grid-row:2}
        :host([data-size="compact"]) ha-card{grid-template-rows:auto auto;align-content:start}
        :host([data-size="compact"]) .control,:host([data-size="compact"]) .presets,:host([data-size="compact"]) .values{display:none!important}
        :host([data-size="compact"]) .compact-actions .preset{flex:1;max-width:80px;min-width:32px;width:auto;height:36px}
        dialog{padding:0;border:0;border-radius:24px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);width:min(520px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto}
        @media(hover:hover){
          ha-card.popup-enabled:hover{background:color-mix(in srgb,var(--plisse-color) 4%,var(--ha-card-background,var(--card-background-color,#fff)))}
          .dialog-close:hover{background:color-mix(in srgb,var(--primary-text-color,#222) 10%,transparent)}
        }
        dialog::backdrop{background:#0008}
        .dialog-head{display:flex;align-items:center;gap:12px;padding:16px 20px;position:sticky;top:0;background:var(--card-background-color,#fff);z-index:5}
        .dialog-icon{display:flex;align-items:center;justify-content:center;width:36px;height:36px;flex:0 0 36px;border-radius:50%;background:color-mix(in srgb,var(--plisse-color) 18%,transparent);color:var(--plisse-color);--mdc-icon-size:24px}
        .dialog-title{font-size:20px;flex:1;overflow-wrap:anywhere}
        .dialog-close{border:0;background:transparent;color:inherit;font-size:26px;width:40px;height:40px;cursor:pointer;border-radius:50%}
        :host([data-modal]){height:auto}
        :host([data-modal]) ha-card{box-shadow:none;border:0;height:auto}
        :host([data-modal]) .identity{display:block;min-height:0}
        :host([data-modal]) .icon,:host([data-modal]) h2{display:none}
        @media(prefers-reduced-motion:reduce){.window.follow .handle,.window.follow .fabric{transition:none}}
      </style>
      <ha-card><div class="identity"><div class="icon"><ha-state-icon></ha-state-icon></div><div class="identity-text"><h2></h2><div class="summary"></div></div></div>
      <div class="control"><div class="window"><div class="fabric"><button class="fabric-move" type="button"></button></div>
      <button class="handle top" role="slider" aria-label="Bovenrand" aria-orientation="vertical"></button>
      <button class="handle bottom" role="slider" aria-label="Onderrand" aria-orientation="vertical"></button></div><div class="tooltip" hidden aria-hidden="true"></div></div>
      <div class="presets" hidden>
        <button class="preset stop" type="button" aria-label="Beide covers stoppen" title="Stop"><span class="stop-icon" aria-hidden="true"></span></button>
        <button class="preset" type="button" data-coverage="50" aria-label="50% bedekt"><span class="preset-label">50%</span></button>
        <button class="preset" type="button" data-coverage="75" aria-label="75% bedekt"><span class="preset-label">75%</span></button>
        <button class="preset" type="button" data-coverage="100" aria-label="100% bedekt"><span class="preset-label">100%</span></button>
      </div>
      <div class="compact-actions" hidden>
        <button class="preset compact-open" type="button"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="m8 3 4 4 4-4M8 21l4-4 4 4M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button class="preset compact-stop" type="button"><span class="stop-icon" aria-hidden="true"></span></button>
        <button class="preset compact-close" type="button"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="m8 7 4-4 4 4M8 17l4 4 4-4M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
      <div class="values"><div><span>Boven</span> <b class="tv"></b></div><div><span>Onder</span> <b class="bv"></b></div></div><div class="error" role="status"></div></ha-card>`;
    const customColor = config.color;
    this.style.removeProperty('--plisse-color');
    if (customColor && CSS.supports('color',customColor)) this.style.setProperty('--plisse-color',customColor);
    this.shadowRoot.querySelector('h2').textContent = this.cardTitle();
    for (const side of ['top','bottom'])this.bindEdgeHandle(side);
    this.shadowRoot.querySelector('.stop').addEventListener('click', () => this.stopCovers());
    this.shadowRoot.querySelectorAll('[data-coverage]').forEach(button => {
      button.addEventListener('click', () => this.setCoverage(Number(button.dataset.coverage)));
    });
    this.shadowRoot.querySelector('.compact-open').addEventListener('click',()=>this.openShades());
    this.shadowRoot.querySelector('.compact-stop').addEventListener('click',()=>this.stopCovers());
    this.shadowRoot.querySelector('.compact-close').addEventListener('click',()=>this.sendPair(100,0));
    this.bindTrackTap();
    this.shadowRoot.querySelector('.fabric-move').addEventListener('keydown',e=>{
      const delta={ArrowUp:1,ArrowDown:-1,PageUp:10,PageDown:-10}[e.key];
      if(delta===undefined)return;e.preventDefault();
      if(!this.ready() || this.busy)return;
      const p=this.displayPositions();if(p.top<p.bottom)return;
      const shifted=this.shiftPair(p,delta);this.sendPair(shifted.top,shifted.bottom);
    });
    this.bindActions();
    this.observeSize();
    this.render();
  }
  bindEdgeHandle(side) {
    const el=this.shadowRoot.querySelector('.'+side);
    el.addEventListener('pointerdown',e=>{
      if(!this.ready() || this.busy || this.drag)return;
      e.preventDefault();
      this.beginEdgeDrag(side,e.pointerId,e.clientY);
      el.setPointerCapture(e.pointerId);
      this.render();
    });
    el.addEventListener('pointermove',e=>{
      if(this.drag?.side!==side || this.drag.id!==e.pointerId)return;
      const height=this.trackHeight();
      this.moveEdgeDrag(Math.round(this.drag.start-100*(e.clientY-this.drag.y)/Math.max(1,height-36)));
      this.render();
    });
    el.addEventListener('pointerup',e=>{
      if(this.drag?.side!==side || this.drag.id!==e.pointerId)return;
      const {positions,moved}=this.drag;
      this.drag=null;
      if(!moved){this.render();return;}
      return this.sendPositions(positions,side==='top'?'bottom':'top');
    });
    el.addEventListener('pointercancel',()=>{this.drag=null;this.render();});
    el.addEventListener('keydown',e=>{
      const delta={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:10,PageDown:-10}[e.key];
      if(delta===undefined && e.key!=='Home' && e.key!=='End')return;
      e.preventDefault();
      if(!this.ready() || this.busy)return;
      return this.send(side,e.key==='Home'?0:e.key==='End'?100:this.displayPositions()[side]+delta);
    });
  }
  beginEdgeDrag(side,id,y) {
    const positions=this.displayPositions(),start=positions[side];
    this.drag={side,id,y,start,moved:false,originalPositions:positions,positions:this.edgePositions(side,start,positions)};
  }
  moveEdgeDrag(value) {
    if(!this.drag || this.drag.side==='both')return;
    // Recompute from the gesture's starting targets so an accidental push can
    // be undone before release, without moving the other rail past its origin.
    this.drag.positions=this.edgePositions(this.drag.side,value,this.drag.originalPositions);
    this.drag.moved ||= this.drag.positions[this.drag.side]!==this.drag.start;
  }
  edgePositions(side,value,positions=this.displayPositions()) {
    const p={...positions},position=Math.max(0,Math.min(100,value));
    p[side]=position;
    if(side==='top')p.bottom=Math.min(p.bottom,position);
    else p.top=Math.max(p.top,position);
    return p;
  }
  bindTrackTap() {
    const track=this.shadowRoot.querySelector('.window');
    const onHandle=e=>e.composedPath().some(n=>n.classList?.contains('handle'));
    track.addEventListener('pointerdown',e=>{
      if(e.button!==0 || onHandle(e) || !this.ready() || this.busy || this.drag)return;
      const rect=track.getBoundingClientRect(),p=this.displayPositions();
      const y=e.clientY-rect.top,span=rect.height-36;
      // Give fingers a larger edge target; overlapping zones use the nearest grip.
      const touchSide=e.pointerType==='touch' ? this.touchGrip(y,rect.height,p) : null;
      if(touchSide){
        e.preventDefault();
        this.beginEdgeDrag(touchSide,e.pointerId,e.clientY);
        this.shadowRoot.querySelector('.'+touchSide).setPointerCapture(e.pointerId);
        this.render();return;
      }
      const topY=(100-p.top)*span/100,bottomY=(100-p.bottom)*span/100+36;
      this.trackTap={id:e.pointerId,x:e.clientX,y:e.clientY,positions:p,
        fabric:p.top>=p.bottom && y>=topY && y<=bottomY};
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove',e=>{
      const tap=this.trackTap;if(tap?.id!==e.pointerId)return;
      if(!this.ready() || this.busy){this.trackTap=null;this.drag=null;this.render();return;}
      if(Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>8 || this.drag?.side==='both'){
        if(!tap.fabric){this.trackTap=null;return;}
        const height=track.getBoundingClientRect().height;
        this.drag={side:'both',id:e.pointerId,positions:this.shiftPair(tap.positions,Math.round((tap.y-e.clientY)*100/Math.max(1,height-36)))};
        this.render();
      }
    });
    track.addEventListener('pointercancel',()=>{this.trackTap=null;if(this.drag?.side==='both')this.drag=null;this.render();});
    track.addEventListener('pointerup',e=>{
      if(this.trackTap?.id!==e.pointerId)return;
      this.trackTap=null;
      if(this.drag?.side==='both'){
        const p=this.drag.positions;this.drag=null;return this.sendPair(p.top,p.bottom);
      }
      if(onHandle(e) || !this.ready() || this.busy || this.drag)return;
      const rect=track.getBoundingClientRect();
      if(e.clientX<rect.left || e.clientX>rect.right || e.clientY<rect.top || e.clientY>rect.bottom)return;
      const command=this.trackCommand(e.clientY-rect.top,rect.height);
      this.send(command.side,command.position);
    });
  }
  touchGrip(y,height,p) {
    const span=Math.max(1,height-36);
    const top=9+(100-p.top)*span/100;
    const bottom=27+(100-p.bottom)*span/100;
    const dt=Math.abs(y-top),db=Math.abs(y-bottom);
    return Math.min(dt,db)<=32 ? (dt<=db ? 'top' : 'bottom') : null;
  }
  shiftPair(p,delta) {
    const shift=Math.max(-p.bottom,Math.min(100-p.top,delta));
    return {top:p.top+shift,bottom:p.bottom+shift};
  }
  trackCommand(y,height) {
    const p=this.displayPositions();
    let top=p.top,bottom=p.bottom;
    if(top<bottom)top=bottom=(top+bottom)/2;
    const span=Math.max(1,height-36);
    const middle=18+(100-(top+bottom)/2)*span/100;
    // The midpoint divides both the fabric and the two uncovered regions.
    const side=y<=middle?'top':'bottom';
    const position=Math.round(Math.max(0,Math.min(100,100-(y-18)*100/span)));
    return {side,position:this.limit(side,position)};
  }
  clearGestures() {
    this.trackTap=null;
    clearTimeout(this.holdTimer); clearTimeout(this.tapTimer);
    this.holdTimer = this.tapTimer = null; this.gesture = null;
  }
  hasAction(kind) { return !!this.config?.[kind + '_action']?.action && this.config[kind + '_action'].action !== 'none'; }
  hasError() { return !!this.config && !!this.errorText(); }
  popupOnTap() { return !this.inModal && (this.hasError() || (this.config.open_popup === true && !this.config.tap_action)); }
  interactionEnabled() { return this.popupOnTap() || ['tap','hold','double_tap'].some(k=>this.hasAction(k)); }
  updateInteractionState() {
    const card=this.shadowRoot.querySelector('ha-card');
    card.classList.toggle('popup-enabled',this.popupOnTap());
    if(this.interactionEnabled()){card.tabIndex=0;card.setAttribute('role','button');}
    else{card.removeAttribute('tabindex');card.removeAttribute('role');}
  }
  bindActions() {
    const card = this.shadowRoot.querySelector('ha-card');
    const onSlider = e => e.composedPath().some(n => (n.classList?.contains('control') || n.classList?.contains('preset')));
    card.addEventListener('pointerdown', e => {
      if (!this.interactionEnabled() || onSlider(e) || e.button !== 0 || this.gesture) return;
      this.gesture = {id:e.pointerId,x:e.clientX,y:e.clientY,held:false};
      if (this.hasAction('hold')) this.holdTimer = setTimeout(() => {
        if (!this.gesture) return;
        this.gesture.held = true;
        clearTimeout(this.tapTimer); this.tapTimer = null;
        this.runAction('hold');
      }, 500);
    });
    card.addEventListener('pointermove', e => {
      if (this.gesture?.id === e.pointerId && Math.hypot(e.clientX-this.gesture.x,e.clientY-this.gesture.y)>8) {
        clearTimeout(this.holdTimer); this.gesture = null;
      }
    });
    const cancel = () => { clearTimeout(this.holdTimer); this.gesture = null; };
    card.addEventListener('pointercancel', cancel);
    card.addEventListener('pointerleave', cancel);
    card.addEventListener('pointerup', e => {
      if (this.gesture?.id !== e.pointerId) return;
      const held = this.gesture.held; cancel();
      if (held || onSlider(e)) return;
      if (this.hasAction('double_tap') && !this.hasError()) {
        if (this.tapTimer) {
          clearTimeout(this.tapTimer); this.tapTimer = null; this.runAction('double_tap');
        } else this.tapTimer = setTimeout(() => { this.tapTimer = null; this.runAction('tap'); }, 300);
      } else this.runAction('tap');
    });
    card.addEventListener('contextmenu', e => { if (!onSlider(e) && this.hasAction('hold')) e.preventDefault(); });
    card.addEventListener('keydown', e => {
      if (e.target !== card || !['Enter',' '].includes(e.key)) return;
      e.preventDefault();
      if (!e.repeat) this.runAction(e.shiftKey ? 'hold' : 'tap');
    });
  }
  async runAction(kind) {
    if(this.setup)return;
    if(kind==='tap' && !this.inModal && this.hasError()){this.openPopup();return;}
    const action = this.config?.[kind + '_action'];
    if (!action) {
      if (kind === 'tap' && !this.inModal && this.config.open_popup === true) this.openPopup();
      return;
    }
    if (action.action === 'none') return;
    if (action.confirmation && !action.confirmation.exemptions?.some(e => e.user === this._hass?.user?.id)) {
      if (!window.confirm(action.confirmation.text || this.t('confirm'))) return;
    }
    try {
      const entity = action.entity || this.config.top_entity;
      switch (action.action) {
        case 'more-info':
          this.dispatchEvent(new CustomEvent('hass-more-info',{bubbles:true,composed:true,detail:{entityId:entity}})); break;
        case 'toggle':
          await this._hass.callService('cover','toggle',{entity_id:entity}); break;
        case 'perform-action':
        case 'call-service': {
          const service = action.perform_action || action.service || '';
          if (!/^[a-z0-9_]+\.[a-z0-9_]+$/.test(service)) throw new Error(this.t('invalid_action'));
          const [domain,name] = service.split('.');
          await this._hass.callService(domain,name,action.data ?? action.service_data ?? {},action.target);
          break;
        }
        case 'navigate': {
          if (!action.navigation_path) throw new Error(this.t('navigation_required'));
          const url = new URL(action.navigation_path,window.location.href);
          if (url.origin !== window.location.origin) throw new Error(this.t('external_url'));
          window.history[action.navigation_replace ? 'replaceState' : 'pushState'](null,'',url.pathname+url.search+url.hash);
          window.dispatchEvent(new CustomEvent('location-changed',{detail:{replace:!!action.navigation_replace}}));
          break;
        }
        case 'url': {
          if (!action.url_path) throw new Error(this.t('url_required'));
          const url = new URL(action.url_path,window.location.href);
          if (!['http:','https:'].includes(url.protocol)) throw new Error(this.t('http_required'));
          window.open(url.href,'_blank','noopener,noreferrer'); break;
        }
        default: throw new Error(this.t('unsupported_action'));
      }
    } catch (err) { this.error = 'action_failed'; this.render(); }
  }
  get error() { return this.session?.error || ''; }
  set error(value) { if (this.session) { this.session.error=value; plisseNotify(this.session); } }
  openPopup() {
    if (this.setup || this.dialog?.open || this.inModal || this.config.open_popup !== true && !this.hasError()) return;
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-label',this.cardTitle());
    const head = document.createElement('div'); head.className='dialog-head';
    const title = document.createElement('div'); title.className='dialog-title'; title.textContent=this.cardTitle();
    const close = document.createElement('button'); close.className='dialog-close';close.textContent='×';close.setAttribute('aria-label',this.t('dismiss'));
    const child = document.createElement('dual-cover-card');
    child.inModal=true; child.setAttribute('data-modal','');
    child.setConfig({...this.config,size:'large',show_status:true,show_position:true,show_buttons:true,open_popup:false,
      tap_action:{action:'none'},hold_action:{action:'none'},double_tap_action:{action:'none'}});
    child.hass=this._hass;
    const icon=document.createElement('ha-state-icon');icon.className='dialog-icon';
    head.append(icon,title,close);dialog.append(head,child);this.shadowRoot.append(dialog);
    this.dialog=dialog;this.modalCard=child;this.updateDialogIcon();
    close.addEventListener('click',()=>this.closePopup());
    dialog.addEventListener('close',()=>this.closePopup());
    dialog.addEventListener('click',e=>{
      const r=dialog.getBoundingClientRect();
      if(e.target===dialog && (e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)) this.closePopup();
    });
    dialog.showModal();close.focus();
  }
  updateDialogText() {
    if(!this.dialog)return;
    this.dialog.setAttribute('aria-label',this.cardTitle());
    this.dialog.querySelector('.dialog-title').textContent=this.cardTitle();
    this.dialog.querySelector('.dialog-close').setAttribute('aria-label',this.t('dismiss'));
  }
  movementIcon() {
    const direction=side=>{
      const state=this._hass?.states[this.entityId(side)];
      if(!state || !['opening','closing'].includes(state.state))return 0;
      const raw=state.state==='opening'?1:-1;
      return this.config['invert_'+side]?-raw:raw;
    };
    const top=direction('top'),bottom=direction('bottom');
    if(top===1 && bottom===-1)return 'mdi:arrow-expand-vertical';
    if(top===-1 && bottom===1)return 'mdi:arrow-collapse-vertical';
    if(top || bottom)return (top || bottom)>0?'mdi:arrow-up':'mdi:arrow-down';
    return undefined;
  }
  updateDialogIcon() {
    const icon=this.dialog?.querySelector('ha-state-icon');
    if(!icon)return;
    const entity=this._hass?.states[this.config.top_entity];
    icon.hass=this._hass;icon.stateObj=entity;
    icon.icon=this.movementIcon() || this.config.icon || entity?.attributes.icon || (entity ? undefined : 'mdi:blinds-horizontal');
  }
  closePopup() {
    const dialog=this.dialog;if(!dialog)return;
    this.dialog=null;this.modalCard=null;
    if(dialog.open)dialog.close();dialog.remove();
    this.shadowRoot.querySelector('ha-card')?.focus();
  }
  entityId(side) { return this.config[side==='top'?'top_entity':'bottom_entity']; }
  convertPosition(side,value) { return this.config['invert_'+side] ? 100-value : value; }
  target(side) {
    const id=this.config[side==='top'?'top_entity':'bottom_entity'];
    const t=this.session?.targets[id];
    return t ? this.convertPosition(side,t.value) : this.positions()[side];
  }
  arrived(state,target) {
    return state && !['opening','closing','unknown','unavailable'].includes(state.state)
      && typeof state.attributes.current_position==='number'
      && Math.abs(state.attributes.current_position-target.value)<=PLISSE_POSITION_TOLERANCE;
  }
  remember(side,value,notify=true) {
    const id=this.entityId(side);
    this.forget(id);
    const t={value:this.convertPosition(side,value),created:Date.now(),lastState:this._hass?.states[id]};
    const session=this.session;
    const expire=reason=>{
      if(session.targets[id]!==t)return;
      // A dashboard and its popup share targets, but may receive HA updates in
      // different order. Use the newest known report when the timer fires.
      let state=t.lastState;
      for(const card of session.cards){
        const candidate=card._hass?.states[id];
        if(candidate && (!state || (candidate.last_updated || '')>=(state.last_updated || '')))state=candidate;
      }
      this.forget(id,t,session);
      if(!this.arrived(state,t)){
        const items=session.error?.items || [];
        session.error={items:[...items.filter(i=>i.id!==id),{id,reason}]};
      }
      plisseNotify(session);
    };
    t.expire=expire;
    t.timer=setTimeout(()=>expire('motion_timeout'),PLISSE_MOTION_TIMEOUT);
    t.idleTimer=setTimeout(()=>expire('not_reached'),PLISSE_INACTIVITY_TIMEOUT);
    session.targets[id]=t;
    if(notify)plisseNotify(session);
    return t;
  }
  forget(id,expected,session=this.session) {
    const old=session?.targets[id];
    if(!old || (expected && old!==expected))return;
    clearTimeout(old.timer);clearTimeout(old.idleTimer);delete session.targets[id];
  }
  reconcile() {
    if(!this.session || !this._hass)return;
    let changed=false;
    for(const id of [this.config.top_entity,this.config.bottom_entity]){
      const t=this.session.targets[id],s=this._hass.states[id];if(!t)continue;
      if(s===t.lastState)continue;
      if(s?.last_updated && t.lastState?.last_updated && s.last_updated<t.lastState.last_updated)continue;
      const previous=t.lastState;
      t.lastState=s;
      if(!s || ['unavailable','unknown'].includes(s.state) || typeof s.attributes.current_position!=='number' || this.arrived(s,t)){
        this.forget(id,t);changed=true;continue;
      }
      // Entity objects can also change for unrelated attributes. Only position
      // or movement changes extend the inactivity deadline, never the hard cap.
      if(s.state!==previous?.state || s.attributes.current_position!==previous?.attributes.current_position){
        clearTimeout(t.idleTimer);
        t.idleTimer=setTimeout(()=>t.expire('not_reached'),PLISSE_INACTIVITY_TIMEOUT);
      }
    }
    if(changed)plisseNotify(this.session);
  }
  disconnectedCallback() { this.closePopup(); this.session?.cards.delete(this); this.clearGestures(); this.drag = null; this.resizeObserver?.disconnect(); this.trackObserver?.disconnect(); }
  connectedCallback() { this.session?.cards.add(this); this.observeSize(); this.render(); }
  observeSize() {
    if (!this.config) return;
    this.resizeObserver?.disconnect();
    this.applySize(this.getBoundingClientRect().width);
    this.resizeObserver = new ResizeObserver(entries => {
      this.applySize(entries[0].contentRect.width);
    });
    this.resizeObserver.observe(this);
    const track=this.shadowRoot.querySelector('.window');
    this.trackObserver?.disconnect();
    if(track){this.trackObserver=new ResizeObserver(()=>this.render());this.trackObserver.observe(track);}

  }
  applySize(width) {
    const size = this.config.size && this.config.size !== 'auto' ? this.config.size : width > 0 && width < 260 ? 'small' : width >= 440 ? 'large' : 'medium';
    const sizeChanged = size !== this.activeSize;
    this.activeSize = size;
    if(sizeChanged)this.setAttribute('data-size',size);
    // Width is allotted by HA; don't constrain the card itself.
    // Equal default outer heights: small 20 padding + 20 header + 8 gap + 232 track;
    // medium 24 padding + 44 header + 12 gap + 200 track = 280px (plus border).
    const baseline={compact:200,small:232,medium:200,large:320}[size];
    const available=this.inModal ? Math.max(140,Math.min(320,window.innerHeight-270)) : baseline;
    this._trackHeight=available;
    this.style.setProperty('--track-height',available+'px');
    this.updateResponsiveLayout(width);
    this.render();
  }
  updateResponsiveLayout(width) {
    const tight=width>0 && width<150;
    this.setAttribute('data-tight',String(tight));
    this.setAttribute('data-inline',String(this.activeSize==='compact' && this.config.compact_orientation==='horizontal' && width>=340));
    const identity=this.shadowRoot.querySelector('.identity'),summary=this.shadowRoot.querySelector('.summary');
    if(identity && summary && this.activeSize!=='small' && this.activeSize!=='large'){
      // Measure with the icon reserved, so removing it cannot create a resize oscillation.
      const available=Math.max(0,identity.getBoundingClientRect().width-44);
      const canvas=this.measureCanvas || (this.measureCanvas=document.createElement('canvas'));
      const ctx=canvas.getContext('2d');
      if(ctx){ctx.font='12px Roboto, sans-serif';identity.classList.toggle('hide-icon',ctx.measureText(summary.textContent || '').width>available);}
    }
  }
  trackHeight() { return this.shadowRoot?.querySelector('.window')?.getBoundingClientRect().height || this._trackHeight || 200; }
  t(key) { return plisseTranslate(this._hass,key); }
  cardTitle() { return this.config?.title?.trim() || this.t('name'); }
  words() { return ['covered','top','bottom','unavailable','open','closed'].map(key=>this.t(key)); }
  status(top, bottom, valid) {
    const w = this.words();
    if (!valid) return this.inModal ? w[3] : '—';
    const coverage = Math.max(0,top - bottom);
    if (coverage === 0 || coverage === 100) {
      const state = coverage === 100 ? 'closed' : 'open';
      return this.t(state);
    }
    return Math.round(coverage) + '%' + (this.activeSize === 'small' ? '' : ' ' + w[0]);
  }
  displayPositions() {
    const p=this.positions();
    if(this.ready())for(const side of ['top','bottom'])p[side]=this.target(side);
    return p;
  }
  set hass(value) { this._hass = value;
    const listing=window.customCards?.find(card=>card.type==='dual-cover-card');
    if(listing){listing.name='Dual Cover Card';listing.description=this.t('description');} this.updateDialogIcon(); this.updateDialogText(); this.reconcile(); if(this.modalCard)this.modalCard.hass=value; this.render(); }
  coverProblem(side) {
    const state=this._hass?.states[this.entityId(side)];
    if(!state)return 'entity_missing';
    if(state.state==='unavailable')return 'entity_unavailable';
    const p=state.attributes.current_position;
    if(state.state==='unknown' || typeof p!=='number' || !Number.isFinite(p) || p<0 || p>100)return 'position_unknown';
    return '';
  }
  positions() {
    if(this.setup)return {top:75,bottom:25};
    const get=side=>this.coverProblem(side) ? null : this.convertPosition(side,this._hass.states[this.entityId(side)].attributes.current_position);
    return {top:get('top'),bottom:get('bottom')};
  }
  errorText() {
    if(this.setup)return '';
    const error=this.error;
    const lines=[];
    if(typeof error==='string' && error)lines.push(this.t(error));
    if(error?.items){
      for(const item of error.items){
        const side=item.id===this.config.top_entity?'top':'bottom';
        const name=this._hass?.states[item.id]?.attributes.friendly_name || item.id;
        lines.push(this.t(side+'_entity')+' ('+name+'): '+this.t(item.reason));
      }
      if(error.acceptedOther)lines.push(this.t('request_accepted'));
    }
    for(const side of ['top','bottom']){
      const issue=this.coverProblem(side);
      if(issue){const id=this.entityId(side),name=this._hass?.states[id]?.attributes.friendly_name || id;lines.push(this.t(side+'_entity')+' ('+name+'): '+this.t(issue));}
    }
    const p=this.displayPositions();
    if(this.ready() && p.bottom-p.top>PLISSE_POSITION_TOLERANCE)lines.push(this.t('overlap'));
    return [...new Set(lines)].join('\n');
  }
  async callCover(hass,service,data) {
    // A service acknowledgement is not proof of physical arrival; never retry automatically.
    let timer;
    try {
      return await Promise.race([
        Promise.resolve().then(()=>hass.callService('cover',service,data)),
        new Promise((_,reject)=>{timer=setTimeout(()=>reject({plisseTimeout:true}),15000);})
      ]);
    } finally { clearTimeout(timer); }
  }
  async runCommands(commands,service) {
    const session=this.session,hass=this._hass,config=this.config;
    const operation=++this.operation;
    const entries=commands.map(({side,position})=>{
      const id=this.entityId(side),token={};session.commands[id]=token;
      const target=service==='set_cover_position'?session.targets[id]:undefined;
      return {id,token,target,data:{entity_id:id,...(position===undefined?{}:{position:this.convertPosition(side,position)})}};
    });
    const results=await Promise.allSettled(entries.map(e=>this.callCover(hass,service,e.data)));
    const failed=[];let acceptedOther=false;
    results.forEach((result,i)=>{
      const entry=entries[i];if(session.commands[entry.id]!==entry.token)return;
      if(entry.target && session.targets[entry.id] && session.targets[entry.id]!==entry.target)return;
      if(result.status==='fulfilled'){acceptedOther=true;return;}
      const timeout=result.reason?.plisseTimeout===true;
      if(!timeout && entry.target)this.forget(entry.id,entry.target,session);
      failed.push({id:entry.id,reason:timeout?'ack_timeout':service==='stop_cover'?'stop_one_failed':'set_failed'});
    });
    if(failed.length){
      session.error={items:failed,acceptedOther};
    }
    if(this.config===config && this.operation===operation){this.busy=false;this.render();}
    plisseNotify(session);
  }
  ready() {
    if(this.setup)return false;
    if (!this.config) return false;
    const p = this.positions();
    return p.top !== null && p.bottom !== null && p.top >= 0 && p.bottom <= 100 && p.top <= 100 && p.bottom >= 0;
  }
  limit(side, value) {
    const boundary=this.target(side==='top'?'bottom':'top');
    return side==='top' ? Math.max(boundary ?? 0,Math.min(100,value)) : Math.max(0,Math.min(boundary ?? 100,value));
  }
  async stopCovers() {
    if(this.setup)return;
    for(const card of this.session.cards){card.clearGestures();card.drag=null;}
    this.error = '';
    this.forget(this.config.top_entity);this.forget(this.config.bottom_entity);plisseNotify(this.session);
    this.render();
    // Keep Stop usable while position requests are still in flight.
    return this.runCommands([{side:'top'},{side:'bottom'}],'stop_cover');
  }

  async setCoverage(coverage) {
    if (this.busy || !this.ready() || ![50,75,100].includes(coverage)) return;
    // HA cover positions use whole percentages. Preserve exact coverage;
    // for 75% the nearest symmetric positions are 88% and 13%.
    const top = Math.round(50 + coverage / 2), bottom = top - coverage;
    return this.sendPair(top,bottom);
  }
  async openShades() {
    if(!this.ready() || this.busy)return;
    const p=this.displayPositions();
    const middle=Math.round((p.top+p.bottom)/2);
    return this.sendPair(middle,middle);
  }
  async sendPair(top,bottom) {
    return this.sendPositions({top,bottom});
  }
  async sendPositions(positions,firstSide='top') {
    const {top,bottom}=positions;
    if(this.busy || !this.ready() || !Number.isFinite(top) || !Number.isFinite(bottom) || bottom<0 || top>100 || top<bottom)return;
    this.drag=null;
    const current=this.displayPositions();
    const order=firstSide==='bottom'?['bottom','top']:['top','bottom'];
    const commands=order.filter(side=>positions[side]!==current[side]).map(side=>({side,position:positions[side]}));
    // Do not restart an unchanged pending rail's command or inactivity timer.
    if(!commands.length){this.render();return;}
    this.busy=true;this.session.error='';
    // Publish all changed targets atomically, before notifying shared views.
    for(const {side,position} of commands)this.remember(side,position,false);
    plisseNotify(this.session);
    this.render();
    return this.runCommands(commands,'set_cover_position');
  }
  async send(side,value) {
    if(!this.ready() || this.busy){this.render();return;}
    return this.sendPositions(this.edgePositions(side,value),side==='top'?'bottom':'top');
  }

  render() {
    if (!this.config || !this.shadowRoot.querySelector('.window')) return;
    const icon = this.shadowRoot.querySelector('ha-state-icon');
    const entity = this._hass?.states[this.config.top_entity];
    icon.hass = this._hass;
    icon.stateObj = entity;
    // Let HA resolve device-class/state icons when the entity has no custom icon.
    icon.icon = this.movementIcon() || this.config.icon || entity?.attributes.icon || (entity ? undefined : 'mdi:blinds-horizontal');
    const p = this.displayPositions(), valid = this.ready();
    this.shadowRoot.querySelector('h2').textContent=this.cardTitle();
    for(const [selector,key] of [['.top','top_edge'],['.bottom','bottom_edge'],['.fabric-move','move'],['.stop','stop'],['.compact-open','open'],['.compact-stop','stop'],['.compact-close','close']]){
      const el=this.shadowRoot.querySelector(selector);el.setAttribute('aria-label',this.t(key));el.setAttribute('title',this.t(key));
    }
    for(const button of this.shadowRoot.querySelectorAll('[data-coverage]'))button.setAttribute('aria-label',button.dataset.coverage+'% '+this.t('covered'));
    this.shadowRoot.querySelector('.compact-actions').hidden=this.activeSize!=='compact';
    this.shadowRoot.querySelector('.compact-stop').disabled=!!this.setup;
    this.shadowRoot.querySelector('.stop').disabled=!!this.setup;
    this.shadowRoot.querySelector('.compact-open').disabled=!valid || !!this.busy;
    this.shadowRoot.querySelector('.compact-close').disabled=!valid || !!this.busy;
    this.shadowRoot.querySelector('.fabric-move').disabled=!valid || !!this.busy;
    const showButtons = this.config.show_buttons === true;
    this.shadowRoot.querySelector('.presets').hidden = !showButtons;
    this.shadowRoot.querySelector('ha-card').classList.toggle('buttons',showButtons);
    this.shadowRoot.querySelectorAll('[data-coverage]').forEach(button => { button.disabled = !valid || !!this.busy; });
    if(this.drag && valid)Object.assign(p,this.drag.positions);
    let top = p.top ?? 100, bottom = p.bottom ?? 0;
    // Conflicting telemetry collapses the fabric without disabling recovery.
    if(top<bottom){const middle=(top+bottom)/2;top=bottom=middle;}
    const track = this.shadowRoot.querySelector('.window');
    track.classList.toggle('follow', !this.drag);
    const fabric = this.shadowRoot.querySelector('.fabric');
    // Keep the 36px minimum fabric; each grip sits 9px from its end.
    const yTop = 18 + (100 - top) * (this.trackHeight() - 36) / 100;
    const yBottom = 18 + (100 - bottom) * (this.trackHeight() - 36) / 100;
    fabric.style.top = (yTop - 18) + 'px';
    fabric.style.height = Math.max(36, yBottom - yTop + 36) + 'px';
    const trackWidth=track.getBoundingClientRect().width;
    track.style.borderRadius=Math.min(36,trackWidth*36/130)+'px';
    const visualTop=yTop-9,visualBottom=yBottom+9;
    const tooltip = this.shadowRoot.querySelector('.tooltip');
    tooltip.hidden = !this.drag || !valid;
    if (!tooltip.hidden) {
      tooltip.textContent = this.drag.side==='both' ? p.bottom+'–'+p.top+'%' : p[this.drag.side] + '%';
      const rect=track.getBoundingClientRect();
      const tipWidth=tooltip.getBoundingClientRect().width || 52;
      const outsideRight=rect.right+8;
      const left=outsideRight+tipWidth<=window.innerWidth-8 ? outsideRight : Math.max(8,rect.left-tipWidth-8);
      tooltip.style.left=left+'px';
      tooltip.style.top = Math.max(24,Math.min(window.innerHeight-24,rect.top+(this.drag.side === 'both' ? (visualTop+visualBottom)/2 : this.drag.side === 'top' ? visualTop : visualBottom)))+'px';
    }
    this.shadowRoot.querySelector('.values').hidden = this.config.show_position !== true;
    fabric.style.opacity = valid || this.setup ? '1' : '.25';
    for (const side of ['top','bottom']) {
      const el = this.shadowRoot.querySelector('.' + side);
      el.style.top = (side === 'top' ? visualTop : visualBottom) + 'px';
      el.disabled = !valid || !!this.busy;
      el.setAttribute('aria-valuenow', p[side] ?? 0);
      el.setAttribute('aria-valuemin',0);
      el.setAttribute('aria-valuemax',100);
      el.setAttribute('aria-valuetext', p[side] === null ? this.t('unknown') : p[side] + '% '+this.t('height'));
    }
    this.shadowRoot.querySelector('.tv').textContent = p.top === null ? '—' : p.top + '%';
    this.shadowRoot.querySelector('.bv').textContent = p.bottom === null ? '—' : p.bottom + '%';
    const hasError=this.hasError();
    this.shadowRoot.querySelector('.summary').hidden = !hasError && !this.inModal && this.config.show_status === false;
    this.shadowRoot.querySelector('.summary').textContent = this.setup ? this.t('select_covers') : hasError ? this.t('error_status') : (Object.keys(this.session?.targets || {}).length ? this.t('target_pending')+': ' : '')+this.status(top, bottom, valid);
    this.updateInteractionState();
    this.updateResponsiveLayout(this.getBoundingClientRect().width);
    const labels = this.shadowRoot.querySelectorAll('.values span');
    const words = this.words();
    labels[0].textContent = words[1]; labels[1].textContent = words[2];
    this.shadowRoot.querySelector('.error').textContent=this.inModal ? this.errorText() : '';
  }
  getCardSize() { return {compact:2,small:4,medium:4,large:7}[this.activeSize || this.config?.size] || 4; }
  getGridOptions() {
    const size = this.config?.size || 'medium';
    return {columns: size === 'small' ? 3 : ['medium','compact'].includes(size) ? 6 : 12, rows: size === 'compact' ? 2 : 'auto', min_columns: size === 'small' ? 3 : 6};
  }
}
class PlisseCardEditor extends HTMLElement {
  constructor() {
    super();this.attachShadow({mode:'open'});
    const style=document.createElement('style');
    style.textContent='.controls-form{display:block;margin-top:24px} .layout-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(66px,1fr));gap:8px;padding:12px}.layout-choice{min-width:0;padding:6px;border:1px solid var(--divider-color);border-radius:8px;background:transparent;color:var(--primary-text-color);cursor:pointer}.layout-choice[aria-pressed=true]{border:2px solid var(--primary-color)}.layout-choice img{display:block;width:100%;max-height:76px;object-fit:contain}.layout-choice span{display:block;font-size:12px;margin-top:4px}.orientation{display:block;padding:0 12px 12px} ha-expansion-panel{display:block;margin-top:24px;--expansion-panel-content-padding:0;border-radius:var(--ha-border-radius-md,12px)}.content{padding:12px;display:grid;gap:16px}.tap-warning{color:var(--error-color,#db4437);margin:0;font-size:14px;line-height:1.5}[hidden]{display:none!important}ha-icon{color:var(--secondary-text-color)}';
    this.form=document.createElement('ha-form');
    this.layoutPanel=document.createElement('ha-expansion-panel');this.layoutPanel.setAttribute('outlined','');
    const layoutIcon=document.createElement('ha-icon');layoutIcon.setAttribute('slot','leading-icon');layoutIcon.icon='mdi:view-dashboard';
    this.layoutTitle=document.createElement('div');this.layoutTitle.setAttribute('slot','header');
    this.layoutGrid=document.createElement('div');this.layoutGrid.className='layout-grid';
    this.orientationForm=document.createElement('ha-form');this.orientationForm.className='orientation';
    this.layoutPanel.append(layoutIcon,this.layoutTitle,this.layoutGrid,this.orientationForm);
    this.controlsForm=document.createElement('ha-form');this.controlsForm.className='controls-form';
    this.tapForm=document.createElement('ha-form');this.otherActionsForm=document.createElement('ha-form');
    this.warning=document.createElement('p');this.warning.className='tap-warning';this.warning.setAttribute('role','status');
    this.panel=document.createElement('ha-expansion-panel');this.panel.setAttribute('outlined','');
    const icon=document.createElement('ha-icon');icon.setAttribute('slot','leading-icon');icon.icon='mdi:gesture-tap';
    this.panelTitle=document.createElement('div');this.panelTitle.setAttribute('slot','header');this.panelTitle.setAttribute('role','heading');this.panelTitle.setAttribute('aria-level','3');
    const content=document.createElement('div');content.className='content';content.append(this.tapForm,this.warning,this.otherActionsForm);
    this.panel.append(icon,this.panelTitle,content);this.shadowRoot.append(style,this.form,this.layoutPanel,this.controlsForm,this.panel);
    for(const form of [this.form,this.controlsForm,this.orientationForm,this.tapForm,this.otherActionsForm])form.addEventListener('value-changed',e=>{
      e.stopPropagation();this.config={...this.config,...e.detail.value};this.render();
      this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this.config},bubbles:true,composed:true}));
    });
  }
  setConfig(config) { this.config={...config};this.render(); }
  set hass(hass) { this._hass=hass;this.render(); }
  render() {
    if(!this.config || !this._hass)return;
    const lang=plisseLanguage(this._hass);
    if(this.lang!==lang){this.lang=lang;this.spec=PlisseCard.configForm(this._hass);}
    const actions=this.spec.schema.find(f=>f.name==='interactions').schema;
    const data={compact_orientation:'vertical',size:'medium',open_popup:true,show_status:true,show_position:false,show_buttons:false,invert_top:false,invert_bottom:false,...this.config,title:this.config.title ?? ''};
    for(const [form,schema] of [[this.form,this.spec.schema.slice(0,4)],[this.controlsForm,[this.spec.schema.find(f=>f.name==='controls')]],[this.orientationForm,[{name:'compact_orientation',selector:{select:{options:[{value:'vertical',label:plisseTranslate(this._hass,'vertical')},{value:'horizontal',label:plisseTranslate(this._hass,'horizontal')}]}}}]],[this.tapForm,actions.slice(0,1)],[this.otherActionsForm,actions.slice(1)]]){
      form.hass=this._hass;form.schema=schema;form.computeLabel=this.spec.computeLabel;form.computeHelper=this.spec.computeHelper;form.data=data;
    }
    this.layoutTitle.textContent=plisseTranslate(this._hass,'arrangement');
    this.orientationForm.hidden=data.size!=='compact';
    if(!this.layoutButtons){
      this.layoutButtons=[];
      const options=this.spec.schema.find(f=>f.name==='arrangement').schema[0].selector.select.options;
      for(const option of options){
        const button=document.createElement('button');button.type='button';button.className='layout-choice';
        const image=document.createElement('img');image.src=option.image.src;image.alt='';
        const label=document.createElement('span');label.textContent=option.label;button.append(image,label);
        button.addEventListener('click',()=>{this.config={...this.config,size:option.value};this.render();this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this.config},bubbles:true,composed:true}));});
        this.layoutGrid.append(button);this.layoutButtons.push({button,value:option.value});
      }
    }
    for(const {button,value} of this.layoutButtons)button.setAttribute('aria-pressed',String(value===data.size));
    this.panelTitle.textContent=plisseTranslate(this._hass,'interactions');
    this.warning.textContent=plisseTranslate(this._hass,'tap_warning');
    this.warning.hidden=!(data.open_popup===true && !!data.tap_action?.action);
  }
}
if (!customElements.get('plisse-card-editor')) customElements.define('plisse-card-editor',PlisseCardEditor);
if (!customElements.get('dual-cover-card')) customElements.define('dual-cover-card', PlisseCard);
// Existing dashboards can retain their old card type after switching resources.
if (!customElements.get('plisse-card')) customElements.define('plisse-card', class extends PlisseCard {});
window.customCards = window.customCards || [];
window.customCards.push({type:'dual-cover-card',name:'Dual Cover Card',description:'Top-down/bottom-up controls for blinds and shades with two covers.',preview:true,documentationURL:'https://github.com/ayzenquwe/dual-cover-card',getEntitySuggestion:(hass,entityId)=>entityId.startsWith('cover.') ? {config:{type:'custom:dual-cover-card',...PlisseCard.getStubConfig(),top_entity:entityId}} : null});
