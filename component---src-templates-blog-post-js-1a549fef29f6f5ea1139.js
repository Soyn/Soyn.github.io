(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{174:function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),o=(a(161),function(){return r.a.createElement("hr",{className:"custom-hr"})}),i=a(187),c=a(183),u=function(t){var e=t.title;return r.a.createElement("h1",null,e)},s=function(t){var e=t.html;return r.a.createElement("div",{dangerouslySetInnerHTML:{__html:e}})},l=(a(162),a(163),a(164),a(165),a(197)),m=a(176),d=(a(166),function(t){var e=t.pageContext,a=e.previous,n=e.next;return r.a.createElement("ul",{className:"navigator"},r.a.createElement("li",null,a&&r.a.createElement(m.a,{to:a.fields.slug,rel:"prev"},"← ",a.frontmatter.title)),r.a.createElement("li",null,n&&r.a.createElement(m.a,{to:n.fields.slug,rel:"next"},n.frontmatter.title," →")))}),f=a(35),h=a.n(f),p=a(7),g=a.n(p),b=a(240),E=a.n(b),v=function(t){function e(e){var a;return(a=t.call(this,e)||this).state={toasts:[]},a.notifyAboutComment=a.notifyAboutComment.bind(h()(a)),a.onSnackbarDismiss=a.onSnackbarDismiss.bind(h()(a)),a}g()(e,t);var a=e.prototype;return a.onSnackbarDismiss=function(){var t=this.state.toasts.slice(1);this.setState({toasts:t})},a.notifyAboutComment=function(){var t=this.state.toasts.slice();t.push({text:"New comment available!!"}),this.setState({toasts:t})},a.render=function(){var t=this.props,e=t.post,a=t.shortName,n=t.siteUrl+t.slug;return r.a.createElement(E.a,{shortname:a,identifier:e.frontmatter.title,title:e.frontmatter.title,url:n,category_id:e.frontmatter.category_id,onNewComment:this.notifyAboutComment})},e}(n.Component),w=(a(77),a(56),a(36),a(242),function(t){var e=t.repo,a=r.a.createRef();return Object(n.useEffect)(function(){var t=document.createElement("script"),n={src:"https://utteranc.es/client.js",repo:e,branch:"master",async:!0,"issue-term":"pathname",crossorigin:"anonymous"};Object.keys(n).forEach(function(e){t.setAttribute(e,n[e])}),a.current.appendChild(t)},[]),r.a.createElement("div",{className:"utterences",ref:a})}),y=a(202);a(167);a.d(e,"pageQuery",function(){return A});e.default=function(t){var e=t.data,a=t.pageContext,m=t.location;Object(n.useEffect)(function(){return y.c(),function(){return y.a()}},[]);var f=e.markdownRemark,h=e.site.siteMetadata,p=h.title,g=h.comment,b=h.siteUrl,E=(h.author,h.sponsor,g.disqusShortName),A=g.utterances;return r.a.createElement(i.a,{location:m,title:p},r.a.createElement(c.a,{title:f.frontmatter.title,description:f.excerpt}),r.a.createElement(u,{title:f.frontmatter.title}),r.a.createElement(s,{html:f.html}),r.a.createElement(o,null),r.a.createElement(l.a,null),r.a.createElement(d,{pageContext:a}),!!E&&r.a.createElement(v,{post:f,shortName:E,siteUrl:b,slug:a.slug}),!!A&&r.a.createElement(w,{repo:A}))};var A="1559320954"},176:function(t,e,a){"use strict";a.d(e,"b",function(){return l});var n=a(0),r=a.n(n),o=a(4),i=a.n(o),c=a(33),u=a.n(c);a.d(e,"a",function(){return u.a});a(179);var s=r.a.createContext({}),l=function(t){return r.a.createElement(s.Consumer,null,function(e){return t.data||e[t.query]&&e[t.query].data?(t.render||t.children)(t.data?t.data.data:e[t.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};l.propTypes={data:i.a.object,query:i.a.string.isRequired,render:i.a.func,children:i.a.func}},178:function(t,e,a){"use strict";var n={ALL:"All"},r={LIGHT:"light",DARK:"dark"};a.d(e,"c",function(){return"Home"}),a.d(e,"a",function(){return n}),a.d(e,"d",function(){return r}),a.d(e,"b",function(){return"en"})},179:function(t,e,a){var n;t.exports=(n=a(182))&&n.default||n},180:function(t,e,a){"use strict";a.d(e,"a",function(){return u});var n=a(188),r=a.n(n),o=a(189),i=a.n(o);i.a.overrideThemeStyles=function(){return{a:{boxShadow:"none",textDecoration:"none",color:"#0687f0"},"a.gatsby-resp-image-link":{boxShadow:"none",textDecoration:"none"},"a:hover":{textDecoration:"none"},h1:{fontWeight:800,lineHeight:1.2,fontFamily:"Catamaran"},h2:{fontWeight:700,lineHeight:1.2,marginTop:"56px",marginBottom:"20px",fontFamily:"Catamaran"},ul:{marginBottom:"6px"},li:{marginBottom:"2px"}}};var c=new r.a(i.a);var u=c.rhythm;c.scale},181:function(t,e,a){"use strict";a.d(e,"e",function(){return n}),a.d(e,"d",function(){return r}),a.d(e,"a",function(){return o}),a.d(e,"b",function(){return c}),a.d(e,"g",function(){return u}),a.d(e,"f",function(){return s}),a.d(e,"c",function(){return l});var n=function(t){return document.querySelectorAll(t)},r=function(t){return document.querySelector(t)},o=function(t,e){return t.classList.add(e)},i=function(){return r("body")},c=function(t){return o(i(),t)},u=function(t){return function(t,e){return t.classList.remove(e)}(i(),t)},s=function(t){return function(t,e){return t.classList.contains(e)}(i(),t)},l=function(){return document.documentElement.offsetHeight}},182:function(t,e,a){"use strict";a.r(e);a(34);var n=a(0),r=a.n(n),o=a(4),i=a.n(o),c=a(55),u=a(2),s=function(t){var e=t.location,a=u.default.getResourcesForPathnameSync(e.pathname);return r.a.createElement(c.a,Object.assign({location:e,pageResources:a},a.json))};s.propTypes={location:i.a.shape({pathname:i.a.string.isRequired}).isRequired},e.default=s},183:function(t,e,a){"use strict";a.d(e,"a",function(){return m});var n=a(184),r=a(0),o=a.n(r),i=a(4),c=a.n(i),u=a(196),s=a.n(u),l=a(176);function m(t){var e=t.description,a=t.lang,r=t.meta,i=t.keywords,c=t.title;return o.a.createElement(l.b,{query:d,render:function(t){var n=e||t.site.siteMetadata.description;return o.a.createElement(s.a,{htmlAttributes:{lang:a},title:c,titleTemplate:"%s | "+t.site.siteMetadata.title,meta:[{name:"description",content:n},{property:"og:title",content:c},{property:"og:description",content:n},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:t.site.siteMetadata.author},{name:"twitter:title",content:c},{name:"twitter:description",content:n}].concat(i.length>0?{name:"keywords",content:i.join(", ")}:[]).concat(r)})},data:n})}m.defaultProps={lang:"en",meta:[],keywords:[]},m.propTypes={description:c.a.string,lang:c.a.string,meta:c.a.array,keywords:c.a.arrayOf(c.a.string),title:c.a.string.isRequired};var d="1025518380"},184:function(t){t.exports={data:{site:{siteMetadata:{title:"Move fast and break things.",description:"Blog posted about ...",author:"wang yao"}}}}},187:function(t,e,a){"use strict";var n=a(0),r=a.n(n),o=a(176),i=(a(153),function(){return r.a.createElement("a",{target:"_blank",href:"https://github.com/Soyn",className:"github","aria-label":"GitHub"},r.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 24 24"},r.a.createElement("path",{d:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"})))}),c=(a(154),function(t){var e=t.title,a=t.location,n=t.rootPath,c=a.pathname===n;return r.a.createElement("div",{className:"top"},!c&&r.a.createElement(o.a,{to:"/",className:"link"},e),r.a.createElement(i,null))}),u=(a(155),function(t){var e=t.title,a=t.location,n=t.rootPath;return a.pathname===n&&r.a.createElement("h1",{className:"home-header"},r.a.createElement(o.a,{to:"/",className:"link"},e))}),s=a(195),l=a.n(s),m=a(181),d=a(178);a(156);var f=function(){var t=Object(n.useState)(!1),e=t[0],a=t[1],o=function(t){var e=function(t){return t?d.d.DARK:d.d.LIGHT}(t);a(t),function(t){switch(t){case d.d.LIGHT:m.b(d.d.LIGHT),m.g(d.d.DARK);break;case d.d.DARK:m.b(d.d.DARK),m.g(d.d.LIGHT)}}(e)};return Object(n.useEffect)(function(){var t=m.f(d.d.DARK);o(t)},[]),r.a.createElement("div",{className:"switch-container"},r.a.createElement("label",{htmlFor:"normal-switch"},r.a.createElement(l.a,{onChange:o,checked:e,id:"normal-switch",height:24,width:48,checkedIcon:r.a.createElement("div",{className:"icon checkedIcon"},"D"),uncheckedIcon:r.a.createElement("div",{className:"icon uncheckedIcon"},"L"),offColor:"#d9dfe2",offHandleColor:"#fff",onColor:"#999",onHandleColor:"#282c35"})))},h=(a(157),function(){return r.a.createElement("footer",{className:"footer"},"©",r.a.createElement("a",{href:"https://github.com/JaeYeopHan"},"Jbee"),", Built with"," ",r.a.createElement("a",{href:"https://github.com/JaeYeopHan/gatsby-starter-bee"},"Gatsby-starter-bee"))}),p=a(180);a(158);a.d(e,"a",function(){return g});var g=function(t){var e=t.location,a=t.title,n=t.children;return r.a.createElement(r.a.Fragment,null,r.a.createElement(c,{title:a,location:e,rootPath:"/"}),r.a.createElement("div",{style:{marginLeft:"auto",marginRight:"auto",maxWidth:Object(p.a)(24),padding:Object(p.a)(1.5)+" "+Object(p.a)(.75)}},r.a.createElement(f,null),r.a.createElement(u,{title:a,location:e,rootPath:"/"}),n,r.a.createElement(h,null)))}},197:function(t,e,a){"use strict";a.d(e,"a",function(){return s});a(198);var n=a(200),r=a(0),o=a.n(r),i=a(176),c=a(201),u=a.n(c),s=(a(159),function(){return o.a.createElement(i.b,{query:l,render:function(t){var e=t.site.siteMetadata,a=e.author,n=e.social,r=e.introduction;return o.a.createElement("div",{className:"bio"},o.a.createElement("div",{className:"author"},o.a.createElement("div",{className:"author-description"},o.a.createElement(u.a,{className:"author-image",fixed:t.avatar.childImageSharp.fixed,alt:a,style:{borderRadius:"100%"}}),o.a.createElement("div",{className:"author-name"},o.a.createElement("span",{className:"author-name-prefix"},"Written by"),o.a.createElement(i.a,{to:"/about",className:"author-name-content"},o.a.createElement("span",null,"@",a)),o.a.createElement("div",{className:"author-introduction"},r),o.a.createElement("p",{className:"author-socials"},n.github&&o.a.createElement("a",{href:"https://github.com/"+n.github},"GitHub"),n.medium&&o.a.createElement("a",{href:"https://medium.com/"+n.medium},"Medium"),n.twitter&&o.a.createElement("a",{href:"https://twitter.com/"+n.twitter},"Twitter"),n.facebook&&o.a.createElement("a",{href:"https://www.facebook.com/"+n.facebook},"Facebook"))))))},data:n})}),l="1177532027"},200:function(t){t.exports={data:{avatar:{childImageSharp:{fixed:{base64:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAATCAYAAACQjC21AAAACXBIWXMAAAsSAAALEgHS3X78AAAAKUlEQVQ4y2N4X8/9n3LM8/9dNfP/D30a/xlGDRw1cNTAUQNHDRwiBgIAuT6swTBw3eEAAAAASUVORK5CYII=",width:72,height:72,src:"/static/1b0a0b38bc74b5cace17ff651bbe2f39/f53aa/profile.png",srcSet:"/static/1b0a0b38bc74b5cace17ff651bbe2f39/f53aa/profile.png 1x"}}},site:{siteMetadata:{author:"wang yao",introduction:"I explain with words and code.",social:{twitter:"",github:"Soyn",medium:"",facebook:""}}}}}},202:function(t,e,a){"use strict";a.d(e,"c",function(){return i}),a.d(e,"a",function(){return c}),a.d(e,"b",function(){return u});var n,r=a(203),o=a.n(r);function i(){return n=new o.a('a[href*="#"]',{speed:500,speedAsDuration:!0})}function c(){if(!n)throw Error("Not founded SmoothScroll instance");return n.destroy(),n=null}function u(t){if(!n)throw Error("Not founded SmoothScroll instance");return n.animateScroll(t),n}}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-1a549fef29f6f5ea1139.js.map