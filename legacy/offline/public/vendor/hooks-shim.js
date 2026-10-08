/* Lightweight hook dispatcher for self-contained React 16.0 UMD runtime.
 * Allows modern hook-style state and effects without network dependencies.
 * In a normal npm/React 18+ project, remove this file and use React hooks directly.
 */
(function(){
  React.Fragment=React.Fragment||function Fragment(props){return React.createElement('g',null,props.children)};
  let current=null;
  const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((x,i)=>Object.is(x,b[i]));
  function slot(create){if(!current)throw new Error('Hook called outside component render');const n=current.nextIndex++;if(!current.hooks[n])current.hooks[n]=create();return [current,current.hooks[n],n]}
  function useState(initial){const [instance,s]=slot(()=>({kind:'state',value:typeof initial==='function'?initial():initial}));
   if(!s.setter)s.setter=function(update){const next=typeof update==='function'?update(s.value):update;if(Object.is(next,s.value))return;s.value=next;if(instance.mounted)instance.forceUpdate();};
   return [s.value,s.setter];
  }
  function useRef(initial){const [instance,s]=slot(()=>({kind:'ref',ref:{current:initial}}));return s.ref;}
  function useMemo(fn,deps){const [instance,s]=slot(()=>({kind:'memo',first:true,value:undefined,deps:null}));if(s.first||!equal(s.deps,deps)){s.value=fn();s.deps=deps;s.first=false;}return s.value;}
  function useEffect(callback,deps){const [instance,s]=slot(()=>({kind:'effect',first:true,deps:null,cleanup:null}));if(s.first||!equal(s.deps,deps)){instance.runEffects.push(()=>{if(typeof s.cleanup==='function')s.cleanup();s.cleanup=callback();});s.deps=deps;s.first=false;}}
  function withHooks(Component){return class HookWrapper extends React.Component{
    constructor(props){super(props);this.hooks=[];this.nextIndex=0;this.runEffects=[];this.mounted=false;}
    render(){const before=current;current=this;this.nextIndex=0;this.runEffects=[];let element;try{element=Component(this.props)}finally{current=before;}return element;}
    componentDidMount(){this.mounted=true;this.flush();}
    componentDidUpdate(){this.flush();}
    flush(){const jobs=this.runEffects.splice(0);jobs.forEach(fn=>fn());}
    componentWillUnmount(){this.mounted=false;this.hooks.forEach(s=>{if(s.kind==='effect'&&typeof s.cleanup==='function')s.cleanup();});}
   }}
  window.HOOKS={useState,useMemo,useRef,useEffect,withHooks};
})();
