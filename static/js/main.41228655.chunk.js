(this["webpackJsonpdhg-workflow"]=this["webpackJsonpdhg-workflow"]||[]).push([[0],{139:function(e,t,a){},140:function(e,t,a){},164:function(e,t,a){},274:function(e,t,a){},278:function(e,t,a){},316:function(e,t,a){},326:function(e,t,a){},329:function(e,t,a){},330:function(e,t,a){},331:function(e,t,a){"use strict";a.r(t);var n=a(1),o=a.n(n),c=a(17),i=a.n(c),l=(a(139),a(11)),r=(a(140),a(4)),s=a(26),d=a.n(s),u=a(119),h=a.n(u),b=a(120),p=a.n(b),y=a(54),j={width:"100px",height:"50px",shape:"rectangle",opacity:1,"background-color":"#e0f2f1","border-color":"#000","border-width":"1px","text-valign":"center","text-halign":"center"},f={"target-arrow-shape":"triangle",width:"1px","line-color":"#000","target-arrow-color":"#000"},g=[{selector:'node[type = "ordin"]',style:Object(r.a)(Object(r.a)({content:"data(label)"},j),{},{"z-index":100})},{selector:"edge",style:Object(r.a)({"curve-style":"bezier"},f)},{selector:"edge[label]",style:{label:"data(label)",width:3,"edge-text-rotation":"autorotate","z-index":999,"text-background-opacity":1,color:"#000","text-background-color":"#fff","text-background-shape":"roundrectangle","text-border-color":"#fff","text-border-width":2,"text-border-opacity":1}},{selector:".eh-handle",style:{"background-color":"#f00",height:20,width:20,opacity:.5}},{selector:'node[type="special"]',style:{width:10,height:10,backgroundColor:"red","z-index":1e3}},{selector:":selected",style:{"overlay-color":"#000","overlay-opacity":.1}}],O={style:Object(y.a)(g),zoomingEnabled:!0,userZoomingEnabled:!0,minZoom:.25,maxZoom:5},v=a(50),x=a(51),m=a(27),E=a(19),S=a(134),w=a(132),N=a(55),k=a(159)({$$typeof:"",Model_Open_Create_Node:"OpenModal_CreateNode",Model_Open_Create_Edge:"OpenModal_CreateEdge",Model_Open_Update_Edge:"OpenModal_UpdateEdge",Model_Open_Update_Node:"OpenModal_UpdateNode",Model_Close:"CloseModal",ELE_UNSELECTED:"ELE_UNSELECTED",ELE_SELECTED:"ELE_SELECTED",TURN_DRAW:"TURN_DRAW",SET_ZOOM:"SET_ZOOM",SET_PROJECT_DETAILS:"SET_PROJECT_DETAILS"}),C=(a(164),a(130)),I=a(3),_=function(e){var t=e.color,a=e.setColor,n=o.a.useState(!1),c=Object(l.a)(n,2),i=c[0],r=c[1];return Object(I.jsxs)("div",{role:"button",tabIndex:0,className:"color-box-par",onClick:function(){return!i&&r(!0)},onKeyDown:function(e){return 13===e.key&&!i&&r(!0)},children:[Object(I.jsx)("div",{className:"color-box",style:{background:t}}),Object(I.jsxs)("div",{className:"color-picker",style:{display:i?"block":"none"},children:[Object(I.jsx)("div",{role:"button",className:"overlay",onClick:function(){return r(!1)}}),Object(I.jsx)(C.a,{color:t,onChangeComplete:function(e){return a(e.hex)}})]})]})},D={height:"100px",minHeight:"100px",width:"auto",background:"aliceblue",display:"flex",justifyContent:"center",alignItems:"center",padding:"20px"},M={border:"1px solid black",width:"100px",height:"50px",backgroundColor:"#888",display:"inline-flex",justifyContent:"center",alignItems:"center",whiteSpace:"nowrap"},T=function(e){var t=e.data,a=e.setData,n=e.submit,o=e.labelAllowed,c=Object(r.a)(Object(r.a)({},M),{},{backgroundColor:t.style["background-color"],borderColor:t.style["border-color"],borderWidth:t.style["border-width"],textValign:t.style["text-valign"],textHalign:t.style["text-halign"],width:t.style.width,height:t.style.height,opacity:t.style.opacity,borderRadius:"ellipse"===t.style.shape?"100%":0}),i=Object(r.a)(Object(r.a)({},D),{},{height:t.style.height}),l=function(e){a(Object(r.a)(Object(r.a)({},t),{},{style:Object(r.a)(Object(r.a)({},t.style),e)}))};return Object(I.jsxs)("div",{className:"nodeform",onSubmit:n,children:[Object(I.jsx)("div",{style:i,children:Object(I.jsx)("div",{style:c,children:o?t.label:""})}),Object(I.jsxs)("div",{className:"form",style:{padding:20},children:[Object(I.jsx)("div",{children:" Shape"}),Object(I.jsx)("div",{children:Object(I.jsxs)("label",{htmlFor:"rectangle",children:[Object(I.jsx)("input",{type:"radio",name:"shape",value:"rectangle",checked:"rectangle"===t.style.shape,onChange:function(){return l({shape:"rectangle"})}}),"Rectangle"]})}),Object(I.jsx)("div",{children:Object(I.jsxs)("label",{htmlFor:"ellipse",children:[Object(I.jsx)("input",{type:"radio",name:"shape",value:"ellipse",checked:"ellipse"===t.style.shape,onChange:function(){return l({shape:"ellipse"})}}),"Ellipse"]})}),Object(I.jsx)("div",{}),o?Object(I.jsx)("div",{children:" Label"}):"",o?Object(I.jsx)("input",{className:"nodeLabel",type:"text",required:!0,label:"Node Label",value:t.label,placeholder:"Enter Node Label",onChange:function(e){return a(Object(r.a)(Object(r.a)({},t),{},{label:"".concat(e.target.value)}))}}):"",Object(I.jsx)("div",{children:" Width"}),Object(I.jsx)("input",{type:"number",value:t.style.width.slice(0,-2),onChange:function(e){return l({width:"".concat(Math.min(500,e.target.value),"px")})}}),Object(I.jsx)("div",{children:" Height"}),Object(I.jsx)("input",{type:"number",value:t.style.height.slice(0,-2),onChange:function(e){return l({height:"".concat(Math.min(200,e.target.value),"px")})}}),Object(I.jsx)("div",{children:" Background Color"}),Object(I.jsx)(_,{color:t.style["background-color"],setColor:function(e){return l({"background-color":e})}}),Object(I.jsx)("div",{children:" Border Color"}),Object(I.jsx)(_,{color:t.style["border-color"],setColor:function(e){return l({"border-color":e})}}),Object(I.jsx)("div",{children:" Border Width"}),Object(I.jsx)("input",{type:"number",value:t.style["border-width"].slice(0,-2),onChange:function(e){return l({"border-width":"".concat(Math.min(30,e.target.value),"px")})}}),Object(I.jsx)("div",{children:" Opacity"}),Object(I.jsx)("input",{type:"number",step:".01",value:t.style.opacity,onChange:function(e){return l({opacity:Math.min(1,Math.max(0,e.target.value))})}})]})]})},L=(a(274),{height:"100px",minHeight:"100px",width:"auto",background:"aliceblue",display:"flex",justifyContent:"center",alignItems:"center",padding:"20px"}),P={border:"none",width:"240px",height:"2px",backgroundColor:"#000",display:"inline-block"},A=function(e){var t=e.size,a=e.color,n=5*parseInt(t,10),o={borderLeft:"".concat(.8666*n,"px solid ").concat(a),borderBottom:"".concat(n/2,"px solid transparent"),borderTop:"".concat(n/2,"px solid transparent"),marginLeft:-1};return Object(I.jsx)("div",{style:o})},B=function(e){var t=e.data,a=e.setData,n=e.submit,o=e.labelAllowed,c=Object(r.a)(Object(r.a)({},P),{},{backgroundColor:t.style["line-color"],height:t.style.width}),i=Object(r.a)(Object(r.a)({},L),{},{height:t.style.height}),l=function(e){a(Object(r.a)(Object(r.a)({},t),{},{style:Object(r.a)(Object(r.a)({},t.style),e)}))};return Object(I.jsxs)("div",{className:"edgeform",onSubmit:n,children:[Object(I.jsxs)("div",{style:i,children:[Object(I.jsx)("div",{style:c}),Object(I.jsx)(A,{size:t.style.width.slice(0,-2),color:t.style["line-color"]}),Object(I.jsx)("div",{className:"label",children:t.label})]}),Object(I.jsxs)("div",{className:"form",children:[o?Object(I.jsx)("div",{children:" Label"}):"",o?Object(I.jsx)("input",{className:"edgeLabel",type:"text",required:!0,label:"Edge Label",value:t.label,placeholder:"Enter Edge Label",onChange:function(e){return a(Object(r.a)(Object(r.a)({},t),{},{label:"".concat(e.target.value)}))}}):"",Object(I.jsx)("div",{children:" Width"}),Object(I.jsx)("input",{type:"number",value:t.style.width.slice(0,-2),onChange:function(e){return l({width:"".concat(Math.max(0,Math.min(20,e.target.value)),"px")})}}),Object(I.jsx)("div",{children:" Background Color"}),Object(I.jsx)(_,{color:t.style["line-color"],setColor:function(e){return l({"line-color":e,"target-arrow-color":e})}})]})]})},z=function(e,t){switch(t.type){case k.Model_Open_Create_Node:return Object(r.a)(Object(r.a)({},e),{},{ModelOpen:!0,modalPayload:{title:"Create Node",submitText:"Create Node",Children:T,defaultStyle:j,defaultLabel:"",labelAllowed:!0,cb:t.cb}});case k.Model_Open_Create_Edge:return Object(r.a)(Object(r.a)({},e),{},{ModelOpen:!0,modalPayload:{title:"Create Edge",submitText:"Create Edge",Children:B,defaultStyle:f,defaultLabel:"",labelAllowed:!0,cb:t.cb}});case k.Model_Open_Update_Node:return Object(r.a)(Object(r.a)({},e),{},{ModelOpen:!0,modalPayload:{title:"Edit Node",submitText:"Edit Node",Children:T,defaultStyle:t.style,defaultLabel:t.label,labelAllowed:t.labelAllowed,cb:t.cb}});case k.Model_Open_Update_Edge:return Object(r.a)(Object(r.a)({},e),{},{ModelOpen:!0,modalPayload:{title:"Edit Edge",submitText:"Edit Edge",Children:B,defaultStyle:t.style,defaultLabel:t.label,labelAllowed:t.labelAllowed,cb:t.cb}});case k.Model_Close:return Object(r.a)(Object(r.a)({},e),{},{ModelOpen:!1});case k.ELE_SELECTED:return Object(r.a)(Object(r.a)({},e),{},{eleSelected:!0,eleSelectedPayload:t.payload});case k.ELE_UNSELECTED:return Object(r.a)(Object(r.a)({},e),{},{eleSelected:!1});case k.TURN_DRAW:return Object(r.a)(Object(r.a)({},e),{},{drawModeOn:t.payload});case k.SET_ZOOM:return Object(r.a)(Object(r.a)({},e),{},{zoomValue:t.payload});case k.SET_PROJECT_DETAILS:return Object(r.a)(Object(r.a)({},e),{},{projectDetails:t.payload});default:return e}},R={ModelOpen:!1,modalPayload:{cb:function(){},title:"",submitText:"",Children:"",defaultStyle:{},defaultLabel:"",labelAllowed:null},eleSelected:!1,drawModeOn:!0,zoomValue:100,projectDetails:{name:"",author:"",set:!1}},J={getEq:function(e,t){var a=(e.y-t.y)/(e.x-t.x);return[a,e.y-a*e.x]},getX1X2:function(e,t,a,n){if(e.x===t.x)return[t.x,t.x];var o={x:t.x-e.x,y:t.y-e.y},c=this.getEq({x:0,y:0},o),i=Object(l.a)(c,2),r=i[0],s=i[1],d=Math.pow(a,2)*Math.pow(r,2)+Math.pow(n,2),u=2*Math.pow(a,2)*r*s,h=Math.pow(a,2)*(Math.pow(s,2)-Math.pow(n,2)),b=Math.pow(u,2)-4*d*h;return[(-u+Math.pow(b,.5))/(2*d)+e.x,(-u-Math.pow(b,.5))/(2*d)+e.x]},getY1Y2:function(e,t,a,n,o,c){if(o===c)return[e.y+n,e.y-n];var i=this.getEq(e,t),r=Object(l.a)(i,2),s=r[0],d=r[1];return[s*o+d,s*c+d]},dist:function(e,t){return Math.pow(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2),.5)},getClosestEllipse:function(e,t,a,n){var o=this.getX1X2(e,t,a,n),c=Object(l.a)(o,2),i=c[0],r=c[1],s=this.getY1Y2(e,t,a,n,i,r),d=Object(l.a)(s,2),u=d[0],h=d[1],b=[this.dist(t,{x:i,y:u}),this.dist(t,{x:r,y:h})];return b[0]<b[1]?{x:i,y:u}:{x:r,y:h}},slope:function(e,t,a,n){return(e-a)/(t-n)},getClosestRect:function(e,t,a,n){var o,c,i=[[e.x+a,e.y+n],[e.x+a,e.y-n]].map((function(a){var n=Object(l.a)(a,2),o=n[0],c=n[1];return(e.x-o)*(t.y-c)-(e.y-c)*(t.x-o)})),r=Object(l.a)(i,2),s=r[0],d=r[1],u=this.getEq(t,e),h=Object(l.a)(u,2),b=h[0],p=h[1],y=[[(e.y-n-p)/b,e.y-n],[e.x+a,b*(e.x+a)+p],[e.x-a,b*(e.x-a)+p],[(e.y+n-p)/b,e.y+n]];if(s<=0&&d<=0){var j=Object(l.a)(y[3],2);o=j[0],c=j[1]}else if(s>=0&&d<=0){var f=Object(l.a)(y[1],2);o=f[0],c=f[1]}else if(s>=0&&d>=0){var g=Object(l.a)(y[0],2);o=g[0],c=g[1]}else if(s<=0&&d>=0){var O=Object(l.a)(y[2],2);o=O[0],c=O[1]}return o&&c?{x:o,y:c}:t},getClosest:function(e,t,a,n,o){return"rectangle"===o?this.getClosestRect(e,t,a,n):this.getClosestEllipse(e,t,a,n)}},G=new(function(e){Object(S.a)(a,e);var t=Object(w.a)(a);function a(){return Object(v.a)(this,a),t.apply(this,arguments)}return Object(x.a)(a,[{key:"addTestData",value:function(){return this.addNode("A",{},"ordin",{x:100,y:100}),this.addNode("B",{},"ordin",{x:500,y:100}),this}},{key:"getRealNode",value:function(e){return this.getById(e).incomers().filter("node")[0]}},{key:"addAutoMove",value:function(e){return e.unselectify(),this}},{key:"setNodeEvent",value:function(e){return e.on("drag style",(function(){e.connectedEdges().connectedNodes('node[type="special"]').forEach((function(e){e.position(a.calcPos(e))}))})),this}},{key:"addEdgeWithJuncNode",value:function(e,t){var n=this.getById(e),o=Object(m.a)(Object(E.a)(a.prototype),"addEdge",this).call(this,e,t,n.data("edgeLabel"),n.data("edgeStyle"));return n.position(a.calcPos(n)),o}},{key:"addEdgeWithoutJuncNode",value:function(e,t,n,o){var c=this.getById(e),i=this.getById(t),l=c.style(),s=J.getClosest(c.position(),i.position(),parseInt(l.width.slice(0,-2),10)/2,parseInt(l.height.slice(0,-2),10)/2,l.shape),d=Object(m.a)(Object(E.a)(a.prototype),"addNode",this).call(this,"",{"background-color":o["line-color"]},"special",s,{edgeLabel:n,edgeStyle:o});return Object(m.a)(Object(E.a)(a.prototype),"addEdge",this).call(this,e,d.id(),"",Object(r.a)(Object(r.a)({},o),{},{"target-arrow-shape":"none"}),"special"),this.addAutoMove(d,c),this.addEdgeWithJuncNode(d.id(),t)}},{key:"addEdge",value:function(e,t){var a=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",o=arguments.length>3?arguments[3]:void 0,c=this.getById(e);if("special"===c.data("type"))return this.addEdgeWithJuncNode(e,t);var i=c.outgoers("node").filter((function(e){return e.data("edgeLabel")===n}));return i.length?this.addEdgeWithJuncNode(i[0].id(),t):n.length?this.addEdgeWithoutJuncNode(e,t,n,o):(this.dispatcher({type:k.Model_Open_Create_Edge,cb:function(n,o){return a.addEdgeWithoutJuncNode(e,t,n,o)}}),this)}},{key:"updateEdge",value:function(e,t,n,o){var c=this,i=this.getById(e).source();o&&this.updateData(i.data("id"),"edgeLabel",n),this.updateData(i.data("id"),"edgeStyle",t),this.updateNode([i.data("id")],{"background-color":t["line-color"]},"",!1),i.outgoers("edge").forEach((function(e){return Object(m.a)(Object(E.a)(a.prototype),"updateEdge",c).call(c,e.data("id"),t,n,o)}))}},{key:"deleteElem",value:function(e){var t=this,n=this.getById(e);if(n.isNode())n.outgoers().forEach((function(e){return Object(m.a)(Object(E.a)(a.prototype),"deleteElem",t).call(t,e.id())})),n.connectedEdges().forEach((function(e){return t.deleteElem(e.id())})),Object(m.a)(Object(E.a)(a.prototype),"deleteNode",this).call(this,e);else{var o=n.source();Object(m.a)(Object(E.a)(a.prototype),"deleteEdge",this).call(this,e),0===o.outgoers().length&&this.deleteNode(o.id())}}},{key:"getRealSourceId",value:function(e){return this.getById(e).incomers("node")[0].id()}}],[{key:"calcPos",value:function(e){var t=e.incomers("node")[0],a={x:0,y:0},n=new Set;return e.outgoers("node").forEach((function(e){return n.add(JSON.stringify(e.position()))})),n.forEach((function(e){var t=JSON.parse(e);a.x+=t.x,a.y+=t.y})),0===n.size?a:(a.x/=n.size,a.y/=n.size,J.getClosest(t.position(),a,parseInt(t.style().width.slice(0,-2),10)/2,parseInt(t.style().height.slice(0,-2),10)/2,t.style().shape))}}]),a}(function(){function e(){Object(v.a)(this,e)}return Object(x.a)(e,[{key:"getById",value:function(e){return this.cy.getElementById(e)}},{key:"addTestData",value:function(){return this}},{key:"setCy",value:function(e){var t=this;this.cy=e,this.autoSaveIntervalId=null,window.cyx=e;var a=function(){var e,a=t.cy.$(":selected");if(0===a.length)return t.dispatcher({type:k.ELE_UNSELECTED});e=a.every((function(e){return e.isNode()}))?"NODE":a.every((function(e){return e.isEdge()}))?"EDGE":"MIX";var n=a.map((function(e){return e.data("id")}));return t.dispatcher({type:k.ELE_SELECTED,payload:{ids:n,type:e}})};this.cy.on("select",a),this.cy.on("unselect",a),this.cy.on("zoom",(function(e){t.dispatcher({type:k.SET_ZOOM,payload:Math.round(100*e.target.zoom())})})),this.cy.on("nodeediting.resizeend",(function(e,t,a){a.scratch("automove")&&a.scratch("automove").forEach((function(e){return e()}))})),this.cy.on("position",this.saveLocalStorage.bind(this))}},{key:"setDispatcher",value:function(e){this.dispatcher=e}},{key:"setSuperState",value:function(e){this.superState=e}},{key:"getPos",value:function(){for(var e={x:100,y:100},t=!0;t;){t=!1;for(var a=this.cy.$("node"),n=0;n<a.length;n+=1){var o=a[n].position();t=t||o.x===e.x&&o.y===e.y}t&&(e.x+=10,e.y+=10)}return e}},{key:"addNode",value:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"ordin",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:this.getPos(),o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{},c=this.cy.add({group:"nodes",data:Object(r.a)({label:e,type:a},o),style:t,position:n});return this.setNodeEvent(c),this.saveLocalStorage(),c}},{key:"addEdge",value:function(e,t,a){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"ordin";return this.saveLocalStorage(),this.cy.add({group:"edges",data:{source:e,target:t,label:a,type:o},style:n})}},{key:"getStyle",value:function(e){var t=this.getById(e),a=t.style(),n={};return t.isNode&&Object.entries(j).forEach((function(e){n[e[0]]=a[e[0]]})),t.isEdge&&Object.entries(f).forEach((function(e){n[e[0]]=a[e[0]]})),n}},{key:"getLabel",value:function(e){return this.getById(e).data("label")||this.getById(e).data("label")}},{key:"updateNode",value:function(e,t,a,n){this.saveLocalStorage(),n&&this.getById(e).data("label",a),this.getById(e).style(t)}},{key:"updateEdge",value:function(e,t,a,n){this.saveLocalStorage(),n&&this.getById(e).data("label",a),this.getById(e).style(t)}},{key:"updateData",value:function(e,t,a){return this.saveLocalStorage(),this.getById(e).data(t,a),this}},{key:"modifyNewEdge",value:function(){return this}},{key:"enableDraw",value:function(e){return e?window.cye.enable():window.cye.disable(),this}},{key:"deleteNode",value:function(e){var t=this,a=this.getById(e);a.connectedEdges().forEach((function(e){return t.deleteEdge(e.id())})),a.remove()}},{key:"deleteEdge",value:function(e){this.getById(e).remove()}},{key:"deleteElem",value:function(e){return this.saveLocalStorage(),this.getById(e).isNode()?this.deleteNode(e):this.deleteEdge(e)}},{key:"resetZoom",value:function(){this.cy.reset()}},{key:"fitZoom",value:function(){this.cy.fit()}},{key:"setZoom",value:function(e){this.cy.zoom(e/100)}},{key:"downloadImg",value:function(e){"PNG"===e&&Object(N.saveAs)(this.cy.png(),"".concat(this.superState.projectDetails.name,"-").concat(this.superState.projectDetails.author,"-DHGWorkflow.png")),"JPG"===e&&Object(N.saveAs)(this.cy.jpg(),"".concat(this.superState.projectDetails.name,"-").concat(this.superState.projectDetails.author,"-DHGWorkflow.jgp"))}},{key:"shouldNodeBeSaved",value:function(e){return"ordin"===this.getById(e).data("type")}},{key:"shouldEdgeBeSaved",value:function(e){return"ordin"===this.getById(e).data("type")}},{key:"getRealSourceId",value:function(e){return e}},{key:"jsonifyGraph",value:function(){var e=this,t={nodes:[],edges:[],projectDetails:this.superState.projectDetails};return this.cy.nodes().forEach((function(a){if(e.shouldNodeBeSaved(a.id())){var n=a.json(),o={label:n.data.label,id:n.data.id,position:n.position};o.style=e.getStyle(a.id()),t.nodes.push(o)}})),this.cy.edges().forEach((function(a){if(e.shouldEdgeBeSaved(a.id())){var n=a.json(),o={source:e.getRealSourceId(a.source().id()),target:n.data.target,label:n.data.label};o.style=e.getStyle(a.id()),t.edges.push(o)}})),t}},{key:"saveToDisk",value:function(){var e=JSON.stringify(this.jsonifyGraph()),t=(new TextEncoder).encode(e),a=new Blob([t],{type:"application/json;charset=utf-8"});Object(N.saveAs)(a,"".concat(this.superState.projectDetails.name,"-").concat(this.superState.projectDetails.author,"-DHGWorkflow.json"))}},{key:"loadJson",value:function(e){var t=this;this.clearAll(),e.nodes.forEach((function(e){t.addNode(e.label,e.style,"ordin",e.position,{id:e.id})})),e.edges.forEach((function(e){t.addEdge(e.source,e.target,e.label,e.style)})),this.dispatcher({type:k.SET_PROJECT_DETAILS,payload:e.projectDetails})}},{key:"saveLocalStorage",value:function(){var e=this;null!==this.autoSaveTimeoutId&&clearTimeout(this.autoSaveIntervalId),this.autoSaveIntervalId=setTimeout((function(){var t=e.jsonifyGraph(),a=JSON.stringify(t);window.localStorage.setItem("serializedGraph",window.btoa(a)),console.log("Saving graph locally")}),1e3)}},{key:"loadGraphFromLocalStorage",value:function(){return null!==window.localStorage.getItem("serializedGraph")&&(this.loadJson(JSON.parse(window.atob(window.localStorage.getItem("serializedGraph")))),!0)}},{key:"clearAll",value:function(){return(0===this.cy.elements().length||window.confirm("Do want clear all elements?"))&&this.cy.elements().remove(),this.saveLocalStorage(),0===this.cy.elements().length}}]),e}())),W=a(131),Z=a(81),U=(a(277),a(278),O.minZoom),q=O.maxZoom,F={},H=function(e){var t=e.dispatcher,a=e.superState;return Object(I.jsx)("div",{children:Object(I.jsxs)("div",{className:"zoom-comp",children:[Object(I.jsx)("div",{role:"button",tabIndex:0,className:"zoom-box zoom-btn",onClick:function(){return G.resetZoom()},onKeyDown:function(e){return 13===e.key&&G.resetZoom()},children:Object(I.jsx)(Z.b,{})}),Object(I.jsx)("div",{role:"button",tabIndex:0,className:"zoom-box zoom-btn",onClick:function(){return G.fitZoom()},onKeyDown:function(e){return 13===e.key&&G.resetZoom()},children:Object(I.jsx)(Z.a,{})}),Object(I.jsxs)("div",{className:"zoom-box zoom-value",children:[a.zoomValue,"%"]}),Object(I.jsx)("div",{className:"slider",children:Object(I.jsx)(W.a,{min:100*U,max:100*q,marks:F,onChange:function(e){G.setZoom(e),t({type:k.SET_ZOOM,payload:e})},included:!1,value:a.zoomValue})})]})})},V=a(127),X=a.n(V),K=a(128),$=a.n(K),Y=a(129),Q=a.n(Y),ee=function(e){var t=o.a.createRef(),a=o.a.createRef(),c=e.dispatcher,i=e.superState;return Object(n.useEffect)((function(){G.setSuperState(i)}),[i]),Object(n.useEffect)((function(){"function"!==typeof d()("core","edgehandles")&&d.a.use(h.a),"function"!==typeof d()("core","nodeEditing")&&$()(d.a,Q.a,X.a),"function"!==typeof d()("core","gridGuide")&&p()(d.a),a.current.style.width=t.current.offsetWidth+"px",a.current.style.height=t.current.offsetHeight+"px";var e=d()(Object(r.a)(Object(r.a)({},O),{},{container:a.current}));e.nodeEditing({resizeToContentCueEnabled:function(){return!1},setWidth:function(e,t){"special"!=e.data("type")&&e.css("width",t)},setHeight:function(e,t){"special"!=e.data("type")&&e.css("height",t)},isNoResizeMode:function(e){return"special"===e.data("type")},isNoControlsMode:function(e){return"special"===e.data("type")}}),e.gridGuide({snapToGridOnRelease:!1}),G.setCy(e),G.setDispatcher(c),window.cye=e.edgehandles({preview:!1,handlePosition:function(){return"none"},complete:function(e,t,a){a.remove(),G.addEdge(e.id(),t.id())}}),G.loadGraphFromLocalStorage()||G.addTestData(),window.xxx=G}),[]),Object(I.jsxs)("div",{className:"graph-container",style:{flex:1},ref:t,children:[Object(I.jsx)("div",{style:{zIndex:1},id:"cy",ref:a}),Object(I.jsx)(H,{dispatcher:c,superState:i})]})},te=(a(316),a(82)),ae=a.n(te);a(326);ae.a.setAppElement("#root");var ne=function(e){var t=e.closeModal,a=e.ModelOpen,o=e.title,c=e.children,i=Object(n.useState)(""),r=Object(l.a)(i,2),s=r[0],d=r[1],u=Object(n.useState)(a),h=Object(l.a)(u,2),b=h[0],p=h[1];return Object(n.useEffect)((function(){!0===a?(p(!0),d("closing"),setTimeout((function(){d("")}),20)):(d("closing"),setTimeout((function(){p(!1)}),400))}),[a]),b?Object(I.jsx)(ae.a,{isOpen:b,contentLabel:"onRequestClose Example",onRequestClose:t,className:"Modal",overlayClassName:"Overlay ".concat(s),children:Object(I.jsxs)("div",{className:"modal-content ".concat(s),children:[Object(I.jsxs)("div",{className:"modal-header",children:[Object(I.jsx)("div",{className:"modal-title h4",children:o}),Object(I.jsxs)("button",{type:"button",className:"close",onClick:t,children:[t?Object(I.jsx)("span",{"aria-hidden":"true",children:"\xd7"}):"",Object(I.jsx)("span",{className:"sr-only",children:"Close"})]})]}),c]})}):""},oe=function(e){var t=e.closeModal,a=e.superState,o=Object(n.useState)({}),c=Object(l.a)(o,2),i=c[0],r=c[1],s=a.modalPayload,d=a.ModelOpen,u=s.cb,h=s.title,b=s.submitText,p=s.Children,y=s.defaultStyle,j=s.defaultLabel,f=s.labelAllowed;Object(n.useEffect)((function(){r({label:j||"",style:y})}),[j,y]);return Object(I.jsx)(ne,{closeModal:t,ModelOpen:d,title:h,children:Object(I.jsxs)("form",{onSubmit:function(e){e.preventDefault(),u(i.label,i.style),t()},children:[Object(I.jsx)("div",{className:"modal-content-body",children:Object(I.jsx)(p,{data:i,setData:r,labelAllowed:f})}),Object(I.jsx)("div",{className:"modal-footer",children:Object(I.jsx)("button",{type:"submit",className:"btn btn-primary",children:b})})]})})},ce=a(133),ie=(a(327),a(38)),le=a(21),re=function(e,t){t({type:k.Model_Open_Create_Node,cb:function(e,t){G.addNode(e,t)}})},se=function(e,t){var a=1===e.eleSelectedPayload.ids.length;"NODE"===e.eleSelectedPayload.type&&t({type:k.Model_Open_Update_Node,cb:function(t,n){return e.eleSelectedPayload.ids.forEach((function(e){return G.updateNode(e,n,t,a)}))},labelAllowed:a,label:G.getLabel(e.eleSelectedPayload.ids[0]),style:G.getStyle(e.eleSelectedPayload.ids[0])}),"EDGE"===e.eleSelectedPayload.type&&t({type:k.Model_Open_Update_Edge,cb:function(t,n){return e.eleSelectedPayload.ids.forEach((function(e){return G.updateEdge(e,n,t,a)}))},labelAllowed:a,label:G.getLabel(e.eleSelectedPayload.ids[0]),style:G.getStyle(e.eleSelectedPayload.ids[0])})},de=function(e){e.eleSelectedPayload.ids.forEach((function(e){return G.deleteElem(e)}))},ue=function(e,t,a){G.downloadImg(a)},he=function(){G.saveToDisk()},be=function(e){if(e.target&&e.target.files&&e.target.files[0]){var t=new FileReader;t.onload=function(e){G.loadJson(JSON.parse(e.target.result))},t.readAsText(e.target.files[0])}},pe=function(e,t){G.clearAll()&&t({type:k.SET_PROJECT_DETAILS,payload:R.projectDetails})},ye=function(){G.clearAll()},je=function(e,t){t({type:k.SET_PROJECT_DETAILS,payload:Object(r.a)(Object(r.a)({},e.projectDetails),{},{set:!1})})},fe=function(e){return alert(e)},ge=function(e){return[{type:"action",text:"Node",icon:le.e,action:re,active:!0},{type:"vsep"},{type:"action",text:"New",icon:le.d,action:pe,active:!0},{type:"action",text:"Clear",icon:le.f,action:ye,active:!0},{type:"action",text:"Details",icon:le.k,action:je,active:!0},{type:"vsep"},{type:"file-upload",text:"Open",icon:le.c,action:be,active:!0},{type:"action",text:"Save",icon:le.h,action:he,active:!0},{type:"vsep"},{type:"action",text:"Undo",icon:le.j,action:fe,active:!1},{type:"action",text:"Redo",icon:le.g,action:fe,active:!1},{type:"vsep"},{type:"action",text:"Edit",icon:le.b,action:se,active:e.eleSelected&&"MIX"!==e.eleSelectedPayload.type},{type:"action",text:"Delete",icon:le.i,action:de,active:e.eleSelected},{type:"vsep"},{type:"space"},{type:"menu",text:"Download",icon:le.a,action:ue,active:!0},{type:"vsep"}]};a(328),a(329);function Oe(e){var t=e.Icon,a=e.text,n=e.action,o=e.active,c=e.tabIndex;return Object(I.jsxs)(ie.a,{menuButton:Object(I.jsx)(ie.b,{children:Object(I.jsx)(me,{Icon:t,text:a,action:n,active:o,tabIndex:c})}),children:[Object(I.jsx)(ie.c,{onClick:function(){return n("JPG")},children:"JPG"}),Object(I.jsx)(ie.c,{onClick:function(){return n("PNG")},children:"PNG"})]})}var ve=function(e){var t=e.Icon,a=e.text,n=e.action,c=e.active,i=e.tabIndex,l=o.a.createRef();return Object(I.jsxs)(I.Fragment,{children:[Object(I.jsx)("input",{type:"file",ref:l,style:{display:"none"},accept:".json",onChange:n}),Object(I.jsx)(me,{Icon:t,text:a,active:c,tabIndex:i,action:function(){return l.current.click()}})]})},xe=function(e){var t=e.text,a=e.action,n=e.active,o=e.tabIndex;return Object(I.jsxs)("div",{role:"button",tabIndex:o,className:"tool ".concat(n?"active":""),onClick:a,onKeyDown:function(e){return 13===e.key&&a()},children:[Object(I.jsx)(ce.a,{onChange:a,checked:n,className:"react-switch"}),Object(I.jsx)("div",{children:t})]})},me=function(e){var t=e.Icon,a=e.text,n=e.action,o=e.active,c=e.tabIndex;return Object(I.jsxs)("div",{role:"button",tabIndex:c,className:"tool ".concat(o?"active":""),onClick:function(){return o&&n()},onKeyDown:function(e){return 13===e.key&&n()},children:[Object(I.jsx)("div",{className:"icon",children:Object(I.jsx)(t,{size:"25"})}),Object(I.jsx)("div",{style:{fontSize:16},children:a})]})},Ee=function(){return Object(I.jsx)("div",{className:"Vsep sep"})},Se=function(){return Object(I.jsx)("div",{className:"hsep sep"})},we=function(){return Object(I.jsx)("div",{className:"space"})},Ne=function(e){var t=e.title,a=e.state,n=e.dispatcher;return Object(I.jsxs)("header",{className:"header",children:[Object(I.jsx)("section",{className:"middle titlebar",children:t?"".concat(t," - DHGWorkflow Editor"):""}),Object(I.jsxs)("section",{className:"toolbar",children:[ge(a,n).map((function(e,t){return"vsep"===e.type?Object(I.jsx)(Ee,{},"".concat("v".concat(t))):"space"===e.type?Object(I.jsx)(we,{},"".concat("s".concat(t))):"switch"===e.type?Object(I.jsx)(xe,{text:e.text,active:e.active,action:function(){return e.action(a,n)},tabIndex:t+1},e.text):"menu"===e.type?Object(I.jsx)(Oe,{Icon:e.icon,text:e.text,active:e.active,action:function(t){return e.action(a,n,t)},tabIndex:t+1},e.text):"file-upload"===e.type?Object(I.jsx)(ve,{Icon:e.icon,text:e.text,active:e.active,action:function(t){return e.action(t,a,n)},tabIndex:t+1},e.text):Object(I.jsx)(me,{Icon:e.icon,text:e.text,active:e.active,action:function(){return e.action(a,n)},tabIndex:t+1},e.text)})),Object(I.jsx)("input",{type:"file",id:"fileUploader",style:{display:"none"},accept:".jpg, .jpeg, .png"})]}),Object(I.jsx)(Se,{})]})},ke=(a(330),function(e){var t=e.superState,a=e.dispatcher;return Object(I.jsx)(ne,{ModelOpen:!t.projectDetails.set,title:"Project Details",children:Object(I.jsxs)("form",{className:"proj-details",onSubmit:function(e){e.preventDefault(),a({type:k.SET_PROJECT_DETAILS,payload:Object(r.a)(Object(r.a)({},t.projectDetails),{},{set:!0})}),G.saveLocalStorage()},children:[Object(I.jsx)("span",{children:"Workflow Name"}),Object(I.jsx)("input",{placeholder:"Title of workflow",required:!0,value:t.projectDetails.name,onChange:function(e){a({type:k.SET_PROJECT_DETAILS,payload:Object(r.a)(Object(r.a)({},t.projectDetails),{},{name:e.target.value})})}}),Object(I.jsx)("span",{children:"Author"}),Object(I.jsx)("input",{placeholder:"Author of workflow",required:!0,value:t.projectDetails.author,onChange:function(e){a({type:k.SET_PROJECT_DETAILS,payload:Object(r.a)(Object(r.a)({},t.projectDetails),{},{author:e.target.value})})}}),Object(I.jsxs)("div",{className:"expand",children:[Object(I.jsx)("button",{type:"submit",className:"btn btn-primary",children:"Save"}),Object(I.jsx)("div",{className:"divider"}),Object(I.jsx)("button",{type:"button",className:"btn btn-secondary",onClick:function(){document.querySelector('input[type="file"]').click()},children:"Open Existing"})]})]})})}),Ce=function(){var e=Object(n.useReducer)(z,R),t=Object(l.a)(e,2),a=t[0],o=t[1];return Object(I.jsxs)("div",{className:"container",children:[Object(I.jsx)(ke,{superState:a,dispatcher:o}),Object(I.jsx)(oe,{closeModal:function(){return o({type:k.Model_Close})},superState:a}),Object(I.jsx)(Ne,{title:a.projectDetails.name,state:a,dispatcher:o}),Object(I.jsx)("section",{className:"body",style:{display:"flex"},children:Object(I.jsx)(ee,{dispatcher:o,superState:a})})]})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var Ie=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,333)).then((function(t){var a=t.getCLS,n=t.getFID,o=t.getFCP,c=t.getLCP,i=t.getTTFB;a(e),n(e),o(e),c(e),i(e)}))};i.a.render(Object(I.jsx)(o.a.StrictMode,{children:Object(I.jsx)(Ce,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)})),Ie()}},[[331,1,2]]]);
//# sourceMappingURL=main.41228655.chunk.js.map